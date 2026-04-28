# Project Structure

```text
Hostel-Pass/
├── backend/
│   ├── src/
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── Admin-Portal/
│   │   ├── src/
│   │   │   ├── components/ (common, layout)
│   │   │   ├── context/ (AuthContext.jsx)
│   │   │   ├── firebase/ (config.js)
│   │   │   ├── pages/
│   │   │   │   ├── admin/ (Dashboard, ManageUsers, etc.)
│   │   │   │   ├── AdminLoginPage.jsx
│   │   │   │   └── SetupAdmin.jsx
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   └── package.json
│   ├── Partner-Portal/
│   │   ├── src/
│   │   │   ├── components/ (common, layout)
│   │   │   ├── context/ (AuthContext.jsx)
│   │   │   ├── firebase/ (config.js)
│   │   │   ├── pages/
│   │   │   │   ├── partner/
│   │   │   │   │   ├── Dashboard.jsx
│   │   │   │   │   ├── AddListing.jsx
│   │   │   │   │   ├── EditListing.jsx
│   │   │   │   │   ├── ManageListings.jsx
│   │   │   │   │   ├── ManageBookings.jsx
│   │   │   │   │   ├── Analytics.jsx
│   │   │   │   │   └── Profile.jsx
│   │   │   │   ├── PartnerLoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   └── package.json
│   └── Student-Portal/
│       ├── src/
│       │   ├── components/ (common, layout)
│       │   ├── context/ (AuthContext.jsx)
│       │   ├── firebase/ (config.js)
│       │   ├── pages/
│       │   │   ├── student/
│       │   │   │   ├── Dashboard.jsx
│       │   │   │   ├── SearchResults.jsx
│       │   │   │   ├── PGDetails.jsx
│       │   │   │   ├── Bookings.jsx
│       │   │   │   ├── Payments.jsx
│       │   │   │   ├── PaymentGateway.jsx
│       │   │   │   ├── Complaints.jsx
│       │   │   │   ├── MyReviews.jsx
│       │   │   │   ├── Favorites.jsx
│       │   │   │   ├── Support.jsx
│       │   │   │   └── Profile.jsx
│       │   │   ├── LandingPage.jsx
│       │   │   ├── StudentLoginPage.jsx
│       │   │   └── RegisterPage.jsx
│       │   ├── App.jsx
│       │   └── main.jsx
│       └── package.json
├── firestore.rules
├── storage.rules
├── firebase.json
├── cors.json
└── package.json
```
