# Arquitetura Cloud — Controle de Relógios de Luxo

## Provedores
| Camada | Provedor | Serviço |
|---|---|---|
| Hospedagem / CDN | Vercel | Serverless Functions + Edge Network |
| Banco de Dados | Supabase ou Neon | PostgreSQL gerenciado |
| CI/CD | GitHub Actions | Pipeline de qualidade |
| Secrets | Vercel Environment Variables | DATABASE_URL, AUTH_SECRET |

## Estratégia de Alta Disponibilidade
- **Vercel:** SLA 99,99% na Edge Network; funções serverless com retry automático.
- **Supabase/Neon:** SLA 99,9%; réplicas de leitura disponíveis para escala futura.
- **Backups:** automáticos diários pelo provedor; retenção de 7 dias (Supabase free) ou configurável (Neon).

## Segurança Cloud
- TLS 1.3 obrigatório em todas as conexões.
- Secrets nunca em código; injetados via Vercel Env em build e runtime.
- Headers de segurança (HSTS, CSP, X-Frame-Options) via `next.config.js`.
- RLS no banco como controle de acesso independente da aplicação.

## Observabilidade
- Logs de funções: Vercel Function Logs (runtime errors).
- Métricas de banco: Supabase/Neon Dashboard.
- Alertas: configurar via Vercel Integrations (Datadog ou Sentry) em fase futura.

## Custo Estimado (Inicial)
| Serviço | Plano | Custo |
|---|---|---|
| Vercel | Hobby / Pro | $0–$20/mês |
| Supabase | Free / Pro | $0–$25/mês |
| GitHub Actions | Free | $0 |
