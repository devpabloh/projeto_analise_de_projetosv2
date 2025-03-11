import { useState, useEffect, useCallback } from "react";

import api from "../../services/api.js";
import styles from "./UserManagement.module.css";
import PropTypes from "prop-types";


function UserManagement({currentUser}){
    const [users, setUsers] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = useCallback( async()=>{
        try{
            const response = await api.get('/users');
            setUsers(response.data);
            setError(null);
        }catch(error){
            console.error('Erro ao buscar usuários:', error);
            setError('Falha ao carregar usuários. Por favor, tente novamente.');
        }finally{
            setLoading(false);
        }
    }, []);

    useEffect(()=>{
        fetchUsers();

    }, [fetchUsers]);

    const handleRoleChange = async(userId, newRole)=>{
        try {
            await api.put(`/users/${userId}/role`, {role: newRole});
            setUsers(users.map(user => 
                user.id === userId ? {...user, role: newRole} : user
            ));
        } catch (error) {
            console.error('Erro ao atualizar papel do usuário:', error)
            alert('Falha ao atualizar papel do usuário.')
        }
    }

    const handleDeleteUser = async(userId)=>{
        if(!window.confirm('Tem certeza que deseja excluir este usuário?')){
            return;
        }
        try {
            await api.delete(`/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId))
        } catch (error) {
            console.error('Erro ao excluir usuário:', error)
            alert('Falha ao excluir usuário.')
        }
    }

    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
);

    if(Loading) return <div>Carregando usuários...</div>;
    if(error) return <div>Erro ao carregar usuários: {error}</div>;

    return(
        <div className={styles.userManagement}>
            <h2>Gerenciamento de usuários</h2>
            
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Pesquisar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <table className={styles.userTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Papel</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan="5">Nenhum usuário encontrado.</td>
                        </tr>
                    ) : (
                        filteredUsers.map(user => (
                            <tr key={user.id} className={user.id === currentUser.id ? styles.currentUser : ''}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role === 'admin' ? 'administrador' : 'comum'}</td>
                                <td className={styles.actions}>
                                    {user.id !== currentUser.id && (
                                        <>
                                            <select value={user.role} onChange={(e)=>handleRoleChange(user.id, e.target.value)} className={styles.roleSelect}>
                                                <option value="admin">Administrador</option>
                                                <option value="common">Comum</option>
                                            </select>
                                            <button onClick={()=>handleDeleteUser(user.id)} className={styles.deleteButton}>
                                                Excluir
                                            </button>
                                        </>
                                    )}
                                    {user.id === currentUser.id && (
                                        <span className={styles.currentUserLabel}>Usuário atual</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

UserManagement.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired
    }).isRequired
};

export default UserManagement;