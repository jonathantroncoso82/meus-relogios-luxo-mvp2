# Integration Gateway

## Contexto Atual
O sistema é autossuficiente (sem integrações externas ativas). O gateway é planejado para integrações futuras.

## Gateway Atual (Implícito)
| Ponto de Integração | Mecanismo | Protocolo |
|---|---|---|
| Banco de dados | Prisma Client | TLS / TCP |
| Autenticação | Auth.js Callbacks | HTTPS / JWT |
| Deploy | Vercel CLI / GitHub Webhook | HTTPS |
| Exportação LGPD | Route Handler JSON | HTTPS Download |

## Gateway Futuro (Planejado)
```
┌─────────────────────────────────────┐
│        Integration Gateway          │
│  (Vercel Edge Function ou API GW)   │
├─────────────┬───────────────────────┤
│  Seguradora │  Avaliacao de mercado │
│  Webhook    │  API externa (REST)   │
└─────────────┴───────────────────────┘
```
- **Padrão:** Adapter por integração, exposto via `/api/integrations/{provider}`.
- **Segurança:** API Key por parceiro, rate limiting via Vercel Middleware.
- **Contrato:** OpenAPI 3.1 versionado por integração.

## Decisão Atual
Nenhum gateway externo ativo. Arquitetura preparada para adição sem refatoração do núcleo.
