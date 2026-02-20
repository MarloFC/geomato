-- Create Operations table
CREATE TABLE IF NOT EXISTS operations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    embarcacao VARCHAR(255),
    data_carregamento DATE,
    coroa_be VARCHAR(255),
    coroa_bb VARCHAR(255),
    obs_embarque TEXT,
    sto_respo VARCHAR(255),
    apoio_respo VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Materials table
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    operation_id INTEGER REFERENCES operations(id) ON DELETE CASCADE,
    material VARCHAR(255) NOT NULL,
    quantidade VARCHAR(100),
    armazenamento VARCHAR(100),
    comprimento VARCHAR(100),
    objetivo TEXT,
    origem VARCHAR(255),
    proprietario VARCHAR(255),
    sequencia VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
