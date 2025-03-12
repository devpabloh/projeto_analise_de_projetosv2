import dotenv from 'dotenv';
import historyLogger from './middlewares/historyLogger.js';
import historyRoutes from './routes/history.js';

// Carrega o .env e verifica se houve erro
const result = dotenv.config();
if (result.error) {
    console.error('Erro ao carregar o .env:', result.error);
} else {
    console.log('Arquivo .env carregado com sucesso');
}

// Resto do código...
import { errorHandler } from './middlewares/errorHandler.js';
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import sequelize from "./config/database.js";
import './models/associations.js';

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errorHandler);
app.use(historyLogger);

app.use('/analiseDeProjetos/auth', authRoutes);
app.use('/analiseDeProjetos/users', userRoutes);
app.use('/analiseDeProjetos/projects', projectRoutes);
app.use('/analiseDeProjetos/history', historyRoutes);

sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`O servidor está rodando na porta ${PORT}`);
        });
    })
    .catch(error => {
        console.error(`Erro ao sincronizar o banco de dados: ${error}`);
        process.exit(1);
    });