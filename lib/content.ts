export const PROPERTY = {
  name: "The Summer House",
  village: "Crantock, Newquay, Cornwall",
  tagline: "A modern beach house, five minutes' walk from the sand.",
  description: `A modern day beach house — a beautiful, detached family home just a five-minute walk from both the beach and village life. This gorgeous retreat oozes style and comfort.

The Summer House offers fabulous accommodation for your holiday at Crantock, with large sandy beaches to enjoy until your heart's content. The house is furnished to a high standard with a modern kitchen/dining room offering plenty of space for cooking up a feast and dining together after a day on the beach. The cosy sitting room is a great place to retreat at the end of the day. Large doors open onto the contemporary enclosed rear garden — perfect for warm evenings, with a good-sized patio, outdoor seating for al fresco dining, a pizza oven and a fire-pit for toasting marshmallows under the stars.

Upstairs there are four bedrooms. Bedroom one is a striking room with a king-size bed in calming natural tones and its own en suite shower room. Bedroom two has a king-size bed and bedroom three a cosy double. Bedroom four is a twin room, suitable for children. There's also a family bathroom and a ground-floor WC.

The charming Cornish village of Crantock has thatched cottages, a village shop, two pubs and a beautiful Norman church — a five-minute walk away, close to Newquay but with a slower pace of life. Recommended: Jam Jar for artisan pizza and wine in the village. Nearby: Perranporth and Watergate Bay beaches, St Agnes and Trevaunance Cove, and Padstow for the Camel Trail, the harbour and fish and chips.`,
  layout: [
    {
      title: "Ground floor",
      items: [
        "Entrance hall",
        "Sitting room with Smart TV",
        "Kitchen/dining room — induction hob, electric oven, microwave, fridge/freezer, wine fridge, dishwasher",
        "Utility room — washing machine, tumble dryer",
        "Cloakroom — WC, wash-basin",
      ],
    },
    {
      title: "First floor",
      items: [
        "Bedroom 1 — king-size bed, en suite shower room",
        "Bedroom 2 — king-size bed",
        "Bedroom 3 — double bed",
        "Bedroom 4 — twin beds (children only)",
        "Family bathroom — bath, shower, WC, wash-basin",
      ],
    },
  ],
  features: [
    "5-minute walk to beach and village",
    "Sleeps up to 6 adults across 3 double rooms, plus a children's twin room",
    "Enclosed garden with pizza oven and fire-pit",
    "Private parking for 2 cars",
    "EV charging point (at cost, payable to the owner)",
    "WiFi throughout",
    "Regret no pets, no smoking",
  ],
  arrivalNote:
    "Arrival and departure are on Saturdays. Check in from 3pm, depart by 10am.",
};

export const BOOKING_BASICS = {
  depositPercentage: 10,
  securityDeposit: 250,
  balanceDueDaysBeforeArrival: 70, // 10 weeks
};

export const HOW_BOOKING_WORKS: { title: string; body: string }[] = [
  {
    title: "1. Request a week",
    body: "Pick any available week below and tap \"Request this week\". It's held for you while we get things moving — no payment yet.",
  },
  {
    title: "2. Pay your deposit",
    body: `A 10% deposit secures the week. We'll be in touch by WhatsApp or email with how to pay.`,
  },
  {
    title: "3. Agree to the terms",
    body: "A quick tick to confirm you've read our booking terms — cancellation policy, house rules, that sort of thing.",
  },
  {
    title: "4. You're locked in",
    body: "Once your deposit lands, we'll confirm your booking and this week comes off the table for everyone else.",
  },
];

export const TERMS_AND_CONDITIONS: { title: string; body: string }[] = [
  {
    title: "1. The booking contract",
    body: "This booking is between Matt Gajdus and Alex Fairhurst (\"the Owners\") of The Summer House, Crantock, Newquay, Cornwall, and the lead guest named on the booking (\"the Guest\"). The lead guest must be at least 18 years old and is responsible for all members of their party and for these terms being followed throughout the stay.",
  },
  {
    title: "2. Prices, deposit and balance",
    body: "The price shown is for the whole week (Saturday to Saturday), for up to the maximum occupancy stated below. A deposit of 10% of the total price is due to secure a booking. The remaining balance is due 10 weeks (70 days) before the arrival date. If the balance isn't paid by the due date, the Owners may treat the booking as cancelled by the Guest. Bookings made within 10 weeks of arrival are payable in full at the time of booking.",
  },
  {
    title: "3. Cancellation by the Guest",
    body: "The deposit is non-refundable once paid. If you cancel more than 10 weeks before arrival, you lose your deposit only. If you cancel within 10 weeks of arrival, the full balance remains payable, unless the Owners are able to re-let the week to someone else, in which case you'll be refunded what was re-let, less your deposit and any reasonable re-letting costs. We strongly recommend Guests take out their own travel/cancellation insurance.",
  },
  {
    title: "4. Cancellation by the Owners",
    body: "The Owners may cancel a booking and refund everything paid, with no further liability, if the property becomes unavailable for reasons beyond their control (e.g. fire, flood, storm damage), or if the Guest seriously breaches these terms.",
  },
  {
    title: "5. Security deposit",
    body: "A refundable security deposit of £250 covers any damage, breakages, excess cleaning, or additional unauthorised guests beyond the number booked. Any deduction will be itemised and shared with the Guest. This is currently arranged directly with Matt and Alex rather than taken automatically through this site.",
  },
  {
    title: "6. Arrival and departure",
    body: "Check-in is from 3:00pm on the Saturday of your stay; check-out is by 10:00am on the departure Saturday. Please let us know if you expect to arrive later than 7pm.",
  },
  {
    title: "7. Occupancy",
    body: "The property sleeps a maximum of 6 adults (3 double bedrooms, one with en suite) plus one children's twin room. The booking is for the named party only — no sub-letting, and no additional guests, parties or events beyond the numbers booked without the Owners' prior agreement.",
  },
  {
    title: "8. House rules",
    body: "No pets — regretfully, this is a pet-free home. No smoking anywhere inside the property. Please treat the property, its contents and the neighbours with care and respect. Bins/recycling should be put out as described in the house guide provided after booking. WiFi is provided for guests' reasonable personal use. Private parking is available for 2 cars, at the Guest's own risk. A serious or repeated breach of these house rules is treated as a serious breach of contract under Section 4.",
  },
  {
    title: "9. Access during your stay",
    body: "The Owners (or someone acting for them, such as the housekeeper) may need reasonable access to the property during your stay for emergency repairs. Wherever possible, notice will be given first.",
  },
  {
    title: "10. Liability",
    body: "The Owners aren't liable for loss, damage, illness or injury to Guests, their party, or their belongings, except where this is caused by the Owners' own negligence. Guests are responsible for supervising children and for their own safety around features such as the fire-pit, pizza oven and hot water tap.",
  },
  {
    title: "11. Your information",
    body: "Contact details provided when booking (name and phone number) are used only to manage your booking and stay, and are never shared with third parties, in line with UK data protection law.",
  },
  {
    title: "12. Governing law",
    body: "These terms are governed by the law of England and Wales.",
  },
];

export const HOUSE_GUIDE: { title: string; body: string }[] = [
  {
    title: "Kitchen & hob",
    body: "Miele induction hob: press the far-left button to switch on, tap one of the four rings to select it (it will flash), then choose a power level from 1–9. The hobs only heat with a pan directly on top. The hot water tap (left-hand lever, set to 98°) gives boiling water on demand — please take care using it.",
  },
  {
    title: "Utility room",
    body: "Washing machine: turn the dial to your programme, press OK, adjust temperature/spin, then press the green START button. Tumble dryer: press ON, choose your setting with the dial, press the button to the right to start. Please clean the filter and drain the water drawer (top left) after every use.",
  },
  {
    title: "TV & streaming",
    body: "Sky remote controls both TV and box in the lounge and kitchen/diner. Netflix and Prime are both available via the Sky menu's App section (separate kids/adult logins for Netflix, no PINs needed) — please don't log into your own accounts.",
  },
  {
    title: "Sonos speaker",
    body: "The Sonos Move can be used over WiFi (via the Sonos app) or as a Bluetooth speaker — press the Bluetooth button once to switch modes, then hold it to pair. Please be mindful of the volume in the garden out of respect for neighbours.",
  },
  {
    title: "Solar & EV charging",
    body: "The house runs on solar where possible — nothing for you to do there. The Zappi EV charger is on the drive: scan the blue QR code on the pedestal with your phone, link a card, and you'll see the price per kWh before starting a charge. Please don't touch any settings on the charger itself.",
  },
  {
    title: "Bins",
    body: "Please put bins out on Sunday evening for Monday morning collection. Food waste (green caddy) is collected every week — bags are in the utility room cupboard. General rubbish and recycling (black box for glass, red bag for plastic/metal, orange for cardboard, blue for paper) alternate fortnightly — we'll confirm your exact weeks closer to your stay.",
  },
  {
    title: "In an emergency",
    body: "Doctors (NHS 111): Narrowcliff Surgery, Newquay — 01637 854433. Minor injuries: Newquay Hospital, St Thomas Road, TR7 1RQ — 01637 834800. A&E (999): Royal Cornwall Hospital, Treliske, Truro, TR1 3LQ.",
  },
];

export function whatsappInviteMessage(params: {
  guestName: string;
  link: string;
  isReturning: boolean;
}) {
  const { guestName, link, isReturning } = params;
  if (isReturning) {
    return `Hi ${guestName}! It's Matt & Alex from The Summer House in Crantock. As promised, here's your own private link to see this year's availability and lock in your loyalty rate for 2027: ${link}\n\nHave a look and let us know which week suits — no login needed, just tap the link.`;
  }
  return `Hi ${guestName}! This is Matt & Alex — we'd love to have you stay at The Summer House in Crantock. Here's a private link with photos, availability and pricing for 2027: ${link}\n\nHave a browse and pick a week that works — no login needed, just tap the link.`;
}
