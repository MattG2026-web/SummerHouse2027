import { callRpc, HOUSEKEEPER_SECRET } from "@/lib/supabase";
import { isHousekeeperRequest } from "@/lib/auth";
import { formatDate, formatDateShort } from "@/lib/dates";
import { housekeeperLoginAction, housekeeperLogoutAction } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  week_id: string;
  start_date: string;
  end_date: string;
  week_status: string;
  guest_name: string | null;
  booking_status: string | null;
  extra_requests: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  requested: "Requested (awaiting deposit)",
  deposit_due: "Deposit due",
  deposit_paid: "Booked — confirmed",
  confirmed: "Booked — confirmed",
};

export default async function HousekeeperPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (!isHousekeeperRequest()) {
    return <LoginScreen error={!!searchParams.error} />;
  }

  const rows = await callRpc<Row[]>("summerhouse_housekeeper_overview", {
    p_key: HOUSEKEEPER_SECRET,
  });

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-serif text-deep">
          Summer House — bookings
        </h1>
        <form action={housekeeperLogoutAction}>
          <button className="text-sm text-deep/50 hover:text-deep">Log out</button>
        </form>
      </div>

      <div className="space-y-3">
        {rows.map((row) => {
          const booked = !!row.guest_name;
          return (
            <div
              key={row.week_id}
              className="rounded-xl border border-deep/10 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-deep">
                  {formatDateShort(row.start_date)} – {formatDate(row.end_date)}
                </p>
                {booked ? (
                  <span className="text-xs rounded-full bg-seafoam/10 text-seafoam px-2 py-1">
                    {STATUS_LABEL[row.booking_status || ""] || row.booking_status}
                  </span>
                ) : (
                  <span className="text-xs rounded-full bg-stone-100 text-stone-500 px-2 py-1">
                    Not booked
                  </span>
                )}
              </div>

              {booked && (
                <div className="mt-2 text-sm text-deep/80">
                  <p>{row.guest_name}</p>
                  {row.extra_requests && (
                    <p className="mt-1 text-deep/60">
                      <span className="font-medium text-deep/70">Room / extras: </span>
                      {row.extra_requests}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-deep/40">
        This is a pet-free home — no pets should be arriving with any booking.
      </p>
    </main>
  );
}

function LoginScreen({ error }: { error: boolean }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form action={housekeeperLoginAction} className="max-w-xs w-full space-y-3">
        <h1 className="text-xl font-serif text-deep text-center">Bookings login</h1>
        <input
          type="password"
          name="passcode"
          placeholder="Passcode"
          required
          className="w-full border border-deep/20 rounded px-3 py-2 text-base"
        />
        {error && <p className="text-sm text-red-600">Wrong passcode.</p>}
        <button className="w-full rounded-full bg-deep text-white font-medium py-2 hover:bg-seafoam transition">
          Log in
        </button>
      </form>
    </main>
  );
}
