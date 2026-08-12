# ADR-001 — Monolito Modular Next.js vs. Microsserviços

## Status
Aceito

## Contexto
Sistema de uso individual, time enxuto, sem requisito de escala horizontal imediata. Necessidade de entrega rápida com qualidade.

## Decisão
Adotar **Monolito Modular** em Next.js 14+ com App Router, organizado por feature (`/watches`, `/auth`, `/dashboard`).

## Alternativas Consideradas
| Alternativa | Motivo da Rejeição |
|---|---|
| Microsserviços | Overhead operacional desproporcional ao volume |
| SPA + API separada | Duplicação de deploy, CORS, latência adicional |
| Monolito sem módulos | Dificulta extração futura de serviços |

## Consequências
**Positivas:**
- Deploy único na Vercel, zero operação de servidor.
- Compartilhamento de tipos TypeScript entre frontend e API.
- Extração de serviços futuros possível sem reescrita (feature já isolada).

**Negativas:**
- Acoplamento de build: mudança em qualquer feature redeploye o todo.
- Limite de tamanho de bundle Vercel Serverless (mitigado por code splitting).

## Revisão
Reavaliar se usuários ativos > 1.000 ou features de integração externa forem priorizadas.
