import { callRpc } from "@/lib/supabase";
import { PROPERTY, BOOKING_BASICS, HOUSE_GUIDE, HOW_BOOKING_WORKS } from "@/lib/content";
import { formatDate, formatDateShort, formatMoney, daysUntil } from "@/lib/dates";
import Gallery, { type GalleryPhoto } from "@/components/Gallery";
import { requestBookingAction, updateExtraRequestsAction } from "./actions";

export const dynamic = "force-dynamic";

type GuestBookingRow = {
  guest_id: string;
  guest_name: string;
  is_returning_guest: boolean;
  booking_id: string | null;
  week_id: string | null;
  start_date: string | null;
  end_date: string | null;
  agreed_price: string | null;
  deposit_amount: string | null;
  deposit_paid_at: string | null;
  balance_due_date: string | null;
  booking_status: string | null;
  extra_requests: string | null;
};

type WeekRow = {
  id: string;
  start_date: string;
  end_date: string;
  standard_price: string;
  loyalty_price: string | null;
  status: string;
};

const STATUS_LABEL: Record<string, string> = {
  requested: "Requested — awaiting your deposit",
  deposit_due: "Deposit due",
  deposit_paid: "Deposit paid — you're booked in!",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

export default async function GuestPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { saved?: string; requested?: string; terms_required?: string };
}) {
  const token = params.token;
  const rows = await callRpc<GuestBookingRow[]>("summerhouse_get_guest_booking", {
    p_token: token,
  });

  if (!rows || rows.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-serif text-deep">Link not recognised</h1>
          <p className="text-deep/70">
            This link doesn&apos;t match one of our invitations. Please check
            you&apos;ve copied it correctly, or get back in touch with
            whoever sent it to you.
          </p>
        </div>
      </main>
    );
  }

  const guest = rows[0];
  const hasActiveBooking = !!guest.booking_id && guest.booking_status !== "cancelled";
  const unlocked = guest.booking_status === "deposit_paid" || guest.booking_status === "confirmed";

  const weeks = await callRpc<WeekRow[]>("summerhouse_get_availability", {});
  const takenCount = weeks.filter((w) => w.status !== "available").length;
  const galleryRows = await callRpc<GalleryPhoto[]>("summerhouse_get_gallery", {}).catch(
    () => [] as GalleryPhoto[]
  );

  const houseInfo = unlocked
    ? await callRpc<Record<string, string> | null>("summerhouse_get_house_info", {
        p_token: token,
      })
    : null;

  return (
    <main className="min-h-screen pb-24">
      {/* Hero */}
      <section className="px-6 pt-10 pb-6 max-w-3xl mx-auto text-center">
        <p className="uppercase tracking-widest text-xs text-seafoam font-semibold">
          {PROPERTY.village}
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif text-deep mt-1">
          {PROPERTY.name}
        </h1>
        <p className="text-deep/70 mt-2">{PROPERTY.tagline}</p>
        <p className="mt-3 text-sm text-deep/60">
          Hi {guest.guest_name.split(" ")[0]} — welcome to your private page.
        </p>
        <p className="mt-2 inline-block text-xs text-driftwood bg-driftwood/10 rounded-full px-3 py-1">
          Please note: this is a pet-free home.
        </p>
      </section>

      {/* Confirmation banners */}
      {searchParams.requested === "1" && (
        <section className="px-6 max-w-2xl mx-auto mb-2">
          <div className="rounded-xl bg-seafoam/10 border border-seafoam/30 text-seafoam text-sm px-4 py-3 text-center">
            Request sent! We&apos;ll be in touch shortly about your deposit.
          </div>
        </section>
      )}
      {searchParams.saved === "1" && (
        <section className="px-6 max-w-2xl mx-auto mb-2">
          <div className="rounded-xl bg-seafoam/10 border border-seafoam/30 text-seafoam text-sm px-4 py-3 text-center">
            Saved — thanks!
          </div>
        </section>
      )}
      {searchParams.terms_required === "1" && (
        <section className="px-6 max-w-2xl mx-auto mb-2">
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 text-center">
            Please tick the box to confirm you agree to our terms before requesting a week.
          </div>
        </section>
      )}

      {/* How booking works */}
      <section className="px-6 max-w-2xl mx-auto mt-2 mb-8">
        <div className="rounded-2xl border border-deep/10 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-serif text-deep mb-4">How booking works</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {HOW_BOOKING_WORKS.map((step) => (
              <div key={step.title}>
                <p className="font-semibold text-deep text-sm">{step.title}</p>
                <p className="text-sm text-deep/70 mt-0.5">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 max-w-5xl mx-auto">
        <Gallery photos={galleryRows} />
      </section>

      {/* Existing booking, if any */}
      {hasActiveBooking && guest.start_date && guest.end_date && (
        <section className="px-6 mt-10 max-w-2xl mx-auto">
          <div className="rounded-2xl bg-deep text-sand p-6 sm:p-8 shadow-lg">
            <p className="text-xs uppercase tracking-widest text-sand/70">
              Your booking
            </p>
            <h2 className="text-xl font-serif mt-1">
              {formatDateShort(guest.start_date)} – {formatDate(guest.end_date)}
            </h2>
            <p className="mt-2 text-sand/90">
              {STATUS_LABEL[guest.booking_status || ""] || guest.booking_status}
            </p>

            {guest.booking_status !== "deposit_paid" && guest.booking_status !== "confirmed" && (
              <p className="mt-4 text-sm text-sand/80">
                Total for the week: {formatMoney(guest.agreed_price)} · Deposit due:{" "}
                {formatMoney(guest.deposit_amount)} ({BOOKING_BASICS.depositPercentage}%). We&apos;ll
                be in touch about how to pay — once your deposit lands, this week is locked in
                just for you.
              </p>
            )}

            {(guest.booking_status === "deposit_paid" || guest.booking_status === "confirmed") && (
              <div className="mt-4 space-y-1 text-sm text-sand/90">
                <p>
                  <span className="font-semibold">{daysUntil(guest.start_date)}</span> days to go
                </p>
                {guest.balance_due_date && (
                  <p>Balance due by {formatDate(guest.balance_due_date)}</p>
                )}
                <p>Total: {formatMoney(guest.agreed_price)} · Deposit paid: {formatMoney(guest.deposit_amount)}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Room set-up & extra requests — editable any time there's an active booking */}
      {hasActiveBooking && (
        <section className="px-6 mt-4 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-deep/10 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-serif text-deep mb-1">
              Room set-up &amp; extra requests
            </h2>
            <p className="text-sm text-deep/60 mb-3">
              Let us know who's sleeping where, or if you need anything extra —
              a travel cot, highchair, that sort of thing. (Sorry, this is a
              pet-free home, so we can't accommodate pets.)
            </p>
            <form action={updateExtraRequestsAction} className="space-y-3">
              <input type="hidden" name="token" value={token} />
              <textarea
                name="extra_requests"
                rows={3}
                defaultValue={guest.extra_requests || ""}
                placeholder="E.g. king bed in bedroom 1 for us, twin room for the kids, travel cot needed"
                className="w-full border border-deep/20 rounded-lg px-3 py-2 text-base"
              />
              <button
                type="submit"
                className="rounded-full bg-deep text-white text-sm font-medium px-4 py-2 hover:bg-seafoam transition"
              >
                Save
              </button>
            </form>
          </div>
        </section>
      )}

      {/* House info, unlocked once deposit is paid */}
      {unlocked && houseInfo && (
        <section className="px-6 mt-8 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-deep/10 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-serif text-deep mb-4">
              Everything you need for your stay
            </h2>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <Info label="Address" value={houseInfo.property_address} />
              <Info label="Check-in" value={`From ${houseInfo.check_in_time}`} />
              <Info label="Check-out" value={`By ${houseInfo.check_out_time}`} />
              <Info label="WiFi network" value={houseInfo.wifi_ssid} />
              <Info label="WiFi password" value={houseInfo.wifi_password} />
              <Info label="Key safe code" value={houseInfo.key_safe_code} />
              <Info label="Matt" value={houseInfo.contact_matt} />
              <Info label="Alex" value={houseInfo.contact_alex} />
            </dl>
            <div className="mt-5 pt-5 border-t border-deep/10 text-sm text-deep/70">
              <p className="font-semibold text-deep mb-1">Cancellation policy</p>
              <p>{houseInfo.cancellation_policy}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-deep/10 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-serif text-deep mb-4">House guide</h2>
            <div className="space-y-4">
              {HOUSE_GUIDE.map((item) => (
                <div key={item.title}>
                  <p className="font-semibold text-deep text-sm">{item.title}</p>
                  <p className="text-sm text-deep/70">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Availability / booking */}
      <section className="px-6 mt-10 max-w-2xl mx-auto">
        <h2 className="text-lg font-serif text-deep mb-1">2027 availability</h2>
        <p className="text-sm text-deep/60 mb-1">
          {guest.is_returning_guest
            ? "Your loyalty rate is shown below."
            : "Prices below are for the week, Saturday to Saturday."}
        </p>
        {takenCount > 0 && (
          <p className="text-sm font-medium text-seafoam mb-4">
            {takenCount} of {weeks.length} weeks already spoken for this summer.
          </p>
        )}
        <div className="space-y-3">
          {weeks
            .filter((w) => !hasActiveBooking || w.id !== guest.week_id)
            .map((w) => {
              const price = guest.is_returning_guest && w.loyalty_price ? w.loyalty_price : w.standard_price;
              const isAvailable = w.status === "available";
              const statusLabel =
                w.status === "requested"
                  ? "Reserved by another guest"
                  : w.status === "booked"
                  ? "Booked"
                  : null;
              return (
                <div
                  key={w.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-5 py-4 ${
                    isAvailable
                      ? "border-deep/10 bg-white"
                      : "border-deep/5 bg-stone-50/70"
                  }`}
                >
                  <div>
                    <p className={`font-medium ${isAvailable ? "text-deep" : "text-deep/50"}`}>
                      {formatDateShort(w.start_date)} – {formatDate(w.end_date)}
                    </p>
                    <p className="text-sm text-deep/60">
                      <span className={isAvailable ? "" : "line-through text-deep/40"}>
                        {formatMoney(price)}
                      </span>
                      {guest.is_returning_guest && w.loyalty_price && isAvailable && (
                        <span className="ml-1 text-xs text-seafoam">loyalty rate</span>
                      )}
                    </p>
                  </div>
                  {isAvailable && !hasActiveBooking && (
                    <form action={requestBookingAction} className="flex flex-col items-end gap-1.5">
                      <input type="hidden" name="token" value={token} />
                      <input type="hidden" name="week_id" value={w.id} />
                      <label className="flex items-center gap-1.5 text-xs text-deep/60 cursor-pointer">
                        <input
                          type="checkbox"
                          name="accepted_terms"
                          required
                          className="rounded border-deep/30"
                        />
                        I agree to the{" "}
                        <a
                          href="/terms"
                          target="_blank"
                          className="underline hover:text-seafoam"
                        >
                          Terms &amp; Conditions
                        </a>
                      </label>
                      <button
                        type="submit"
                        className="whitespace-nowrap rounded-full bg-seafoam text-white text-sm font-medium px-4 py-2 hover:bg-deep transition"
                      >
                        Request this week
                      </button>
                    </form>
                  )}
                  {statusLabel && (
                    <span className="whitespace-nowrap text-xs font-medium text-driftwood bg-driftwood/10 rounded-full px-3 py-1.5">
                      {statusLabel}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </section>

      {/* Property details */}
      <section className="px-6 mt-12 max-w-2xl mx-auto">
        <h2 className="text-lg font-serif text-deep mb-3">About the house</h2>
        <p className="text-deep/80 whitespace-pre-line leading-relaxed text-sm">
          {PROPERTY.description}
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {PROPERTY.layout.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-deep text-sm mb-2">{section.title}</h3>
              <ul className="text-sm text-deep/70 space-y-1 list-disc list-inside">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-deep text-sm mb-2">Good to know</h3>
          <ul className="text-sm text-deep/70 space-y-1 list-disc list-inside">
            {PROPERTY.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="text-sm text-deep/70 mt-2">{PROPERTY.arrivalNote}</p>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-deep/50 text-xs uppercase tracking-wide">{label}</dt>
      <dd className="text-deep font-medium">{value}</dd>
    </div>
  );
}
