# Mapa de Capacidades — Controle de Relógios de Luxo

## Domínio: Gestão de Acervo

| Capacidade | Subcapacidades | Componente Responsável |
|---|---|---|
| **Gestão de Relógios** | Cadastrar, Listar, Editar, Excluir | `api/watches` + Prisma |
| **Busca e Filtro** | Por marca, modelo, ano, movimento | `api/watches?filter=` |
| **Painel Analítico** | Totais, estatísticas, gráficos | Frontend Recharts + RSC |
| **Gestão de Identidade** | Registro, Login, Sessão, Logout | `api/auth` + Auth.js |
| **Conformidade LGPD** | Exportar dados (JSON), Excluir conta | `api/user/export`, `api/user/delete` |
| **Segurança de Dados** | RLS, TLS, criptografia em repouso | PostgreSQL + Vercel Secrets |
| **Qualidade e Entrega** | Lint, typecheck, testes, deploy | GitHub Actions + Vercel |

## Capacidades Futuras (Roadmap)
| Capacidade | Horizonte |
|---|---|
| Avaliação de mercado (integração externa) | H2 |
| Compartilhamento de coleção (link público) | H2 |
| Upload de fotos dos relógios | H3 |
| Relatório PDF para seguradoras | H3 |
