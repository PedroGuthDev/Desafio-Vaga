# Inventory Production Planner

This project implements the practical test with a NestJS (TypeScript) API and a React frontend.

## Requirements

- Node.js 18+ (includes npm)
- Oracle Database (local or Docker)

## Backend (NestJS + TypeORM)

1. Create a `.env` file in `backend` based on `backend/.env.example`.
2. Install dependencies:

```bash
cd backend
npm install
```

The API will be available at `http://localhost:8080/api`.

## Frontend (React)

Install dependencies:

```bash
cd frontend
npm install
```

The UI will be available at `http://localhost:5173`.

If you need a custom API base URL, set `VITE_API_URL` when running the dev server or building the app.

## Testing

### Database (Oracle in Docker)

```bash
docker ps
```

If the container is not running, start it:

```bash
docker start oracle-xe
```

### Backend (API)

Run the API for manual testing:

```bash
cd backend
npm run start:dev
```

Build the backend (TypeScript compilation):

```bash
cd backend
npm run build
```

Quick endpoints to verify:

- `GET http://localhost:8080/api/products`
- `GET http://localhost:8080/api/raw-materials`
- `GET http://localhost:8080/api/production-plan`

### Frontend (UI)

```bash
cd frontend
npm run dev
```

Open the app at `http://localhost:5173`.

## Notes

- Database tables/columns and code are in English, per requirement.
- The production plan prioritizes products with higher unit price.
