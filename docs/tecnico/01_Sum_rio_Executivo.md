# Sumário Executivo — Nava Flow · Relógios de Luxo

## Visão
Plataforma digital que centraliza o acervo pessoal de relógios de luxo, substituindo controles manuais dispersos e reduzindo em até **70%** o tempo de organização.

## Abordagem Arquitetural
Monolito Modular Fullstack em **Next.js 14+** (App Router), hospedado na **Vercel**, com banco **PostgreSQL gerenciado** (Supabase/Neon). Separação por feature interna permite extração futura de serviços sem reescrita.

## Principais Decisões
| Decisão | Escolha | Justificativa |
|---|---|---|
| Runtime | Next.js 14+ | SSR + API Routes em um único deploy |
| Banco | PostgreSQL + Prisma | Type-safety, migrations, RLS |
| Auth | Auth.js (NextAuth) | JWT httpOnly, bcrypt, extensível |
| Hospedagem | Vercel + Supabase/Neon | Zero-ops, SLA gerenciado |
| Validação | Zod | Schema-first, reutilizável client/server |

## Benefícios Esperados
- Visibilidade imediata do patrimônio acumulado.
- Segurança de dados com RLS + TLS + criptografia em repouso.
- Conformidade LGPD nativa (exportação e deleção).
- CI/CD automatizado via GitHub Actions + Vercel Preview.

## Riscos
- Vendor lock-in Vercel/Supabase → mitigado por Prisma portável.
- Crescimento de coleção → índices e paginação planejados desde o início.
