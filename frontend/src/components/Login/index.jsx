import { useState } from 'react';
import PropTypes from 'prop-types'; 
import styles from './Login.module.css';
import logoAti from '../../assets/logoAti.png';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);
            
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            onLogin(response.data.user);
            
            navigate('/dashboard'); 
            
        } catch (err) {
            setError('Erro ao fazer login. Verifique suas credenciais.');
            console.error("Erro ao fazer login:", err); 
            if (err.response) {
                console.error("Detalhes do erro:", err.response.data); // 
            }
        }
    };

    return (
        <div className={styles.containerGeral}>
            <div className={styles.containerImagem}>
                <img src={logoAti} alt="" />
            </div>
            <div className={styles.containerBackgroundLogin}>
                <div className={styles.containerLogin}>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <form className={styles.containerForm} onSubmit={handleLogin}>
                        <h2>Login</h2>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <div className={styles.buttonContainer}>
                            <button type="submit">Entrar</button>
                            <button 
                                type="button" 
                                onClick={handleRegister}
                                className={styles.registerButton}
                            >
                                Registrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

Login.propTypes = {
    onLogin: PropTypes.func.isRequired
};

export default Login;