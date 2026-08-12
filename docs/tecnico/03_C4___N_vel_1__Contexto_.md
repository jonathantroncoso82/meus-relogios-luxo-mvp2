# C4 — Nível 1: Contexto do Sistema

```mermaid
C4Context
  title "Controle de Colecao de Relogios de Luxo — Contexto"

  Person(colecionador, "Colecionador", "Usuario autenticado que gerencia sua colecao de relogios de luxo")
  Person(perito, "Perito / Seguradora", "Recebe dados exportados para avaliacao ou apolice")

  System(relogios_app, "Plataforma de Relogios", "Permite cadastro, consulta, edicao e exclusao de relogios de luxo, com painel de estatisticas")

  System_Ext(supabase_neon, "Supabase / Neon", "PostgreSQL gerenciado com RLS e backups automaticos")
  System_Ext(vercel, "Vercel", "Hospedagem serverless com CDN global e deploy automatico")
  System_Ext(github, "GitHub Actions", "Pipeline de CI com lint, typecheck e testes")

  Rel(colecionador, relogios_app, "Cadastra, consulta e gerencia relogios", "HTTPS")
  Rel(relogios_app, supabase_neon, "Persiste e consulta dados", "TLS / Prisma")
  Rel(relogios_app, vercel, "Hospedado e servido por", "Deploy")
  Rel(github, vercel, "Aciona deploy automatico", "CI/CD")
  Rel(relogios_app, perito, "Exporta dados em JSON (LGPD)", "Download")
```
