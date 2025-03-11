import {Routes, Route, Link, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';


import styles from './DashboardLayout.module.css';


import logoATI from '../../assets/logoATI.png';


import ProjectList from '../ProjectList/index.jsx';
import ProjectModal from '../ProjectModal/index.jsx';
import UserManagement from '../UserManagement/index.jsx';

const DashboardLayout = ({user, onLogout})=>{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const handleResize = ()=>{
            if(window.innerWidth > 768){
                setMenuOpen(false);
            }
        }
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onLogout();
        navigate('/');
    };

    const handleSaveProject = async (projectData)=>{
        try{
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3000/analiseDeProjetos/projects', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(projectData)
            });

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(`Erro ao salvar projeto: ${errorData.error || response.statusText}`);
            }

            setIsModalOpen(false);
            navigate('/dashboard/projects');
        }catch(error){
            console.error('Erro ao salvar projeto:', error);
            alert(error.message);
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <button 
                className={styles.menuButton} 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
                <div className={styles.containerLogo}>
                    <img src={logoATI} alt="logo da Agência de tecnologia de Pernambuco" />
                </div>
                <nav className={styles.containerNavegacao}>
                    <ul>
                        <li>
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link> 
                        </li>
                        <li>
                            <Link to="/dashboard/projects" onClick={() => setMenuOpen(false)}>Projetos</Link>
                        </li>
                        {user && user.role === 'admin' && (
                            <li>
                                <Link to="/dashboard/users" onClick={() => setMenuOpen(false)}>Usuários</Link>
                            </li>
                        )}
                    </ul>
                </nav>
                <div className={styles.userInfo}>
                    <p>Olá, {user?.name || 'Usuário'}</p>
                    <button onClick={handleLogout}>
                        Sair
                    </button>
                </div>
            </aside>
            
            <div className={`${styles.overlay} ${menuOpen ? styles.open : ''}`} onClick={() => setMenuOpen(false)}></div>

            <main className={styles.mainContent}>
                <div className={styles.header}>
                    <h1>Dashboard</h1>
                    {user && user.role !== 'admin' && (
                        <button onClick={()=> setIsModalOpen(true)} className={styles.addButton}>
                            Adicionar Projeto
                        </button>
                    )}
                </div>
                <div className={styles.contentArea}>
                    <Routes>
                        <Route path="/" element={<DashboardHome user={user} />} />
                        <Route path="/projects" element={<ProjectList />} />
                        <Route path="/users" element={<UserManagement currentUser={user} />} />
                    </Routes>
                </div>
            </main>
            <ProjectModal 
                isOpen={isModalOpen} 
                isClose={() => setIsModalOpen(false)} 
                onSave={handleSaveProject}
            />
        </div>
    );
};

function DashboardHome({ user }) {
    return (
        <div>
            <h2>Bem-vindo ao Sistema de Análise de Projetos, {user.name}!</h2>
            <p>Selecione uma opção no menu lateral para começar.</p>
            <p>Seu papel no sistema: {user.role === 'admin' ? 'Administrador' : 'Usuário Comum'}</p>
        </div>
    );
}

DashboardLayout.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired
    }).isRequired,
    onLogout: PropTypes.func.isRequired
};

DashboardHome.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired
    }).isRequired
};


export default DashboardLayout;