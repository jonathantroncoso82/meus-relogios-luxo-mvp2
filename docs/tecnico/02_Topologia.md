# Topologia de Implantação

```
┌─────────────────────────────────────────────────────────┐
│                     INTERNET / CDN                      │
│              (Vercel Edge Network — TLS)                │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼─────────────────────────────────┐
│               VERCEL SERVERLESS PLATFORM                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Next.js 14+ App (Monolito Modular)              │   │
│  │  ├── /app/(frontend) — React Server Components  │   │
│  │  ├── /app/api/watches — Route Handlers (CRUD)   │   │
│  │  └── /app/api/auth   — NextAuth Handlers        │   │
│  └──────────────────────────────────────────────────┘   │
│  Secrets: DATABASE_URL, AUTH_SECRET (Vercel Env)        │
└───────────────────────┬─────────────────────────────────┘
                        │ TLS / Connection Pool
┌───────────────────────▼─────────────────────────────────┐
│         SUPABASE / NEON — PostgreSQL Gerenciado         │
│  ┌─────────────┐  ┌──────────────────────────────────┐  │
│  │  Tabela     │  │  Row Level Security (RLS)        │  │
│  │  User       │  │  userId = auth.uid()             │  │
│  ├─────────────┤  └──────────────────────────────────┘  │
│  │  Tabela     │  Criptografia em repouso (AES-256)     │
│  │  Watch      │  Backups automáticos diários           │
│  └─────────────┘                                        │
└─────────────────────────────────────────────────────────┘

CI/CD:
  GitHub → GitHub Actions (lint, typecheck, testes)
         → Vercel Preview (PR) → Vercel Production (main)
```

## Zonas de Segurança
| Zona | Controle |
|---|---|
| Edge | TLS obrigatório, headers HSTS |
| API | JWT httpOnly, Zod validation |
| Banco | RLS por userId, TLS em trânsito |
| Repouso | Criptografia gerenciada pelo provedor |
