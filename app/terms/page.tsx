// app/terms/page.tsx
// The Summer House — Booking Terms & Conditions (2027 season)
// Paste this over the entire contents of app/terms/page.tsx and commit.

export const metadata = {
  title: "Booking Terms & Conditions — The Summer House",
};

const wrap = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "48px 20px 80px",
  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  color: "#1f2933",
  lineHeight: 1.6,
} as const;

const h1 = { fontSize: 30, margin: "0 0 4px", fontWeight: 700 } as const;
const sub = { fontSize: 17, color: "#6b7280", marginTop: 0, marginBottom: 32 } as const;
const h2 = { fontSize: 19, fontWeight: 600, margin: "32px 0 8px" } as const;
const p = { margin: "0 0 12px" } as const;
const ul = { margin: "0 0 12px", paddingLeft: 22 } as const;
const li = { margin: "0 0 8px" } as const;

export default function TermsPage() {
  return (
    <main style={wrap}>
      <h1 style={h1}>The Summer House</h1>
      <p style={sub}>Booking Terms &amp; Conditions — 2027 season</p>

      <h2 style={h2}>1. The booking contract</h2>
      <p style={p}>
        This booking is between Matt Gajdus and Alex Fairhurst (&ldquo;the Owners&rdquo;),
        of The Summer House, 12 Kelsey Drive, Crantock, Newquay, Cornwall, TR8 5FR, and the
        lead guest named on the booking (&ldquo;the Guest&rdquo;). The lead guest must be at
        least 18 years old and is responsible for all members of their party and for these
        terms being followed throughout the stay.
      </p>

      <h2 style={h2}>2. Prices, deposit and balance</h2>
      <ul style={ul}>
        <li style={li}>The price shown is for the whole week (Saturday to Saturday), for up to the maximum occupancy stated below.</li>
        <li style={li}>A deposit of £250 is due to secure a booking. Paying it reserves your week and takes it off the market. The deposit counts towards the total price — it is part-payment, not an extra charge.</li>
        <li style={li}>The balance (the total price less the £250 deposit) is due 10 weeks (70 days) before the arrival date.</li>
        <li style={li}>If the balance isn&rsquo;t paid by the due date, the Owners may treat the booking as cancelled by the Guest (see Section 3).</li>
        <li style={li}>Bookings made within 10 weeks of arrival are payable in full at the time of booking.</li>
        <li style={li}>Payment is by bank transfer; details are provided when you book.</li>
      </ul>

      <h2 style={h2}>3. Cancellation by the Guest</h2>
      <ul style={ul}>
        <li style={li}><strong>30-day grace period:</strong> if you cancel within 30 days of paying your deposit, the £250 is refunded in full — no questions asked. (If your arrival date falls within that 30 days, the terms below apply instead.)</li>
        <li style={li}><strong>After the 30-day grace period:</strong> the £250 deposit is non-refundable.</li>
        <li style={li}><strong>If you cancel within 10 weeks of arrival:</strong> the full balance remains payable, unless the Owners are able to re-let the week to someone else — in which case you&rsquo;ll be refunded whatever the week is re-let for, less your £250 deposit and any reasonable re-letting costs.</li>
        <li style={li}>We strongly recommend Guests take out their own travel/cancellation insurance, since illness, travel disruption or a change of plans aren&rsquo;t covered by the above.</li>
      </ul>

      <h2 style={h2}>4. Cancellation by the Owners</h2>
      <p style={p}>
        The Owners may cancel a booking and refund everything paid, with no further liability,
        if: the property becomes unavailable for reasons beyond their control (e.g. fire, flood,
        storm damage); or the Guest seriously breaches these terms (see Section 8).
      </p>

      <h2 style={h2}>5. Damage and breakages</h2>
      <p style={p}>
        There is no security deposit to pay. In return, the Guest agrees to take reasonable
        care of the property and its contents, and to report any damage or breakage promptly.
        The Guest is responsible for the reasonable cost of putting right any damage, breakage
        or excessive cleaning caused during their stay, beyond normal wear and tear. Any such
        cost will be itemised and shared with the Guest.
      </p>

      <h2 style={h2}>6. Arrival and departure</h2>
      <p style={p}>
        Check-in is from 3:00pm on the Saturday of your stay; check-out is by 10:00am on the
        departure Saturday. Please let us know if you expect to arrive later than 7pm.
      </p>

      <h2 style={h2}>7. Occupancy</h2>
      <p style={p}>
        The property sleeps a maximum of 6 adults and 2 children — 8 guests in total. The 2
        children are accommodated in the twin bedroom, which is suitable for children only.
        Sleeping is otherwise across 3 double bedrooms (one with en suite) for up to 6 adults.
        The booking is for the named party only — no sub-letting, and no additional guests,
        parties or events beyond the numbers booked without the Owners&rsquo; prior agreement.
      </p>

      <h2 style={h2}>8. House rules</h2>
      <ul style={ul}>
        <li style={li}><strong>No pets</strong> — regretfully, this is a pet-free home.</li>
        <li style={li}><strong>No smoking</strong> anywhere inside the property.</li>
        <li style={li}>Please treat the property, its contents and the neighbours with care and respect — this is a residential street.</li>
        <li style={li}>Bins/recycling should be put out as described in the house guide provided after booking.</li>
        <li style={li}>WiFi is provided for guests&rsquo; reasonable personal use; please don&rsquo;t use it for anything illegal.</li>
        <li style={li}>Private parking is available for 2 cars, at the Guest&rsquo;s own risk — the Owners aren&rsquo;t liable for loss or damage to vehicles or their contents.</li>
      </ul>
      <p style={p}>A serious or repeated breach of these house rules is treated as a serious breach of contract under Section 4.</p>

      <h2 style={h2}>9. Access during your stay</h2>
      <p style={p}>
        The Owners (or someone acting for them, such as the housekeeper) may need reasonable
        access to the property during your stay for emergency repairs. Wherever possible,
        notice will be given first.
      </p>

      <h2 style={h2}>10. Liability</h2>
      <p style={p}>
        The Owners aren&rsquo;t liable for loss, damage, illness or injury to Guests, their
        party, or their belongings, except where this is caused by the Owners&rsquo; own
        negligence. Guests are responsible for supervising children and for their own safety
        around features such as the barbecue and hot water tap.
      </p>

      <h2 style={h2}>11. Your information</h2>
      <p style={p}>
        Contact details provided when booking (name and phone number) are used only to manage
        your booking and stay, and are never shared with third parties, in line with UK data
        protection law.
      </p>

      <h2 style={h2}>12. Governing law</h2>
      <p style={p}>These terms are governed by the law of England and Wales.</p>
    </main>
  );
}
