# Role-Based Access Control (RBAC) System

## Project Overview
A full-stack RBAC system with React Vite frontend and Node.js Express backend.

## Prerequisites
- Node.js (v18+)
- npm or yarn
- Git

## Frontend Setup (React Vite)
1. Navigate to frontend directory
```bash
cd frontend
npm install
```

2. Run Development Server
```bash
npm run dev
```

## Backend Setup (Node.js Express)
1. Navigate to backend directory
```bash
cd backend
npm install
```

2. Environment Configuration
Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rbac-db
JWT_SECRET=your_jwt_secret
```

3. Run Development Server
```bash
nodemon index.js
```

## Key Features
- User authentication
- Role-based permissions
- Protected routes
- User management

## Tech Stack
- Frontend: React Vite
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
