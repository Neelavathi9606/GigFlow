# GigFlow - Freelance Marketplace Platform

GigFlow is a full-stack freelance marketplace platform that connects clients and freelancers through a simple gig posting, bidding, and hiring workflow.

The platform allows users to create gigs, discover available opportunities, submit bids, manage applications, and hire freelancers through a secure and transactional workflow.

---

## 🚀 Live Demo

- **Frontend:** https://gig-flow-service-hive-internship-pr.vercel.app
- **Backend API:** https://gigflow-backend.up.railway.app

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- HttpOnly cookies for authentication
- Protected API routes
- Owner-based authorization for gig operations
- Current-user authentication endpoint
- Secure password hashing using bcrypt

### 💼 Gig Management

- Create new gigs
- View available gigs
- View individual gig details
- Update owned gigs
- Delete owned gigs
- Search gigs by title
- Pagination for gig listings
- Gig status management

### 💰 Bidding System

- Freelancers can submit bids
- Custom proposed price and message
- View personal bids
- Gig owners can view bids received for their gigs
- Update pending bids
- Delete eligible bids
- Prevent users from bidding on their own gigs
- Prevent invalid bids on closed/assigned gigs

### 🤝 Hiring Workflow

- Gig owners can hire a freelancer
- Selected bid is marked as `hired`
- Remaining bids are automatically rejected
- Gig status changes to `assigned`
- Hiring operations use MongoDB transactions for data consistency
- Prevents inconsistent gig/bid states during the hiring process

### ⚡ Real-Time Notifications

Socket.IO is used for real-time application notifications.

- New bid notifications
- Bid acceptance notifications
- Bid rejection notifications
- Real-time frontend notification updates

### 🛡️ Backend Improvements

- Centralized API error handling
- Consistent API responses
- Authentication middleware
- Authorization checks
- Input validation
- Mongoose error handling
- JWT error handling
- Database-level pagination
- Cascade cleanup of bids when appropriate

### 🎨 User Interface

- Responsive React interface
- Loading states
- Error states
- Confirmation dialogs
- Status indicators
- Navigation based on authentication state
- Reusable React components

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Context API
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Socket.IO
- cookie-parser
- CORS

### Development Tools

- Git
- GitHub
- VS Code
- Postman / Browser DevTools

---

## 🏗️ Application Architecture

```text
                         ┌─────────────────────┐
                         │       React UI      │
                         │      Vite + React   │
                         └──────────┬──────────┘
                                    │
                              Axios / Socket.IO
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Express Backend   │
                         │      REST APIs      │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
            Authentication      Gig APIs          Bid APIs
                  │                 │                 │
                  └─────────────────┼─────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ MongoDB + Mongoose  │
                         └─────────────────────┘

                         ┌─────────────────────┐
                         │      Socket.IO      │
                         │ Real-time Events    │
                         └─────────────────────┘