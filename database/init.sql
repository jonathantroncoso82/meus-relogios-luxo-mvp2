-- ============================================================
-- Controle de Colecção de Relógios de Luxo — Schema Completo
-- ============================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. USUÁRIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(150) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    senha_hash  VARCHAR(255) NOT NULL,
    criado_em   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. MARCAS
-- ============================================================
CREATE TABLE IF NOT EXISTS marcas (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(150) NOT NULL UNIQUE,
    pais_origem VARCHAR(100),
    descricao   TEXT,
    logo_url    VARCHAR(500),
    usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. COLEÇÕES
-- ============================================================
CREATE TABLE IF NOT EXISTS colecoes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(150) NOT NULL,
    descricao   TEXT,
    usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(nome, usuario_id)
);

-- ============================================================
-- 4. RELÓGIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS relogios (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id          UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    marca_id            UUID REFERENCES marcas(id) ON DELETE SET NULL,
    colecao_id          UUID REFERENCES colecoes(id) ON DELETE SET NULL,
    modelo              VARCHAR(200) NOT NULL,
    referencia          VARCHAR(100),
    numero_serie        VARCHAR(100),
    ano_fabricacao      INTEGER,
    movimento           VARCHAR(100),
    caixa_material      VARCHAR(100),
    caixa_diametro_mm   NUMERIC(5,2),
    pulseira_material   VARCHAR(100),
    cor_mostrador       VARCHAR(100),
    condicao            VARCHAR(50)  NOT NULL DEFAULT 'Excelente',
    preco_compra        NUMERIC(15,2),
    data_compra         DATE,
    local_compra        VARCHAR(200),
    notas               TEXT,
    imagem_url          VARCHAR(500),
    criado_em           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. MANUTENÇÕES
-- ============================================================
CREATE TABLE IF NOT EXISTS manutencoes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relogio_id      UUID NOT NULL REFERENCES relogios(id) ON DELETE CASCADE,
    usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo            VARCHAR(100) NOT NULL,
    descricao       TEXT,
    data_servico    DATE NOT NULL,
    custo           NUMERIC(12,2),
    prestador       VARCHAR(200),
    proximo_servico DATE,
    notas           TEXT,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. SEGUROS
-- ============================================================
CREATE TABLE IF NOT EXISTS seguros (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relogio_id          UUID NOT NULL REFERENCES relogios(id) ON DELETE CASCADE,
    usuario_id          UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    seguradora          VARCHAR(200) NOT NULL,
    numero_apolice      VARCHAR(100),
    valor_segurado      NUMERIC(15,2) NOT NULL,
    premio_anual        NUMERIC(12,2),
    data_inicio         DATE NOT NULL,
    data_vencimento     DATE NOT NULL,
    cobertura           TEXT,
    notas               TEXT,
    ativo               BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. AVALIAÇÕES / VALUATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS avaliacoes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relogio_id      UUID NOT NULL REFERENCES relogios(id) ON DELETE CASCADE,
    usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    valor_avaliado  NUMERIC(15,2) NOT NULL,
    data_avaliacao  DATE NOT NULL,
    avaliador       VARCHAR(200),
    metodo          VARCHAR(100),
    notas           TEXT,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Índices de performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_relogios_usuario    ON relogios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_relogios_marca      ON relogios(marca_id);
CREATE INDEX IF NOT EXISTS idx_relogios_colecao    ON relogios(colecao_id);
CREATE INDEX IF NOT EXISTS idx_marcas_usuario      ON marcas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_colecoes_usuario    ON colecoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_manutencoes_relogio ON manutencoes(relogio_id);
CREATE INDEX IF NOT EXISTS idx_seguros_relogio     ON seguros(relogio_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_relogio  ON avaliacoes(relogio_id);
