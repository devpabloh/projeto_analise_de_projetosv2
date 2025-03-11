import User from '../models/user.js';

export async function getAllUsers(requisicao, resposta) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role'] 
        });
        resposta.json(users);
    } catch (error) {
        resposta.status(500).json({ error: error.message });
    }
}

export async function updateUserRole(requisicao, resposta) {
    try {
        const { id } = requisicao.params;
        const { role } = requisicao.body;

        if (!['admin', 'common'].includes(role)) {
            return resposta.status(400).json({ message: "Role inválido. Use 'admin' ou 'common'" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return resposta.status(404).json({ message: "Usuário não encontrado" });
        }

        await user.update({ role });
        resposta.json({ message: "Papel do usuário atualizado com sucesso" });
    } catch (error) {
        resposta.status(500).json({ error: error.message });
    }
}

export async function deleteUser(requisicao, resposta) {
    try {
        const { id } = requisicao.params;
        
        const user = await User.findByPk(id);
        if (!user) {
            return resposta.status(404).json({ message: "Usuário não encontrado" });
        }

        await user.destroy();
        resposta.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        resposta.status(500).json({ error: error.message });
    }
}