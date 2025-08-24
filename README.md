Here’s your Agent Management System README.md written properly in markdown format:

# 🧑‍💼 Agent Management System (MERN Stack)

A **MERN stack application** to manage agents, their records, distributed lists, and CSV uploads with a **complete authentication system** (signup, login, forgot password, reset password, profile management).

---

## ✨ Core Features

### 🔐 Authentication System
- ✔️ User Registration & Login  
- ✔️ Forgot/Reset Password via Email  
- ✔️ Profile Management (update info + change password)  
- ✔️ Secure JWT Authentication  
- ✔️ Mobile-Responsive UI  
- ✔️ Professional Email Templates  

### 🧑‍💼 Agent Management
- ✔️ Add new agents with detailed info  
- ✔️ View all agents in a clean dashboard  
- ✔️ Update or delete agents  
- ✔️ Upload agents via CSV Import  
- ✔️ Organize agents into Distributed Lists  
- ✔️ Role-based access control (Admin/User)  
- ✔️ Error handling & validation  

---

## 🔄 System Flow

```mermaid
flowchart TD
    A[User Registers / Logs In] --> B[Dashboard]
    B --> C[Agents Tab - View All Agents]
    B --> D[Add Agent Tab - Add New Agent]
    B --> E[Upload CSV Tab - Bulk Upload]
    B --> F[Distributed Lists Tab - Manage Groups]
    B --> G[Profile Tab - Update Info / Change Password]
    C -->|Edit/Delete| C
    D --> C
    E --> C
    F --> C


---

🔁 Authentication Sequence (Forgot Password Flow)

sequenceDiagram
    participant U as User
    participant C as Client (React)
    participant S as Server (Express + MongoDB)
    participant E as Email Service (Nodemailer/SMTP)

    U->>C: Click "Forgot Password"
    C->>S: POST /forgot-password {email}
    S->>S: Generate secure token (1hr expiry)
    S->>E: Send reset email with link
    E-->>U: 📧 Password Reset Link
    U->>C: Click link (/reset-password/:token)
    C->>S: Validate token
    S-->>C: Token valid ✅
    U->>C: Enter new password
    C->>S: POST /reset-password/:token
    S->>S: Update password (bcrypt hashed)
    S-->>C: Success + JWT token
    C-->>U: Auto-login & redirect to Dashboard


---

📧 Email Configuration

Set up the following environment variables in your backend .env file:

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=noreply@yourdomain.com
CLIENT_URL=http://localhost:3000


---

🧭 Navigation Structure

Public Routes:

/login
/register
/forgot-password
/reset-password/:token

Protected Routes:

/dashboard
  ├── Agents Tab (View All Agents)
  ├── Add Agent Tab (Add new agent)
  ├── Upload CSV Tab (Bulk import agents)
  ├── Distributed Lists Tab (Organize groups)
  └── Profile Tab (User info + password change)


---

📱 Responsive Design

📲 Mobile-friendly dashboards

👆 Touch-optimized forms & tables

📊 Easy-to-navigate data views

✅ Consistent design across devices



---

⚡ Tech Stack

Frontend: React, React Hook Form, Toast Notifications

Backend: Node.js, Express.js, Nodemailer, Bcrypt, Crypto

Database: MongoDB + Mongoose

Auth: JWT-based authentication

UI: Responsive forms + tables for data management



---

🖼️ Screenshots

(Add screenshots of Dashboard, Agents tab, CSV upload, and Profile tab here)


---

🚀 Getting Started

🔹 Clone Repository

git clone https://github.com/johnwesley755/agent-management-system.git
cd agent-management-system

🔹 Install Dependencies

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

🔹 Run Application

# Run backend
cd backend
npm run dev

# Run frontend
cd ../frontend
npm run dev

Visit: http://localhost:5000


---

✅ Conclusion

The Agent Management System provides:
✔️ Secure Authentication System
✔️ Full CRUD Agent Management
✔️ Bulk CSV Uploads
✔️ Distributed List Management
✔️ Profile & Password Controls
✔️ Mobile-Friendly Dashboards

---

Do you want me to also **add badges (Node, React, MongoDB, License, etc.) at the top** of this README so it looks more professional for GitHub?

