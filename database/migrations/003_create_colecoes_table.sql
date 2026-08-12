-- Migration 003: Criar tabela de coleções
CREATE TABLE IF NOT EXISTS colecoes (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome          VARCHAR(150) NOT NULL,
    descricao     TEXT,
    usuario_id    UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(nome, usuario_id)
);

CREATE INDEX IF NOT EXISTS idx_colecoes_usuario ON colecoes(usuario_id);
