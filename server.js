import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Conectado ao MongoDB'))
    .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// History Schema
const historySchema = new mongoose.Schema({
    date: { type: String, required: true },
    value: { type: Number, required: true },
    weather: { type: Number, default: 0 },
    events: { type: Number, default: 0 }
});

const History = mongoose.model('History', historySchema);

// Routes
// Get all history
app.get('/api/history', async (req, res) => {
    try {
        const data = await History.find().sort({ date: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Seed data (convenience endpoint)
app.post('/api/seed', async (req, res) => {
    try {
        const initialData = req.body;
        await History.deleteMany({});
        const result = await History.insertMany(initialData);
        res.status(201).json({ message: 'Dados semeados com sucesso!', count: result.length });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
