# BFF — Backend for Frontends

## Contexto
O projeto é um monolito modular Next.js. O padrão BFF é aplicado **internamente** via React Server Components (RSC) e Route Handlers, sem serviços separados.

## Mapeamento BFF Interno

| Canal / Tela | BFF (RSC / Route Handler) | Dados Agregados |
|---|---|---|
| Listagem da coleção | `app/(watches)/page.tsx` (RSC) | watches + totais |
| Formulário de cadastro/edição | `app/(watches)/new/page.tsx` (RSC) | enums, defaults |
| Painel resumo | `app/dashboard/page.tsx` (RSC) | stats agregadas |
| Autenticação | `app/api/auth/[...nextauth]/route.ts` | sessão JWT |
| Exportação LGPD | `app/api/user/export/route.ts` | todos os dados do user |

## Decisão
- **Não** criar BFF como serviço separado no curto prazo: overhead desnecessário para uso individual.
- RSC elimina round-trips desnecessários ao cliente, cumprindo o papel de BFF de forma nativa.
- Se houver app mobile futuro, extrair BFF dedicado como API Gateway separado na Vercel (Edge Functions).

## Benefício
Latência reduzida (dados buscados no servidor antes do render), sem exposição de lógica de agregação ao cliente.
