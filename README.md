# Geomato - Operations Dashboard

A modern web application for managing maritime operations, built with React and PostgreSQL.

## 🚀 Features

- **Operations Tracking:** Manage titles, vessels, and loading dates.
- **Material Inventory:** Detailed listing of materials tied to specific operations.
- **Persistent Storage:** Fully integrated with PostgreSQL database.
- **Excel Export:** Generate operation reports in `.xlsx` format.
- **Modern UI:** Clean, responsive design with interactive forms.

---

## 🛠️ Project Structure

- `/src`: React frontend (TypeScript)
- `/server`: Node.js/Express backend (TypeScript)
- `server/schema.sql`: Database schema definition

---

## 🚦 Getting Started

### 1. Database Setup
Ensure you have **PostgreSQL** installed and running.

1. Create a new database (e.g., `geomato_db`).
2. Run the SQL script located at `server/schema.sql` to create the required tables:
   ```bash
   psql -U your_username -d geomato_db -f server/schema.sql
   ```

### 2. Backend Configuration
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file based on `.env.example`.
   - Set your `DATABASE_URL`:
     ```env
     DATABASE_URL=postgres://your_user:your_password@localhost:5432/geomato_db
     PORT=3001
     ```
4. Start the server (development mode):
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Return to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (optional):
   - Create a `.env` file based on `.env.example`.
   - `REACT_APP_API_URL` defaults to `http://localhost:3001/api`.
4. Start the React app:
   ```bash
   npm start
   ```

---

## 📦 Available Scripts

### Root Directory
- `npm start`: Runs the app in development mode.
- `npm run build`: Builds the app for production.

### `/server` Directory
- `npm run dev`: Runs the backend with `ts-node` for development.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm start`: Runs the compiled backend.

---

## 📄 License

This project is private and intended for internal use.
