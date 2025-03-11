import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(requisicao, resposta){
    try{
        const {name, email,password, role } = requisicao.body

        const existingUser = await User.findOne({where: {email}})

        console.log('Tentando login com:', { email });

        if(existingUser){
            return resposta.status(400).json({message: "O usuário já existe."})
        }

        
        const hashedPassword = await bcrypt.hash(password, 10) 

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "common"
        })

        resposta.status(200).json({message: `Usuário ${name} registrado com sucesso!`})

    }catch(error){
        resposta.status(500).json({error: error.message})
    }
}

export async function login(requisicao, resposta){
    try {
        const email = requisicao.body.email
        const password = requisicao.body.password
        const user = await User.findOne({where: {email}})
    
        if(!user){
            return resposta.status(401).json({message: "Email inválido"})
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if(!validPassword){
            return resposta.status(401).json({message: "Senha inválida"})
        }

        const token = jwt.sign(
            {id: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "1d"} 
        );
        resposta.json({token, user: {id: user.id, name: user.name, role: user.role}})

    } catch (error) {
        console.error('Erro detalhado:', error);
        resposta.status(500).json({error: error.message})
    }
}