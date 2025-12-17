# Online Ordering System – Frontend

A modern React frontend for a microservice-based Online Ordering System.  
This application provides role-based user experiences for **Customers**, **Vendors**, and **Admins**, and integrates with a Spring Cloud backend via a unified API Gateway.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (fast dev & build)
- **Tailwind CSS** (utility-first styling)
- **Axios** (HTTP client)
- **React Router** (routing)
- **JWT-based authentication**

---

## Features Overview

### Public
- Welcome / Landing Page
- User Registration (Customer / Vendor)
- Login with JWT authentication

### Customer
- Browse menu items (with images)
- Add items to cart (Redis-backed)
- Update cart quantity (`+ / −`)
- Remove items / clear cart
- Place orders
- View order history & status

### Vendor
- Create menu items
- Update menu items
- Delete menu items

### Admin
- View all users
- Delete users
- Role-based access control (RBAC)

---

## Role-Based Access Control

| Role     | Capabilities              |
|----------|---------------------------|
| CUSTOMER | Browse menu, cart, orders |
| VENDOR   | Manage menu items         |
| ADMIN    | Manage users + menu items |

Frontend permissions are enforced using **decoded JWT roles**, while the backend remains authoritative.

---

## API Integration

The frontend communicates exclusively with the backend **API Gateway**.

Key integrations:
- `/api/auth/login`
- `/api/auth/register`
- `/api/menu/items`
- `/api/cart`
- `/api/orders`
- `/api/users` (Admin only)

All requests include JWT authorization headers via a centralized Axios instance.

---

## Project Structure

src/
├── components/
│ └── Navbar.tsx
├── pages/
│ ├── WelcomePage.tsx
│ ├── LoginPage.tsx
│ ├── RegisterPage.tsx
│ ├── MenuPage.tsx
│ ├── CartPage.tsx
│ ├── OrdersPage.tsx
│ ├── VendorMenuPage.tsx
│ └── AdminUsersPage.tsx
├── lib/
│ ├── auth.ts
│ └── http.ts
├── App.tsx
├── main.tsx
└── index.css

---

## Authentication Flow

1. User logs in
2. Backend returns JWT
3. Frontend decodes JWT to extract role
4. Token + role stored in `localStorage`
5. Routes and UI adapt dynamically based on role

---

## Styling & UI

- Tailwind CSS (v3)
- Responsive layout
- Clean landing page
- Subtle gradients & shadows
- Consistent button color system
- No external UI libraries

---

## Running Locally

### Prerequisites
- Node.js 18+

### Install & Run
```bash
npm install
npm run dev

