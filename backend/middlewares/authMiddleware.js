import jwt from 'jsonwebtoken'; 


export const authMiddleware = (requisicao, resposta, next)=>{

    const authHeader = requisicao.headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return resposta.status(401).json({message: "Acesso negado, token não encontrado"})
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        requisicao.user = decoded;
        next()
    } catch (error) {
        return resposta.status(401).json({message: "Token inválido ou expirado."})
    }
}