# Frontend Components Documentation

## Project Overview
This is an **Employee Portal** application built with React (Vite) + Tailwind CSS. It provides authentication (login, register, OTP verification, forgot/reset password) and a dashboard for managing user profiles, passwords, and active sessions.

---

## 1. App.jsx — Main Application Component

**Path:** `src/App.jsx`

**Purpose:** Root component that sets up routing and authentication context.

**Key Features:**
- Wraps the app in `BrowserRouter` and `AuthProvider`
- Defines two route guard components:
  - **`ProtectedRoute`** — Redirects unauthenticated users to `/login`. Shows a loading spinner while auth state is being determined.
  - **`PublicRoute`** — Redirects already-authenticated users to `/` (Dashboard). Shows a loading spinner while auth state is being determined.
- Defines all application routes:
  - `/` — Dashboard (Protected)
  - `/login` — Login page (Public)
  - `/register` — Register page (Public)
  - `/verify-otp` — OTP verification (Public)
  - `/forgot-password` — Forgot password (Public)
  - `/reset-password` — Reset password (Public)
  - `*` — Fallback redirects to `/`

**Exports:** `App` (default)

---

## 2. AuthContext.jsx — Authentication Context & Provider

**Path:** `src/context/AuthContext.jsx`

**Purpose:** Global state management for authentication using React Context API.

**State Variables:**
- `user` — Current authenticated user object (or `null`)
- `loading` — Boolean indicating if auth state is being fetched
- `error` — Error message string (or `null`)

**Functions Provided:**
| Function | Description |
|---|---|
| `register(formData)` | Registers a new user (multipart/form-data with profile image) |
| `login(email, password)` | Logs in user, returns response indicating OTP sent |
| `verifyOtp(email, otp)` | Verifies OTP code and sets user in state |
| `logout()` | Logs out current session |
| `logoutAll()` | Logs out all sessions |
| `updateProfile(formData)` | Updates user profile (multipart/form-data) |
| `fetchCurrentUser()` | Fetches current user from API, attempts token refresh on 401 |
| `setError(msg)` | Manually sets error state |

**API Base URL:** `http://localhost:4000/api/auth`

**Exports:** `AuthProvider` (named), `useAuth` (named — custom hook)

---

## 3. Login.jsx — Login Page

**Path:** `src/pages/Login.jsx`

**Purpose:** User login form with email and password.

**Key Features:**
- Email and password input fields with icons (Mail, Lock from lucide-react)
- Form validation (checks for empty fields)
- Calls `login()` from AuthContext
- On success, navigates to `/verify-otp` with email in route state
- Displays error messages via alert box
- Loading state disables button and shows "Sending OTP..."
- Links to Forgot Password and Register pages
- Brand header with "Employee Portal" title and Briefcase icon

**Exports:** `Login` (default)

---

## 4. Register.jsx — Registration Page

**Path:** `src/pages/Register.jsx`

**Purpose:** New user registration form.

**Key Features:**
- Input fields: Username, Email, Password, Role (select dropdown: user/admin)
- Profile image upload with preview (circular avatar with camera overlay)
- Form validation (checks required fields)
- Submits data as `FormData` (multipart) via `register()` from AuthContext
- On success, navigates to Dashboard (`/`)
- Displays error messages
- Loading state shows "Signing up..."
- Links to Login page for existing users
- Brand header with "Employee Portal" title

**Exports:** `Register` (default)

---

## 5. VerifyOtp.jsx — OTP Verification Page

**Path:** `src/pages/VerifyOtp.jsx`

**Purpose:** Verifies the 6-digit OTP sent after login.

**Key Features:**
- Reads email from route state (passed from Login page)
- If email not in state, shows an additional email input field
- OTP input field (max 6 characters, digits only via regex replace)
- Calls `verifyOtp(email, otp)` from AuthContext
- On success, navigates to Dashboard (`/`)
- Displays error messages
- Loading state shows "Verifying..."
- Link to go back to Login page
- Brand header with "Employee Portal" title

**Exports:** `VerifyOtp` (default)

---

## 6. ForgotPassword.jsx — Forgot Password Page

**Path:** `src/pages/ForgotPassword.jsx`

**Purpose:** Requests a password reset token via email.

**Key Features:**
- Email input field
- Calls `POST /api/auth/forgot-password` directly via axios
- On success, displays success message and auto-redirects to Reset Password page after 2 seconds (passing token in route state)
- Displays error messages
- Loading state shows "Sending..."
- Links: "Create New Account" and "Back to Login"
- Brand header with "Employee Portal" title

**Exports:** `ForgotPassword` (default)

---

## 7. ResetPassword.jsx — Reset Password Page

**Path:** `src/pages/ResetPassword.jsx`

**Purpose:** Resets password using a token received from Forgot Password flow.

**Key Features:**
- Reads token from route state (passed from Forgot Password page)
- If token not in state, user can manually enter it
- New password input field
- Calls `POST /api/auth/reset-password` directly via axios
- On success, displays success message and auto-redirects to Login page after 2 seconds
- Displays error messages
- Loading state shows "Resetting..."
- Link "Back to Login"
- Brand header with "Employee Portal" title

**Exports:** `ResetPassword` (default)

---

## 8. Dashboard.jsx — Main Dashboard Page

**Path:** `src/pages/Dashboard.jsx`

**Purpose:** Authenticated user dashboard with profile management, password change, and session management.

**Key Features:**

### Top Navigation Bar
- Brand logo and "Employee Portal" title
- User profile image/avatar with username
- Logout button

### Left Column
- **Profile Card:** User avatar (with pink border), username, email, role badge
- **Account Actions:** "Logout From All Devices" button

### Right Column
- **Edit Profile Form:**
  - Profile image upload with preview
  - Username and email fields
  - Calls `updateProfile()` from AuthContext
  - Success/error messages
- **Change Password Form:**
  - Current password and new password fields
  - Calls `POST /api/auth/change-password` directly via axios
  - On success, auto-logouts after 2 seconds
  - Success/error messages
- **Active Sessions List:**
  - Fetches sessions from `GET /api/auth/sessions`
  - Displays each session with: device (user agent), IP address, creation date
  - Shows "Active" (green) or "Revoked" (red) status badge
  - Refresh button to reload sessions
  - Loading state

**Exports:** `Dashboard` (default)

---

## 9. main.jsx — Application Entry Point

**Path:** `src/main.jsx`

**Purpose:** Renders the React app into the DOM.

**Key Features:**
- Imports `App` component and global CSS (`index.css`)
- Renders `<App />` inside `<React.StrictMode>`
- Mounts to `#root` element

---

## 10. global.css — Global Styles

**Path:** `src/styles/global.css`

**Purpose:** Custom CSS styles for the application (complementing Tailwind CSS).

**Key Style Definitions:**
- `.auth-page` — Centered flex layout for auth pages
- `.auth-card` — White card with border, shadow, padding for auth forms
- `.brand-header` — Flex layout for brand logo + title
- `.brand-icon` — Blue colored icon
- `.brand-title` — Bold, large title text
- `.brand-subtitle` — Muted subtitle text
- `.alert` / `.alert-error` — Error alert box with red styling
- `.alert-icon` — Alert icon sizing
- `.form-group` — Form field group container
- `.form-label` — Bold, uppercase label
- `.input-wrapper` — Relative container for input + icon
- `.input-icon` — Absolute positioned icon inside input
- `.form-input` — Styled input field
- `.btn` / `.btn-primary` — Primary button styling
- `.divider` / `.divider-line` / `.divider-text` — "OR" divider
- `.link` / `.link-sm` — Link styling
- `.auth-footer-card` — Bottom card for auth page links

---

## Component Hierarchy

```
App (Router + AuthProvider)
├── AppRoutes
│   ├── ProtectedRoute
│   │   └── Dashboard
│   └── PublicRoute
│       ├── Login
│       ├── Register
│       ├── VerifyOtp
│       ├── ForgotPassword
│       └── ResetPassword
└── AuthProvider (Context)
    └── useAuth (Hook)
```

## Dependencies

- **react** / **react-dom** — Core React library
- **react-router-dom** — Client-side routing
- **axios** — HTTP client for API calls
- **lucide-react** — Icon library
- **Tailwind CSS** — Utility-first CSS framework