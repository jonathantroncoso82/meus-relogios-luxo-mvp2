-- Migration 002: Criar tabela de relógios
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

CREATE INDEX IF NOT EXISTS idx_relogios_usuario  ON relogios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_relogios_marca    ON relogios(marca_id);
CREATE INDEX IF NOT EXISTS idx_relogios_colecao  ON relogios(colecao_id);
