import express from "express";
import User from "../models/user.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { getAllUsers, updateUserRole, deleteUser } from '../controller/userController.js';

const router = express.Router(); 

// Rota para criar um usuário (existente)
router.post('/', async (requisicao, resposta)=>{
    try{
        const {name, email, password, role} = requisicao.body 

        const user = await User.create({name, email, password, role}); 

        resposta.status(201).json(user); 
    }catch(error){
        resposta.status(500).json({error: error.message})
    }
})


router.get('/', authMiddleware, adminMiddleware, getAllUsers);


router.put('/:id/role', authMiddleware, adminMiddleware, updateUserRole);


router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;