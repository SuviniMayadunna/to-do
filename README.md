# MERN Todo Application

A full-stack Todo application built with the MERN stack (MongoDB, Express, React, Node.js). Features user authentication, due dates, filtering, and robust validation on both frontend and backend.

## Features
- User registration and login (JWT-based authentication)
- Add, edit, delete, and toggle todos
- Set due dates for todos (cannot select past dates)
- Filter todos (all, active, completed)
- Progress bar for completed tasks
- Responsive, modern UI
- Backend and frontend validation for due dates

## Folder Structure
```
mern-todo/
  backend/         # Express + MongoDB API
    models/        # Mongoose models (User, Todo)
    routes/        # API routes (auth, todos)
    middleware/    # Auth middleware
    server.js      # Entry point for backend
    .env           # Environment variables
  frontend/        # React app
    src/           # React components and logic
    public/        # Static files
    package.json   # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository
```
git clone <your-repo-url>
cd mern-todo
```

### 2. Setup Backend
```
cd backend
npm install
```

- Create a `.env` file in `backend/` with:
  ```
  MONGO_URI=<your-mongodb-uri>
  JWT_SECRET=<your-secret>
  PORT=5000
  ```
- Start backend:
  ```
  npm start
  ```

### 3. Setup Frontend
```
cd ../frontend
npm install
npm start
```
- The React app runs on [http://localhost:3000](http://localhost:3000)

### 4. Usage
- Register a new user or login
- Add todos with a due date (cannot select past dates)
- Edit, delete, and mark todos as completed
- Filter and track your progress

## API Endpoints (Backend)
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/todos` — Get all todos for user
- `POST /api/todos` — Add todo (validates due date)
- `PUT /api/todos/:id` — Toggle completed
- `PUT /api/todos/:id/edit` — Edit todo (validates due date)
- `DELETE /api/todos/:id` — Delete todo

## Validation
- **Frontend:** Prevents selecting past dates in forms
- **Backend:** Rejects API requests with past due dates

## License
MIT

---
Feel free to customize and extend this project!
