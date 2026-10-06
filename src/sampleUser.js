// Turn the demo account on or off
export const USE_SAMPLE_USER = true;

// Phone must be in local format (0XXXXXXXXX). Login accepts +255... too.
// OTP for the demo is set in account.js (DEMO_OTP).
export const sampleUser = {
  name: "Amina Juma",
  phone: "0712345678",
  cardNo: "4829175036481920", // 16 digits
  physical: true, // true = physical card linked, false = virtual card
  status: "active", // "active" | "blocked"
  balance: 12500, // TZS
  tx: [
    // Positive = money in, negative = money spent
    {
      id: 1735000005,
      label: "Ride: Stone Town to Fumba",
      amount: -1500, 
      date: "05/10/2026, 08:15:00",
    },
    {
      id: 1735000004,
      label: "Top up via M-Pesa",
      amount: 10000,
      date: "04/10/2026, 18:40:00",
    },
    {
      id: 1735000003,
      label: "Ride: Mwanakwerekwe to Stone Town",
      amount: -1000,
      date: "03/10/2026, 07:50:00",
    },
    {
      id: 1735000002,
      label: "Top up via Tigo Pesa",
      amount: 5000,
      date: "01/10/2026, 12:05:00",
    },
    {
      id: 1735000001,
      label: "Physical card linked",
      amount: 0,
      date: "30/09/2026, 09:00:00",
    },
  ],
};
