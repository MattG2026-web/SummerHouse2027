"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  callRpc,
  ADMIN_SECRET,
  uploadGalleryPhoto,
  deleteGalleryPhoto,
} from "@/lib/supabase";
import { adminCookie, clearedAdminCookie, isAdminRequest } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const passcode = String(formData.get("passcode") || "");
  if (passcode !== ADMIN_SECRET) {
    redirect("/admin?error=1");
  }
  const c = adminCookie();
  cookies().set(c.name, c.value, c);
  redirect("/admin");
}

export async function logoutAction() {
  const c = clearedAdminCookie();
  cookies().set(c.name, c.value, c);
  redirect("/admin");
}

export async function createInviteAction(formData: FormData) {
  if (!isAdminRequest()) redirect("/admin");
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const isReturning = formData.get("is_returning") === "on";
  if (!name) redirect("/admin");

  const token = await callRpc<string>("summerhouse_create_invite", {
    p_admin_key: ADMIN_SECRET,
    p_name: name,
    p_phone: phone || null,
    p_is_returning: isReturning,
  });

  const qs = new URLSearchParams({
    created: token,
    name,
    returning: isReturning ? "1" : "0",
  });
  redirect(`/admin?${qs.toString()}`);
}

export async function markDepositPaidAction(formData: FormData) {
  if (!isAdminRequest()) redirect("/admin");
  const bookingId = String(formData.get("booking_id") || "");
  if (!bookingId) return;
  await callRpc("summerhouse_mark_deposit_paid", {
    p_admin_key: ADMIN_SECRET,
    p_booking_id: bookingId,
  });
  revalidatePath("/admin");
}

export async function releaseWeekAction(formData: FormData) {
  if (!isAdminRequest()) redirect("/admin");
  const weekId = String(formData.get("week_id") || "");
  if (!weekId) return;
  await callRpc("summerhouse_release_week", {
    p_admin_key: ADMIN_SECRET,
    p_week_id: weekId,
  });
  revalidatePath("/admin");
}

export async function updatePriceAction(formData: FormData) {
  if (!isAdminRequest()) redirect("/admin");
  const weekId = String(formData.get("week_id") || "");
  const standard = parseFloat(String(formData.get("standard_price") || "0"));
  const loyalty = parseFloat(String(formData.get("loyalty_price") || "0"));
  if (!weekId || Number.isNaN(standard)) return;
  await callRpc("summerhouse_update_week_price", {
    p_admin_key: ADMIN_SECRET,
    p_week_id: weekId,
    p_standard_price: standard,
    p_loyalty_price: Number.isNaN(loyalty) ? null : loyalty,
  });
  revalidatePath("/admin");
}

export async function uploadPhotosAction(formData: FormData) {
  if (!isAdminRequest()) redirect("/admin");

  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

  for (const file of files) {
    try {
      const bytes = await file.arrayBuffer();
      const { url, path } = await uploadGalleryPhoto(
        file.name || "photo.jpg",
        file.type || "image/jpeg",
        bytes
      );
      await callRpc("summerhouse_admin_add_photo", {
        p_admin_key: ADMIN_SECRET,
        p_url: url,
        p_storage_path: path,
      });
    } catch {
      // Skip any file that fails to upload rather than aborting the whole batch.
    }
  }

  revalidatePath("/admin");
  revalidatePath("/g/[token]", "page");
}

export async function deletePhotoAction(formData: FormData) {
  if (!isAdminRequest()) redirect("/admin");
  const photoId = String(formData.get("photo_id") || "");
  if (!photoId) return;

  const path = await callRpc<string>("summerhouse_admin_delete_photo", {
    p_admin_key: ADMIN_SECRET,
    p_photo_id: photoId,
  });
  if (path) await deleteGalleryPhoto(path);

  revalidatePath("/admin");
  revalidatePath("/g/[token]", "page");
}
