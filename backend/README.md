# Inventory Production Planner - Backend (NestJS + TypeORM)

This is a TypeScript rewrite of the Quarkus backend using NestJS and TypeORM.

## Setup

```bash
cd backend-ts
npm install
```

## Configure Oracle

Create a `.env` based on `.env.example` and update credentials.

## Run (dev)

```bash
npm run start:dev
```

The API will be available at `http://localhost:8080/api`.

## Endpoints

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

- `GET /api/raw-materials`
- `GET /api/raw-materials/:id`
- `POST /api/raw-materials`
- `PUT /api/raw-materials/:id`
- `DELETE /api/raw-materials/:id`

- `GET /api/product-materials`
- `GET /api/product-materials/:id`
- `POST /api/product-materials?productId=1&rawMaterialId=1&quantityRequired=2.5`
- `PUT /api/product-materials/:id?productId=1&rawMaterialId=1&quantityRequired=2.5`
- `DELETE /api/product-materials/:id`

- `GET /api/production-plan`
