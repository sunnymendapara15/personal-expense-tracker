# Personal Expense Tracker

## Overview
A single-user expense manager built with React 18 for the UI and FastAPI for the API. Track every transaction, view monthly totals, and spot trends from the browser without logging in.

## Features
- Add, edit, and delete expenses with description, amount, category, and date.
- Dashboard cards that highlight the latest month and the total spend tracked.
- Category breakdown visualized via a responsive bar chart.
- Filters for category, start date, and end date that keep the UI up-to-date.
- FastAPI backend with SQLite persistence and summary endpoints for charts.

## Tech stack
- Frontend: Create React App (React 18, Chart.js, react-chartjs-2, axios)
- Backend: FastAPI, SQLAlchemy, SQLite, uvicorn

## Repository structure
- `backend/`: FastAPI service, SQLAlchemy models, CRUD helpers, and requirements.
- `frontend/`: Create React App with reusable components, services, and styling.

## Backend setup
1. `cd backend`
2. `python -m venv .venv`
3. Activate the virtual environment (`source .venv/bin/activate` on Unix or `.venv\Scripts\activate` on Windows).
4. `pip install -r requirements.txt`
5. `uvicorn app.main:app --reload`
   - By default the API runs at `http://127.0.0.1:8000`.
   - `expenses.db` is created automatically inside `backend/`.

## Frontend setup
1. `cd frontend`
2. `npm install`
3. `npm start`
   - Runs the React dev server on `http://localhost:3000`.
   - To consume a remote FastAPI instance, set `REACT_APP_API_URL` (for example `REACT_APP_API_URL=http://localhost:8000`).

## API endpoints
- `POST /expenses/` – Create a new expense.
- `GET /expenses/` – List expenses with optional `start_date`, `end_date`, `category`, `skip`, and `limit` query parameters.
- `PUT /expenses/{expense_id}` – Update an existing expense.
- `DELETE /expenses/{expense_id}` – Remove an expense.
- `GET /summary/monthly` – Get monthly totals (for cards on the dashboard).
- `GET /summary/category` – Get totals grouped by category (for the chart).
