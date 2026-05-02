# Team Task Manager

A full-stack team task management application built with React, Tailwind CSS, Vite, Node.js, Express, and MongoDB.

## 🚀 Project Overview

This app allows teams to:
- Register and login with role-based access
- Create and manage projects
- Add team members to projects
- Create and move tasks across workflow stages
- View dashboard statistics
- Toggle dark mode

## 📁 Project Structure

```
team-task-manager/
├── backend/                # Express API server
├── frontend/               # React frontend app
├── .gitignore
└── README.md
```

## 🛠️ Backend Functionality

The backend provides:
- JWT authentication (`/api/auth`)
- User registration and login
- Role-based access control (`admin` and `member`)
- CRUD for projects
- Assign members to projects
- CRUD for tasks
- Task status updates
- User listing for admin use

### Important backend files
- `backend/server.js`
- `backend/routes/authRoutes.js`
- `backend/routes/projectRoutes.js`
- `backend/routes/taskRoutes.js`
- `backend/routes/userRoutes.js`
- `backend/controllers/*.js`
- `backend/models/*.js`
- `backend/middleware/auth.js`
- `backend/middleware/role.js`

## 🎨 Frontend Functionality

The frontend provides:
- Login and signup pages
- Dashboard overview
- Project management page
- Team members directory page
- Task board page
- Dark mode theme support
- API communication via Axios

### Important frontend files
- `frontend/src/App.jsx`
- `frontend/src/components/Layout.jsx`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/pages/*.jsx`
- `frontend/src/api/axios.js`
- `frontend/src/utils/getUser.js`

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/team-task-manager.git
cd team-task-manager
```

### 2. Setup backend

```bash
cd backend
npm install
```

Copy or create a `.env` file with these values:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

### 3. Setup frontend

```bash
cd ../frontend
npm install
```

If you want to use a backend URL other than localhost, update `frontend/src/api/axios.js` or add `VITE_API_URL`.

## ▶️ Running Locally

### Start backend

```bash
cd backend
npm run dev
```

This runs the backend on `http://localhost:5000`.

### Start frontend

```bash
cd frontend
npm run dev
```

Open the local Vite URL shown in the terminal (typically `http://localhost:5173`).

## 🌐 Production Deployment

### Backend
- Use services such as Render, Railway, or Fly.io
- Set environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `NODE_ENV=production`

### Frontend
- Use Vercel, Netlify, or similar
- Set `VITE_API_URL` to your deployed backend API base URL

## 🔐 Environment Variables

In production or deployment, do not store secrets in source control. Use platform environment variables.

### Backend env variables

- `MONGO_URI` - MongoDB connection URI
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - `production`
- `PORT` - optional for local use

### Frontend env variables

- `VITE_API_URL` - backend API base URL

## ✅ Notes

- The backend uses `express.json()` and CORS for API handling.
- The frontend uses Tailwind CSS and React Router.
- The app uses JWT tokens stored in `localStorage`.

## 🙌 Author
Built as a full-stack Team Task Manager project.
