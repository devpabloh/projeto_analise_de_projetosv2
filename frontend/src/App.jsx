import './App.css';
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import Login from "./components/Login";
import Register from "./components/Register";
import DashboardLayout from "./components/DashboardLayout";
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Erro ao analisar dados do usuário:", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false); 
    }, []);

    return (
        <ErrorBoundary>
            <BrowserRouter>
                {loading ? (
                    <div>Carregando...</div>
                ) : (
                    <Routes>
                        <Route path="/" element={<Login onLogin={setUser} />} />
                        <Route path="/register" element={<Register />} />
                        <Route 
                            path="/dashboard/*" 
                            element={
                                user ? (
                                    <DashboardLayout 
                                        user={user} 
                                        onLogout={() => {
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('user');
                                            setUser(null);
                                        }} 
                                    />
                                ) : (
                                    <Navigate to="/" replace />
                                )
                            } 
                        />
                    </Routes>
                )}
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;