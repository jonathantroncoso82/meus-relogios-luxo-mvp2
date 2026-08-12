# LuxWatch — Luxury Watch Collection Control

A full-stack web application for managing a luxury watch collection.

## Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + Vite + TypeScript        |
| Backend   | Node.js 18 + Express + TypeScript   |
| ORM       | Prisma 5                            |
| Database  | PostgreSQL 15                       |
| Auth      | JWT (jsonwebtoken + bcryptjs)       |
| Container | Docker + Docker Compose             |

## Quick Start

```bash
# Clone and start everything
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000       |
| Backend  | http://localhost:4000/api  |
| Health   | http://localhost:4000/api/health |
| Database | localhost:5432             |

## Domain Model

### Entities / Tables

| Table            | Description                                      |
|------------------|--------------------------------------------------|
| `users`          | Collector accounts                               |
| `brands`         | Watch manufacturers (Rolex, Patek Philippe, …)   |
| `collections`    | Named groups of watches per user                 |
| `watch_movements`| Movement/caliber reference data                  |
| `watches`        | Core entity — each timepiece in the collection   |
| `watch_images`   | Photos attached to a watch                       |
| `service_records`| Maintenance and service history                  |
| `valuations`     | Market appraisals over time                      |

### Enum Types (watch_conditions)

`watch_condition` ENUM: `mint | excellent | very_good | good | fair | poor`

These are PostgreSQL native ENUMs defined in `database/init.sql` and mirrored in `backend/prisma/schema.prisma`.

## API Routes

### Auth
| Method | Path                  | Auth | Description        |
|--------|-----------------------|------|--------------------|
| POST   | /api/auth/register    | ✗    | Register user      |
| POST   | /api/auth/login       | ✗    | Login              |
| GET    | /api/auth/me          | ✓    | Current user       |

### Brands
| Method | Path              | Auth | Description     |
|--------|-------------------|------|-----------------|
| GET    | /api/brands       | ✓    | List brands     |
| POST   | /api/brands       | ✓    | Create brand    |
| GET    | /api/brands/:id   | ✓    | Get brand       |
| PUT    | /api/brands/:id   | ✓    | Update brand    |
| DELETE | /api/brands/:id   | ✓    | Delete brand    |

### Watches
| Method | Path              | Auth | Description     |
|--------|-------------------|------|-----------------|
| GET    | /api/watches      | ✓    | List watches    |
| POST   | /api/watches      | ✓    | Add watch       |
| GET    | /api/watches/:id  | ✓    | Watch detail    |
| PUT    | /api/watches/:id  | ✓    | Update watch    |
| DELETE | /api/watches/:id  | ✓    | Delete watch    |

### Collections
| Method | Path                  | Auth | Description        |
|--------|-----------------------|------|--------------------|
| GET    | /api/collections      | ✓    | List collections   |
| POST   | /api/collections      | ✓    | Create collection  |
| GET    | /api/collections/:id  | ✓    | Get collection     |
| PUT    | /api/collections/:id  | ✓    | Update collection  |
| DELETE | /api/collections/:id  | ✓    | Delete collection  |

### Service Records
| Method | Path                      | Auth | Description          |
|--------|---------------------------|------|----------------------|
| GET    | /api/service-records      | ✓    | List service records |
| POST   | /api/service-records      | ✓    | Add service record   |
| GET    | /api/service-records/:id  | ✓    | Get service record   |
| PUT    | /api/service-records/:id  | ✓    | Update record        |
| DELETE | /api/service-records/:id  | ✓    | Delete record        |

### Valuations
| Method | Path                  | Auth | Description      |
|--------|-----------------------|------|------------------|
| GET    | /api/valuations       | ✓    | List valuations  |
| POST   | /api/valuations       | ✓    | Add valuation    |
| GET    | /api/valuations/:id   | ✓    | Get valuation    |

### Health
| Method | Path         | Auth | Description  |
|--------|--------------|------|--------------|
| GET    | /api/health  | ✗    | Health check |

## Environment Variables

Copy `.env.example` to `.env` and adjust:

```env
POSTGRES_USER=luxwatch
POSTGRES_PASSWORD=luxwatch_secret
POSTGRES_DB=luxwatch_db
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
```

## Project Structure

```
.
├── docker-compose.yml
├── database/
│   └── init.sql              # Schema + seed data
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── server.ts
│       ├── app.ts
│       ├── config/
│       ├── middleware/
│       ├── routes/
│       ├── controllers/
│       └── types/
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/
        ├── components/
        ├── pages/
        ├── store/
        └── types/
```
