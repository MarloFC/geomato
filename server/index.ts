import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Successfully connected to PostgreSQL');
});

// Routes

// GET all operations with their materials
app.get('/api/operations', async (req, res) => {
    try {
        const opsQuery = 'SELECT * FROM operations ORDER BY created_at DESC';
        const opsResult = await pool.query(opsQuery);

        const operations = await Promise.all(opsResult.rows.map(async (op) => {
            const matsQuery = 'SELECT * FROM materials WHERE operation_id = $1';
            const matsResult = await pool.query(matsQuery, [op.id]);

            // Map database snake_case to frontend camelCase
            return {
                id: op.id,
                title: op.title,
                embarcacao: op.embarcacao,
                dataCarregamento: op.data_carregamento,
                coroaBE: op.coroa_be,
                coroaBB: op.coroa_bb,
                obsEmbarque: op.obs_embarque,
                stoRespo: op.sto_respo,
                apoioRespo: op.apoio_respo,
                materials: matsResult.rows.map(m => ({
                    id: m.id,
                    material: m.material,
                    quantidade: m.quantidade,
                    armazenamento: m.armazenamento,
                    comprimento: m.comprimento,
                    objetivo: m.objetivo,
                    origem: m.origem,
                    proprietario: m.proprietario,
                    sequencia: m.sequencia
                }))
            };
        }));

        res.json(operations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST new operation
app.post('/api/operations', async (req, res) => {
    const { title, embarcacao, dataCarregamento, coroaBE, coroaBB, obsEmbarque, stoRespo, apoioRespo } = req.body;
    try {
        const query = `
      INSERT INTO operations 
      (title, embarcacao, data_carregamento, coroa_be, coroa_bb, obs_embarque, sto_respo, apoio_respo) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`;
        const values = [title, embarcacao, dataCarregamento, coroaBE, coroaBB, obsEmbarque, stoRespo, apoioRespo];
        const result = await pool.query(query, values);

        const newOp = result.rows[0];
        res.status(201).json({
            ...newOp,
            dataCarregamento: newOp.data_carregamento,
            coroaBE: newOp.coroa_be,
            coroaBB: newOp.coroa_bb,
            obsEmbarque: newOp.obs_embarque,
            stoRespo: newOp.sto_respo,
            apoioRespo: newOp.apoio_respo,
            materials: []
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE operation
app.delete('/api/operations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM operations WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST add material
app.post('/api/operations/:id/materials', async (req, res) => {
    const { id } = req.params;
    const { material, quantidade, armazenamento, comprimento, objetivo, origem, proprietario, sequencia } = req.body;
    try {
        const query = `
      INSERT INTO materials 
      (operation_id, material, quantidade, armazenamento, comprimento, objetivo, origem, proprietario, sequencia) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`;
        const values = [id, material, quantidade, armazenamento, comprimento, objetivo, origem, proprietario, sequencia];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE material
app.delete('/api/operations/:id/materials/:matId', async (req, res) => {
    const { matId } = req.params;
    try {
        await pool.query('DELETE FROM materials WHERE id = $1', [matId]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
