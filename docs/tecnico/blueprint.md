# Blueprint Técnico

## Arquitetura-alvo

A plataforma Controle de Coleção de Relógios de Luxo é uma aplicação fullstack greenfield construída integralmente em Next.js 14+ com App Router, hospedada na Vercel e conectada a um banco PostgreSQL gerenciado (Supabase ou Neon). A arquitetura segue o padrão Fullstack Monolítico Modular, adequado ao volume de uso individual e ao requisito de crescimento futuro sem reescrita.

**Camadas da aplicação:**

1. **Frontend (React — App Router):** Páginas e componentes React organizados por feature (relógios, painel, autenticação). Server Components são usados para busca de dados sem exposição de lógica ao cliente; Client Components apenas onde há interatividade (formulários, filtros, gráficos). O painel resumo exibe totais e estatísticas via Recharts. Tailwind CSS garante UI consistente e responsiva.

2. **API Layer (Next.js Route Handlers):** Endpoints REST organizados em `/app/api/watches/` (CRUD completo) e `/app/api/auth/` (autenticação). Toda entrada é validada com Zod, aplicando as regras de negócio no servidor: ano de fabricação não futuro e não anterior a 1800, data de compra não futura e não anterior ao ano de fabricação, tipo de movimento restrito a enum `BATTERY | AUTOMATIC`, campos obrigatórios sem espaços, unicidade de (marca + modelo + ano + data de compra) por usuário.

3. **Autenticação e Autorização:** Auth.js (NextAuth) com provider de credenciais (e-mail + senha com hash bcrypt) ou Supabase Auth. Sessão via JWT httpOnly cookie. RLS no PostgreSQL garante isolamento de dados por usuário no nível do banco, como segunda camada de segurança além da verificação na API.

4. **Persistência (PostgreSQL via Prisma):** Schema com tabela `Watch` (id, userId, brand, model, manufactureYear, purchaseDate, movementType, createdAt, updatedAt) e tabela `User`. Prisma gerencia migrations versionadas. RLS assegura que cada query retorne apenas registros do usuário autenticado. Dados em repouso criptografados pelo provedor gerenciado; TLS obrigatório em trânsito.

5. **Conformidade LGPD:** Endpoint dedicado para exportação dos dados do usuário (JSON) e endpoint de exclusão de conta com deleção em cascata. Finalidade de uso registrada em política de privacidade. Sem compartilhamento de dados com terceiros.

6. **Qualidade e CI/CD:** Pipeline GitHub Actions executa ESLint, TypeScript type-check e testes unitários (Jest + Testing Library) a cada push. Deploy automático na Vercel com preview por PR e produção na branch main. Variáveis sensíveis (DATABASE_URL, AUTH_SECRET) armazenadas como secrets criptografados na Vercel.

**Decisões arquiteturais relevantes:** Monolito modular foi preferido a microsserviços dado o escopo individual, baixo volume e time enxuto — a separação por feature dentro do Next.js permite extrair serviços futuros sem reescrita. PostgreSQL com RLS elimina a necessidade de multi-tenancy complexo. Prisma como ORM garante type-safety end-to-end e migrations rastreáveis. A escolha de Vercel + Supabase/Neon atende ao SLA de 99% em horário comercial com infraestrutura gerenciada e zero operação de servidor.

## Stack

- Linguagens: ["TypeScript"]
- Frameworks: ["Next.js 14+ (App Router — API Routes + React Server Components + Client Components)", "Zod (validação de esquemas e regras de negócio no servidor)", "Prisma ORM (acesso ao banco, migrations, type-safety)", "NextAuth.js / Auth.js (autenticação com sessão segura)", "Tailwind CSS (estilização do frontend)", "React Hook Form (formulários com validação client-side)", "Recharts (gráficos e estatísticas do painel resumo)"]
