# CredFlow


CredFlow is a full-stack Loan Management System built with React, Node.js, and MongoDB. It covers the complete loan lifecycle — authentication, EMI scheduling and payments, and role-based dashboards — with a clean and responsive UI.

---

## Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Passwords hashed with bcrypt
- Role-based access control (**Admin** & **Customer**)
- Protected routes to prevent unauthorized access

### Loan Management
- Customers can apply for loans (amount, interest rate, tenure)
- Automatic EMI and total payable calculation
- Loan status tracking: **Pending**, **Approved**, **Rejected**, **Completed**
- Admin approval / rejection workflow
- Customers and admins can delete loans they own (or any loan, for admins)

### EMI Tracker & Payments
- Month-by-month EMI schedule generated per loan
- Mark individual EMI installments as paid
- Remaining balance updates automatically; loan marked **Completed** when fully paid
- Payment records with mode support (UPI, cash, bank)
- Payment history per loan

### Dashboard
- Role-aware dashboard for Admin and Customer
- KPI cards for quick insights (totals, pending, completed, amounts)
- Loan status charts (bar & pie) using Recharts
- Dark / light theme toggle

### UI & UX
- Fully responsive (mobile, tablet, desktop)
- Tailwind CSS–based fintech-style design
- Lucide icons and reusable layout components
- Loading skeletons and empty states

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19 (Vite), Tailwind CSS 4, Axios, React Router DOM, Recharts, Lucide React |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs |
| **Auth** | JWT (7-day expiry), role middleware |

---

## Project Structure

```
cred-flow-main/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Auth, loans, EMI, payments, dashboard
│   │   ├── middleware/      # JWT protect & role authorization
│   │   ├── models/          # User, Loan, Payment
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # EMI calculator
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout, charts, EMI table, cards
│   │   ├── hooks/           # useAuth, useTheme
│   │   ├── pages/           # Auth, dashboard, loans, EMI tracker
│   │   ├── routes/          # App routes & ProtectedRoute
│   │   ├── services/        # API clients
│   │   └── utils/
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- MongoDB Atlas account, or a local MongoDB instance

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Subashreev18/Smart-Loan-and-EMI-Management-System.git
cd Smart-Loan-and-EMI-Management-System
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

---

## Environment Variables

Create env files from the examples before running the project.

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (`frontend/.env`)

Copy from `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Usage

Start the backend server:

```bash
cd backend
npm run dev
```

Start the frontend application (in a separate terminal):

```bash
cd frontend
npm run dev
```

Open your browser and visit:

**http://localhost:5173**

| Script | Description |
| --- | --- |
| `npm run dev` (backend) | Start API with Nodemon |
| `npm start` (backend) | Start API in production mode |
| `npm run dev` (frontend) | Start Vite dev server |
| `npm run build` (frontend) | Build production bundle |

---

## App Routes (Frontend)

| Path | Access | Description |
| --- | --- | --- |
| `/login` | Public | User login |
| `/register` | Public | Customer registration |
| `/` | Customer, Admin | Dashboard with KPIs & charts |
| `/loans` | Customer, Admin | View loans |
| `/loans/create` | Customer | Apply for a new loan |
| `/emi-tracker` | Customer, Admin | View / pay EMI schedule |
| `/admin/loans` | Admin | Approve or reject loans |

---

## Admin Access

Admins are **not** publicly registered. New signups are always created with the `customer` role.

To create an admin:

1. Register a normal user through the app
2. Update the user's role in MongoDB:

```json
{
  "role": "admin"
}
```

This follows real-world security practice by keeping privileged roles out of public registration.

---

## API Overview

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register customer |
| `POST` | `/auth/login` | Public | Login user |

### Loans
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/loans` | Customer | Create loan application |
| `GET` | `/loans` | Authenticated | List loans (own loans for customers; all for admin) |
| `PUT` | `/loans/:id/status` | Admin | Approve or reject loan |
| `DELETE` | `/loans/:id` | Owner / Admin | Delete a loan |

### EMI
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/emi/:loanId` | Owner / Admin | Get EMI schedule |
| `PUT` | `/emi/pay/:loanId/:month` | Owner / Admin | Mark EMI month as paid |

### Payments
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/payments` | Customer | Record a payment |
| `GET` | `/payments/:loanId` | Authenticated | Payment history for a loan |

### Dashboard
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/dashboard/stats` | Admin | Aggregate loan & collection stats |

Authenticated requests require:

```
Authorization: Bearer <token>
```

---

## Loan Lifecycle

```
Customer applies → Status: pending
       ↓
Admin approves / rejects
       ↓
If approved → Customer pays EMIs via EMI Tracker
       ↓
All EMIs paid → Status: completed
```

EMI is calculated using the standard reducing-balance formula based on principal, annual interest rate, and tenure (months).

---

## Contributing

Contributions are welcome. If you find a bug or have a feature suggestion, please open an issue or submit a pull request.
