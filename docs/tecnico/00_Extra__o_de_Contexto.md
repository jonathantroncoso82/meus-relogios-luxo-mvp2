# Extração de Contexto — Controle de Coleção de Relógios de Luxo

## Domínio
Gestão de acervo pessoal de relógios de luxo para colecionadores individuais.

## Atores Principais
- **Colecionador:** usuário único autenticado, realiza CRUD da coleção.
- **Seguradora / Perito:** consumidores indiretos dos dados exportados.
- **Herdeiros / Familiares:** acesso eventual ao patrimônio registrado.

## Entidades Centrais
| Entidade | Atributos-chave |
|---|---|
| `Watch` | brand, model, manufactureYear, purchaseDate, movementType |
| `User` | email, passwordHash, createdAt |

## Regras de Negócio Críticas
1. `manufactureYear` ∈ [1800, anoAtual].
2. `purchaseDate` ≥ `manufactureYear` e ≤ hoje.
3. `movementType` ∈ {BATTERY, AUTOMATIC}.
4. Unicidade: (userId, brand, model, manufactureYear, purchaseDate).
5. Campos `brand` e `model` não podem ser vazios ou só espaços.

## Restrições Não Funcionais
- Disponibilidade ≥ 99% em horário comercial.
- Latência < 2 s para consultas e registros.
- LGPD: exportação e deleção de dados sob demanda.
- Sem escala horizontal imediata; arquitetura preparada para crescimento.

## Fronteiras do Sistema
- **In scope:** CRUD relógios, autenticação, painel estatístico, conformidade LGPD.
- **Out of scope:** avaliação de preço de mercado, integração com seguradoras, marketplace.
