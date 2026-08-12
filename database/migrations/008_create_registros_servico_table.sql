CREATE TABLE registros_servico (
  id SERIAL PRIMARY KEY,
  relogio_id INTEGER NOT NULL,
  data_servico TIMESTAMP NOT NULL,
  tipo_servico VARCHAR(100) NOT NULL,
  descricao TEXT,
  custo DECIMAL(10, 2),
  tecnico VARCHAR(100),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relogio_id) REFERENCES relogios(id) ON DELETE CASCADE
);

CREATE INDEX idx_registros_servico_relogio_id ON registros_servico(relogio_id);
CREATE INDEX idx_registros_servico_data_servico ON registros_servico(data_servico);
