# AL-MAS Self Drive Cars

AL-MAS Self Drive Cars is a premium, portfolio-grade self-drive car rental management web application located in Chennai near Mannady Metro Station.

This application is built as a **local-first frontend prototype** utilizing React 18, Vite, Tailwind CSS v4, Framer Motion, and Recharts, with mock database storage persisted entirely in `localStorage`.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Demo Customer** | `user@gmail.com` | `User@123` |
| **Admin Manager** | `admin@gmail.com` | `Admin@123` |

---

## 🛠️ Features

### Public Portal
- **Hero Section**: Premium heading, tagline, and call-to-actions.
- **Fleet Preview**: Direct grid displaying 6 popular rental vehicles.
- **Verification Details**: Structured documentation required for safety deposits.
- **WhatsApp Chat Integration**: Floating sticky badge to trigger direct enquiry texts.
- **Privacy Disclosures**: Transparency guidelines regarding client-side data.

### Customer Portal (User Dashboard)
- **Logistics Metrics**: Total cars available, upcoming drives, active requests, and account info.
- **Browse & Filter Fleet**: Full fleet list (21 models) with search queries, category splits, and transmission filters.
- **Booking Modal**: Dynamic calendar scheduler with presence checks and location validation.
- **Trip History**: Live status checks on pending, approved, or completed requests.
- **Profile Settings**: Local profile contact updates.

### Admin Panel (Management Console)
- **Analytical Metrics**: Recharts donut splits by booking status, top 5 booked cars bar chart, and weekly intake trends.
- **Bookings Desk**: Row selection detail modals to Approve/Reject requests or complete checkouts.
- **Vehicles CRUD**: Add arrivals, modify categories/transmissions, and delete entries.
- **Inline Pricing Sheet**: Direct inline edits of 12 Hr, 24 Hr, and Extra KM rates.
- **Customers File**: Compute user metrics and browse full rental logs per account.
- **Availability Calendar**: Click calendar cells on a custom month grid to override vehicle dates.
- **System Settings**: Live custom configurations of phone numbers and location markers.

---

## 🚀 Setup & Launch

Follow these steps to run the application locally:

1. Navigate to the project directory:
   ```bash
   cd al-mas-cars
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the local development server:
   ```bash
   npm run dev
   ```
4. Access the portal at the localhost URL output in the terminal (usually `http://localhost:5173`).

To compile the production-ready distribution:
```bash
npm run build
```

---

## 📝 Assumptions

The following design decisions were made to deliver a robust local prototype:
1. **Placeholder Fallbacks**: High-quality stock photo URLs from Unsplash are pre-mapped for all 21 models. If there is no internet access, the UI gracefully renders a gold-gradient badge card with car silhouette vector overlays.
2. **Revenue Calculation**: Revenue analytics sum the default `price24` daily package rate for all approved or completed trips.
3. **Database Seeding**: The initial database check runs on the root mount in `App.jsx`, immediately writing initial users and vehicles to local storage if keys are absent.
4. **Data Unification**: The vehicles management CRUD and pricing modules read and update the same unified array in `localStorage` (`almas_vehicles`) to prevent synchronisation conflicts.
5. **Availability Calendar Cycles**: Clicking a cell in the month availability calendar cycles the override status: `Available` ➔ `Booked Override` ➔ `Under Maintenance` ➔ `Available`.
