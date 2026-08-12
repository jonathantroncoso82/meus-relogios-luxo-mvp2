-- Migration 004: Criar tabela de manutenções
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

CREATE INDEX IF NOT EXISTS idx_manutencoes_relogio ON manutencoes(relogio_id);
