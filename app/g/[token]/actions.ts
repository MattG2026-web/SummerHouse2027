"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { callRpc, RpcError } from "@/lib/supabase";
import { sendBookingRequestEmail } from "@/lib/email";

type GuestBookingRow = {
  guest_name: string;
  is_returning_guest: boolean;
  start_date: string | null;
  end_date: string | null;
  agreed_price: string | null;
  deposit_amount: string | null;
};

export async function requestBookingAction(formData: FormData) {
  const token = String(formData.get("token") || "");
  const weekId = String(formData.get("week_id") || "");
  const extraRequests = String(formData.get("extra_requests") || "");
  const acceptedTerms = formData.get("accepted_terms") === "on";
  if (!token || !weekId) return;

  // Belt-and-braces: the checkbox is `required` in the form, but the database
  // function also refuses the booking if this isn't true, so there's no way
  // to request a week without agreeing to the terms.
  if (!acceptedTerms) {
    redirect(`/g/${token}?terms_required=1`);
  }

  try {
    await callRpc("summerhouse_request_booking", {
      p_token: token,
      p_week_id: weekId,
      p_extra_requests: extraRequests || null,
      p_accepted_terms: acceptedTerms,
    });

    // Notify Matt by email — best-effort, must never block a real booking.
    try {
      const rows = await callRpc<GuestBookingRow[]>("summerhouse_get_guest_booking", {
        p_token: token,
      });
      const guest = rows?.[0];
      if (guest?.start_date && guest?.end_date) {
        await sendBookingRequestEmail({
          guestName: guest.guest_name,
          startDate: guest.start_date,
          endDate: guest.end_date,
          agreedPrice: guest.agreed_price,
          depositAmount: guest.deposit_amount,
          isReturning: guest.is_returning_guest,
        });
      }
    } catch (emailErr) {
      console.error("Booking notification email failed:", emailErr);
    }
  } catch (err) {
    // Swallow — the page will simply not show a booking and the user can
    // try again. In a future pass this can surface a proper error banner.
    if (!(err instanceof RpcError)) throw err;
  }
  revalidatePath(`/g/${token}`);
  redirect(`/g/${token}?requested=1`);
}

export async function updateExtraRequestsAction(formData: FormData) {
  const token = String(formData.get("token") || "");
  const extraRequests = String(formData.get("extra_requests") || "");
  if (!token) return;

  try {
    await callRpc("summerhouse_update_extra_requests", {
      p_token: token,
      p_extra_requests: extraRequests,
    });
  } catch (err) {
    if (!(err instanceof RpcError)) throw err;
  }
  revalidatePath(`/g/${token}`);
  redirect(`/g/${token}?saved=1`);
}
