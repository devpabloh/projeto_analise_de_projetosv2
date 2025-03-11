import express from "express"; // importando o express que serve para criar o servidor node.js
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { dataTypeConverter } from "../middlewares/dataTypeConverter.js"; // Importando o novo middleware
import { createProject, deleteProject, getProjectId, listProjects, updateProject } from "../controller/projectController.js";

const router = express.Router(); // estamos criando uma variavel router que vai receber um novo objeto express.Router(), que serve para criar rotas.

// Rota para criar um novo projeto - adicionando o middleware de conversão
router.post("/", authMiddleware, dataTypeConverter, createProject)

// Rota para listar todos os projetos
router.get('/', authMiddleware, listProjects)

// Rota para recuperar um projeto específico por ID
router.get("/:id", authMiddleware, getProjectId)

// Rota para atualizar um projeto - adicionando o middleware de conversão
router.put("/:id", authMiddleware, dataTypeConverter, updateProject)

// Rota para deletar um projeto
router.delete("/:id", authMiddleware, deleteProject)

export default router;