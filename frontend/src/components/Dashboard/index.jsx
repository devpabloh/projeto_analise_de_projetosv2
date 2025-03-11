import { useState, useEffect, useCallback } from "react"; 
import api from "../../services/api"; 
import ProjectModal from "../ProjectModal/ProjectModal";
import Header from "../Header";
import Footer from "../Footer";
import styles from "./Dashboard.module.css";
import PropTypes from 'prop-types';

function Dashboard({ user, onLogout }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = useCallback(async () => {
        try {
            const response = await api.get("/projects");
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            if (error.response?.status === 401) {
                alert("Sessão expirada. Por favor, faça login novamente.");
                onLogout();
            }
        } finally {
            setLoading(false);
        }
    }, [onLogout]);

    const handleSaveProject = useCallback(async (projectData) => {
        try {
            console.log("Enviando dados do projeto:", projectData);
            
            const response = await api.post(
                "/projects",
                projectData
            );
            console.log("Resposta do servidor:", response.data);
            await fetchProjects();
            setModalOpen(false);
        } catch (error) {
            console.error("Full error:", error);
            
            if (error.response) {
                
                console.error("Resposta de erro:", {
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers
                });
                
                if (error.response.status === 401) {
                    alert("Sessão expirada. Por favor, faça login novamente.");
                    onLogout();
                } else {
                    alert(`Erro ao salvar projeto: ${error.response?.data?.message || error.response?.data?.error || 'Erro no servidor'}`);
                }
            } else if (error.request) {
                
                console.error("Sem resposta do servidor:", error.request);
                alert("Erro de conexão com o servidor. Verifique se o backend está rodando.");
            } else {
                
                console.error("Erro na configuração da requisição:", error.message);
                alert(`Erro ao configurar requisição: ${error.message}`);
            }
        }
    }, [fetchProjects, onLogout]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    
    const openModal = useCallback(() => setModalOpen(true), []);
    const closeModal = useCallback(() => setModalOpen(false), []);

    return (
        <div className={styles.dashboardContainer}>
            <Header user={user} onLogout={onLogout} />
            <main className={styles.mainContent}>
                <div className={styles.projectsSection}>
                    <h1>Dashboard</h1>
                    <p>Bem vindo, {user.name}</p>
                    <h1>Meus Projetos</h1>
                    {user.role !== 'admin' && (
                        <button 
                            onClick={openModal} 
                            className={styles.addButton}
                        >
                            Adicionar Projeto
                        </button>
                    )}
                    {loading ? (
                        <p>Carregando projetos...</p>
                    ) : (
                        <ul className={styles.projectsList}> 
                            {projects.length === 0 ? (
                                <p>Nenhum projeto encontrado.</p>
                            ) : (
                                projects.map((project) => (
                                    <li key={project.id} className={styles.projectItem}>
                                        <h3>{project.projectName}</h3>
                                        <p><strong>Fase:</strong> {project.developmentPhase}</p>
                                        <p><strong>Descrição:</strong> {project.projectDescription}</p>
                                        <p><strong>Responsável:</strong> {project.responsibleFillingOut}</p>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                    {user.role !== 'admin' && (
                        <ProjectModal
                            isOpen={modalOpen}
                            isClose={closeModal}
                            onSave={handleSaveProject}
                        />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

Dashboard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired
    }).isRequired,
    onLogout: PropTypes.func.isRequired
};

export default Dashboard;