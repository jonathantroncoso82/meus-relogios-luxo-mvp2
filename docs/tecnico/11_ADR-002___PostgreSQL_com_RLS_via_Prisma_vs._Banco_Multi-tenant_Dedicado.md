# ADR-002 — PostgreSQL com RLS via Prisma vs. Banco Multi-tenant Dedicado

## Status
Aceito

## Contexto
O sistema precisa isolar dados por usuário com segurança, sem complexidade operacional de múltiplos bancos.

## Decisão
Usar **PostgreSQL gerenciado** (Supabase ou Neon) com **Row Level Security (RLS)** e **Prisma ORM** para acesso tipado.

## Alternativas Consideradas
| Alternativa | Motivo da Rejeição |
|---|---|
| Banco por usuário | Custo e complexidade operacional excessivos |
| Schema por usuário | Migrations complexas, sem suporte nativo Prisma |
| NoSQL (MongoDB) | Perde type-safety e transações ACID |
| SQLite | Sem suporte a RLS, não escalável para cloud |

## Consequências
**Positivas:**
- RLS como segunda camada de segurança (além da verificação na API).
- Prisma garante type-safety end-to-end e migrations versionadas.
- Criptografia em repouso e backups automáticos pelo provedor gerenciado.
- TLS obrigatório em trânsito sem configuração adicional.

**Negativas:**
- Vendor dependency em Supabase/Neon (mitigado: Prisma é portável para qualquer PostgreSQL).
- RLS requer configuração cuidadosa de políticas por tabela.

## Revisão
Reavaliar provedor se SLA < 99% for observado em produção.
