-- Migration 005: Criar tabela de seguros
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

CREATE INDEX IF NOT EXISTS idx_seguros_relogio ON seguros(relogio_id);
