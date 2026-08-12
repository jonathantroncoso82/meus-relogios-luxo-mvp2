# Anti-Corruption Layer (ACL)

## Contexto
O sistema integra com provedores externos (Supabase/Neon, Auth.js, Vercel). A ACL protege o domínio interno de mudanças nesses provedores.

## Camadas de Proteção

### 1. Repositório Prisma (ACL para Banco)
```
Domínio → WatchRepository (interface) → PrismaClient → PostgreSQL
```
- Toda query passa por funções tipadas do Prisma.
- Se migrar de Supabase para Neon (ou outro), apenas `DATABASE_URL` muda.
- RLS encapsulado no banco; a aplicação não conhece detalhes de isolamento.

### 2. AuthAdapter (ACL para Auth.js)
```
Domínio → useSession() / getServerSession() → Auth.js → Provider
```
- O domínio nunca acessa tokens JWT diretamente.
- Troca de provider (Credentials → OAuth) não afeta lógica de negócio.

### 3. Zod Schemas (ACL para Entrada Externa)
```
HTTP Request → ZodSchema.parse() → Domínio tipado
```
- Nenhum dado não validado entra no domínio.
- Schemas versionados em `/lib/schemas/watch.schema.ts`.

## Benefício
Isolamento do domínio de relógios de qualquer detalhe de infraestrutura ou protocolo externo.
