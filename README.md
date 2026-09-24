# GigFlow - Freelance Marketplace Platform

A full-stack mini-freelance marketplace where clients can post gigs and freelancers can bid on them.

## 🚀 Live Demo

- **Frontend**: [https://gig-flow-service-hive-internship-pr.vercel.app](https://gig-flow-service-hive-internship-pr.vercel.app)
- **Backend API**: [https://gigflow-backend.up.railway.app](https://gigflow-backend.up.railway.app)

## 📋 Features

### Core Features
- ✅ **User Authentication**: Secure sign-up/login with JWT and HttpOnly cookies
- ✅ **Fluid Roles**: Any user can act as both client (post gigs) and freelancer (bid on gigs)
- ✅ **Gig Management**: Full CRUD operations for job postings
- ✅ **Search & Filter**: Search gigs by title
- ✅ **Bidding System**: Freelancers can submit bids with custom messages and prices
- ✅ **Hiring Logic**: Atomic transaction-based hiring with automatic bid rejection

### Bonus Features Implemented
- ✅ **Transactional Integrity**: MongoDB transactions prevent race conditions during hiring
- ✅ **Real-time Notifications**: Socket.io integration for instant updates
  - Clients receive notifications when freelancers bid
  - Freelancers receive hire/reject notifications in real-time
- ✅ **Pagination**: Efficient data loading on all listing pages
- ✅ **Custom UI Components**: Confirmation dialogs, status badges, loading states

## 🛠️ Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS v4
- React Router v7
- Context API for state management
- Socket.io-client for real-time updates
- Axios for API calls

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io for WebSockets
- Bcrypt for password hashing

## 📁 Project Structure

```
GigFlow_ServiceHive_Internship_Project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth & Socket contexts
│   │   ├── pages/         # Route pages
│   │   └── service/       # API service layer
│   └── .env.example
├── server/                # Express backend
│   ├── src/
│   │   ├── controller/   # Business logic
│   │   ├── model/        # Mongoose schemas
│   │   ├── route/        # API routes
│   │   ├── middleware/   # Auth middleware
│   │   └── utils/        # Helper functions
│   └── .env.example
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd GigFlow_ServiceHive_Internship_Project
```

2. **Setup MongoDB Database**

MongoDB will store all your application data. Follow these steps:

#### 2.1: Create MongoDB Account & Cluster

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** and create an account (or sign in if you have one)
3. Once logged in, click **"Create"** to start a new project

#### 2.2: Create a New Project

1. Enter your **Project Name** (e.g., "GigFlow")
2. Click **"Next"**
3. Click **"Create Project"**

#### 2.3: Create a Database Cluster

1. Click **"Create"**
2. Choose the **FREE** tier (M0 Sandbox)
3. Select your preferred **cloud provider** and **region** (choose one closest to you)
4. Click **"Create Deployment"**

#### 2.4: Create Database User

A popup will appear asking you to create a database user:

1. Enter a **Username**
2. Click **"Autogenerate Secure Password"** or create your own
3. **IMPORTANT**: Copy and save this password somewhere safe—you'll need it shortly!
4. Click **"Create Database User"**

#### 2.5: Get Your MongoDB Connection String

1. Click **"Choose a connection method"**
2. Select **"Compass"** (or "Drivers" works too)
3. You'll see a connection string that looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net
   ```
4. **Copy this entire URL**

#### 2.6: Configure Network Access

Before using your database, you need to allow connections from any IP address:

1. On the left sidebar, under **"Security"**, click **"Network Access"**
2. Click **"Add IP Address"** or **"Edit"** on existing entry
3. In the dialog box, click **"Allow Access from Anywhere"** or manually enter:
   - **IP Address**: `0.0.0.0/0`
4. Click **"Confirm"**

This configuration allows your application to connect to MongoDB from any location without IP whitelisting restrictions. Perfect for development and testing!

✅ **Network access configured!**

3. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
```

Now open `server/.env` file and update the `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://<username>:<db_password>@cluster0.xxxxx.mongodb.net
```

- Replace `<username>` with your database username
- Replace `<db_password>` with the password you copied earlier

**Example:**
```env
MONGODB_URI=mongodb+srv://admin:MySecurePass123@cluster0.abc123.mongodb.net
```

Also configure other environment variables in `.env` file:

```env
CORS_ORIGIN=http://localhost:5173
```

**Note**: Update `CORS_ORIGIN` to match the URL where your frontend is running. If your frontend runs on a different port (e.g., `http://localhost:3000`), change it accordingly.

Then start the server:

```bash
npm run dev
```

4. **Setup Frontend**
```bash
cd client
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 📡 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and set HttpOnly cookie

### Gigs
- `GET /api/gigs` - Fetch all gigs (with search & pagination)
- `POST /api/gigs` - Create a new gig (authenticated)
- `GET /api/gigs/:id` - Get gig details
- `PUT /api/gigs/:id` - Update gig (owner only)
- `DELETE /api/gigs/:id` - Delete gig (owner only)
- `PATCH /api/gigs/:id/hire` - Hire a freelancer (atomic transaction)

### Bids
- `POST /api/bids` - Submit a bid
- `GET /api/bids/user` - Get user's bids (with pagination)
- `GET /api/bids/gig/:gigId` - Get all bids for a gig (owner only)
- `DELETE /api/bids/:id` - Delete a bid

## 🔒 Security Features

- JWT tokens stored in HttpOnly cookies
- Password hashing with bcrypt
- Protected routes with authentication middleware
- CORS configuration
- MongoDB transactions for data consistency

## ⚡ Real-time Features

Socket.io events:
- `newBid` - Notify gig owner when freelancer bids
- `bidAccepted` - Notify freelancer when hired
- `bidRejected` - Notify freelancers when not selected

## 🗄️ Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  contact_no: String
}
```

### Gig
```javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: String (enum: ['open', 'assigned']),
  freelancerId: ObjectId (ref: User, optional)
}
```

### Bid
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  proposedPrice: Number,
  status: String (enum: ['pending', 'hired', 'rejected'])
}
```

## 🎯 Key Implementation Details

### Hiring Logic (Atomic Transaction)
When a client hires a freelancer:
1. Start MongoDB session and transaction
2. Update gig status to "assigned" and set freelancerId
3. Update selected bid status to "hired"
4. Update all other bids for that gig to "rejected"
5. Commit transaction (rollback on any failure)
6. Emit Socket.io events to notify users

### Real-time Notification System
- Socket.io connection authenticates with user ID
- Server maintains a Map of connected users (userId → socketId)
- When events occur, server emits to specific socket IDs
- Frontend displays notifications with auto-dismiss

## 📦 Deployment

### Backend (Railway)
1. Connect GitHub repository
2. Set root directory to `server`
3. Add environment variables
4. Railway auto-deploys on push

### Frontend (Vercel)
1. Connect GitHub repository
2. Set root directory to `client`
3. Add `VITE_API_URL` environment variable
4. Vercel auto-deploys on push

## 🧪 Testing

Access the deployed app and test:
1. Register/Login as User A and User B
2. User A posts a gig
3. User B bids on the gig
4. User A sees real-time notification of new bid
5. User A hires User B
6. User B sees real-time hire notification
7. Verify other bids are automatically rejected

## 👨‍💻 Author

Himanshu Mishra

## � Acknowledgments

This project was developed as part of a Full Stack Development Internship Assignment provided by **ServiceHive**. I would like to express my sincere gratitude to ServiceHive for this wonderful opportunity to showcase my skills and learn through this comprehensive project.

## 📄 License

This project is licensed under the MIT License.
