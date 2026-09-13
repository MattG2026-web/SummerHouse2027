import { headers } from "next/headers";
import { callRpc, ADMIN_SECRET, HOUSEKEEPER_SECRET } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";
import { formatDate, formatDateShort, formatMoney } from "@/lib/dates";
import { whatsappInviteMessage } from "@/lib/content";
import CopyButton from "@/components/CopyButton";
import {
  loginAction,
  logoutAction,
  createInviteAction,
  markDepositPaidAction,
  releaseWeekAction,
  updatePriceAction,
  uploadPhotosAction,
  deletePhotoAction,
} from "./actions";

export const dynamic = "force-dynamic";

type GuestRow = {
  guest_id: string;
  guest_name: string;
  guest_phone: string | null;
  guest_token: string;
  is_returning_guest: boolean;
  created_at: string;
  has_active_booking: boolean;
};

type GalleryRow = {
  id: string;
  url: string;
  sort_order: number;
};

type OverviewRow = {
  week_id: string;
  start_date: string;
  end_date: string;
  standard_price: string;
  loyalty_price: string | null;
  week_status: string;
  booking_id: string | null;
  guest_id: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  guest_token: string | null;
  booking_status: string | null;
  agreed_price: string | null;
  deposit_amount: string | null;
  deposit_paid_at: string | null;
  balance_due_date: string | null;
  extra_requests: string | null;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { error?: string; created?: string; name?: string; returning?: string };
}) {
  if (!isAdminRequest()) {
    return <LoginScreen error={!!searchParams.error} />;
  }

  const host = headers().get("host");
  const proto = host?.startsWith("localhost") ? "http" : "https";
  const base = `${proto}://${host}`;

  const overview = await callRpc<OverviewRow[]>("summerhouse_admin_overview", {
    p_admin_key: ADMIN_SECRET,
  });
  const guests = await callRpc<GuestRow[]>("summerhouse_admin_list_guests", {
    p_admin_key: ADMIN_SECRET,
  });
  const photos = await callRpc<GalleryRow[]>("summerhouse_get_gallery", {});

  const createdToken = searchParams.created;
  const createdName = searchParams.name;
  const createdReturning = searchParams.returning === "1";

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-deep">Summer House 2027 — owner dashboard</h1>
        <form action={logoutAction}>
          <button className="text-sm text-deep/50 hover:text-deep">Log out</button>
        </form>
      </div>

      {createdToken && (
        <div className="mb-8 rounded-xl bg-seafoam/10 border border-seafoam/30 p-5">
          <p className="text-sm font-semibold text-deep mb-2">
            Invite created{createdName ? ` for ${createdName}` : ""}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="text-xs bg-white px-2 py-1 rounded border border-deep/10 break-all">
              {base}/g/{createdToken}
            </code>
            <CopyButton text={`${base}/g/${createdToken}`} label="Copy link" />
            <CopyButton
              text={whatsappInviteMessage({
                guestName: createdName || "there",
                link: `${base}/g/${createdToken}`,
                isReturning: createdReturning,
              })}
              label="Copy WhatsApp message"
            />
          </div>
        </div>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-serif text-deep mb-3">2027 weeks</h2>
        <div className="space-y-3">
          {overview.map((row) => (
            <div key={row.week_id} className="rounded-xl border border-deep/10 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-deep">
                    {formatDateShort(row.start_date)} – {formatDate(row.end_date)}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-driftwood mt-0.5">
                    {row.week_status}
                  </p>
                </div>

                <form action={updatePriceAction} className="flex items-center gap-2 text-sm">
                  <input type="hidden" name="week_id" value={row.week_id} />
                  <label className="flex items-center gap-1">
                    Std £
                    <input
                      name="standard_price"
                      defaultValue={row.standard_price}
                      className="w-20 border border-deep/20 rounded px-1.5 py-0.5"
                    />
                  </label>
                  <label className="flex items-center gap-1">
                    Loyalty £
                    <input
                      name="loyalty_price"
                      defaultValue={row.loyalty_price || ""}
                      className="w-20 border border-deep/20 rounded px-1.5 py-0.5"
                    />
                  </label>
                  <button className="rounded-full border border-deep/20 px-3 py-1 text-xs hover:bg-deep hover:text-white transition">
                    Save
                  </button>
                </form>
              </div>

              {row.guest_name && (
                <div className="mt-3 pt-3 border-t border-deep/10 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="text-deep">
                      {row.guest_name}
                      {row.guest_phone ? ` · ${row.guest_phone}` : ""}
                    </p>
                    <p className="text-deep/60">
                      {row.booking_status} · {formatMoney(row.agreed_price)} · deposit{" "}
                      {formatMoney(row.deposit_amount)}
                      {row.deposit_paid_at ? " (paid)" : ""}
                    </p>
                    {row.extra_requests && (
                      <p className="text-deep/60 mt-1">
                        <span className="font-medium text-deep/70">Room / extras: </span>
                        {row.extra_requests}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {row.booking_status !== "deposit_paid" && row.booking_status !== "confirmed" && (
                      <form action={markDepositPaidAction}>
                        <input type="hidden" name="booking_id" value={row.booking_id || ""} />
                        <button className="rounded-full bg-seafoam text-white text-xs font-medium px-3 py-1.5 hover:bg-deep transition">
                          Mark deposit paid
                        </button>
                      </form>
                    )}
                    <form action={releaseWeekAction}>
                      <input type="hidden" name="week_id" value={row.week_id} />
                      <button className="rounded-full border border-deep/20 text-xs px-3 py-1.5 hover:bg-red-50 hover:border-red-300 transition">
                        Release week
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-serif text-deep mb-3">Photos</h2>
        <form
          action={uploadPhotosAction}
          className="rounded-xl border border-deep/10 bg-white p-5 flex flex-wrap gap-3 items-end mb-4"
        >
          <label className="flex flex-col text-sm flex-1 min-w-[200px]">
            Add photos (choose several at once — straight from your phone's camera roll works fine)
            <input
              type="file"
              name="photos"
              accept="image/*"
              multiple
              required
              className="border border-deep/20 rounded px-2 py-1.5 mt-1 text-sm"
            />
          </label>
          <button className="rounded-full bg-deep text-white text-sm font-medium px-4 py-2 hover:bg-seafoam transition">
            Upload
          </button>
        </form>

        {photos.length === 0 ? (
          <p className="text-sm text-deep/50">
            No photos yet — the guest page will show a placeholder until you add some.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {photos.map((p) => (
              <div key={p.id} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt=""
                  className="w-full h-24 object-cover rounded-lg border border-deep/10"
                />
                <form action={deletePhotoAction} className="absolute top-1 right-1">
                  <input type="hidden" name="photo_id" value={p.id} />
                  <button
                    className="rounded-full bg-black/60 text-white text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    title="Remove photo"
                  >
                    ×
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-serif text-deep mb-3">Send a new invite</h2>
        <form action={createInviteAction} className="rounded-xl border border-deep/10 bg-white p-5 flex flex-wrap gap-3 items-end">
          <label className="flex flex-col text-sm">
            Guest name
            <input name="name" required className="border border-deep/20 rounded px-2 py-1.5 mt-1" />
          </label>
          <label className="flex flex-col text-sm">
            Phone (optional)
            <input name="phone" className="border border-deep/20 rounded px-2 py-1.5 mt-1" />
          </label>
          <label className="flex items-center gap-2 text-sm mb-1.5">
            <input type="checkbox" name="is_returning" />
            2026 returning guest (loyalty rate)
          </label>
          <button className="rounded-full bg-deep text-white text-sm font-medium px-4 py-2 hover:bg-seafoam transition">
            Create invite link
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-serif text-deep mb-3">Invited guests</h2>
        <div className="space-y-2">
          {guests.length === 0 && (
            <p className="text-sm text-deep/50">No invites sent yet.</p>
          )}
          {guests.map((g) => (
            <div
              key={g.guest_id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-deep/10 bg-white px-4 py-3 text-sm"
            >
              <div>
                <span className="font-medium text-deep">{g.guest_name}</span>
                {g.guest_phone ? ` · ${g.guest_phone}` : ""}
                {g.is_returning_guest && (
                  <span className="ml-2 text-xs text-seafoam">loyalty rate</span>
                )}
                {g.has_active_booking && (
                  <span className="ml-2 text-xs text-deep/50">has a booking</span>
                )}
              </div>
              <div className="flex gap-2">
                <CopyButton text={`${base}/g/${g.guest_token}`} label="Copy link" />
                <CopyButton
                  text={whatsappInviteMessage({
                    guestName: g.guest_name,
                    link: `${base}/g/${g.guest_token}`,
                    isReturning: g.is_returning_guest,
                  })}
                  label="Copy WhatsApp message"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-deep/10 bg-white p-5">
        <h2 className="text-lg font-serif text-deep mb-2">Housekeeper access</h2>
        <p className="text-sm text-deep/60 mb-3">
          A simple, read-only page for whoever looks after the house — names,
          dates and any room/extra requests. No prices, no phone numbers, no
          settings.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="text-xs bg-stone-50 px-2 py-1 rounded border border-deep/10 break-all">
            {base}/housekeeper — passcode: {HOUSEKEEPER_SECRET}
          </code>
          <CopyButton text={`${base}/housekeeper`} label="Copy link" />
          <CopyButton text={HOUSEKEEPER_SECRET} label="Copy passcode" />
        </div>
      </section>
    </main>
  );
}

function LoginScreen({ error }: { error: boolean }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form action={loginAction} className="max-w-xs w-full space-y-3">
        <h1 className="text-xl font-serif text-deep text-center">Owner login</h1>
        <input
          type="password"
          name="passcode"
          placeholder="Passcode"
          required
          className="w-full border border-deep/20 rounded px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">Wrong passcode.</p>}
        <button className="w-full rounded-full bg-deep text-white font-medium py-2 hover:bg-seafoam transition">
          Log in
        </button>
      </form>
    </main>
  );
}
