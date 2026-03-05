🚀 QR Utility App

A Phase 3–ready responsive web application for managing QR records with secure authentication, role-based access control, and file uploads.

The application includes a Node.js backend API and a mobile-responsive frontend built using HTML, CSS, and JavaScript.

✨ Features
🔐 Authentication

Secure JWT-based signup and login

Protected API routes

Session validation with /auth/me

👥 Role-Based Access Control

Three user roles are supported:

Role	Permissions
Student	Manage only their own QR records
Mentor	View and manage all QR records
Admin	Full access + user management
📊 QR Record Dashboard

Complete CRUD operations:

Create QR records

View records

Update records

Delete records

Each QR record may include:

Title

Description

Uploaded file attachment

📎 File Upload Support

Supports uploading:

Images

PDF documents

Uploads are handled through multipart form data and stored on the backend.

📱 Responsive UI

The frontend includes:

Mobile-friendly responsive layout

Dashboard interface

Reusable UI components

Error handling and loading states

🔗 Centralized API Layer

The frontend integrates with the backend through a centralized service layer, making it easier to maintain API calls.

🏗 Project Structure
qr-app/
│
├── backend/
│   ├── src/
│   │   ├── config/        # Environment and configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth + role middleware
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic
│   │
│   └── uploads/           # Uploaded files
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── screens/       # Application pages
    │   └── services/      # API integration
    │
    └── index.html
⚙ Backend Setup
1. Open terminal inside backend
cd backend
2. Install dependencies
npm install
3. Create environment file

Copy the example environment file:

cp .env.example .env

Edit the .env file with your configuration values.

4. Start development server
npm run dev

Default backend server:

http://localhost:4000
🌐 Frontend Setup

Navigate to the frontend folder.

Open the file:

frontend/index.html

in your browser.

Configure Backend API URL

If needed, update the backend URL inside:

frontend/src/main.js

Example:

const API_BASE = "http://localhost:4000";
📡 API Endpoints
🔐 Authentication
Register User
POST /api/auth/signup
Login User
POST /api/auth/login
Get Current User
GET /api/auth/me
Get All Users (Admin Only)
GET /api/auth/users
📦 QR Records
Get All QR Records
GET /api/qrs
Create QR Record
POST /api/qrs

Multipart request may include:

attachment (optional image or pdf)
Update QR Record
PUT /api/qrs/:id

Supports multipart upload.

Delete QR Record
DELETE /api/qrs/:id
👤 Demo Roles

You can register users with different roles.

Student

Manage only their own records.

Mentor

View and manage all QR records.

Admin

View and manage all records.

Access list of all users.

🧭 Phase Implementation Mapping
Phase 1 — Frontend Foundation

Responsive UI

Component-based structure

Clean folder organization

Phase 2 — Backend Architecture

Express backend

JWT authentication

Role-based middleware

Protected API routes

Phase 3 — Full Application

Dashboard implementation

Complete CRUD functionality

File uploads

Error handling

Loader states

Project documentation

🛠 Tech Stack
Backend

Node.js

Express.js

JSON Web Tokens (JWT)

Multer (file uploads)

Frontend

HTML5

CSS3

JavaScript

🚀 Deployment
Frontend

Can be deployed using:

GitHub Pages

Netlify

Vercel

Firebase Hosting

Backend

Can be deployed using:

Render

Railway

AWS

DigitalOcean

🤝 Contributing

Contributions are welcome.

If you would like to improve the project:

Fork the repository

Create a new branch

Submit a pull request
