import { useState, useEffect } from 'react';
import styles from './History.module.css';

const History = () => {
    const [history, setHistory] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/analiseDeProjetos/history', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setHistory(data);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className={styles.container}>
            <h2>Histórico de Alterações</h2>
            <div className={styles.historyList}>
                {history.map(entry => (
                    <div 
                        key={entry.id} 
                        className={styles.entry}
                        onClick={() => setSelectedEntry(entry)}
                    >
                        <div>{entry.actionType} - {entry.entityType}</div>
                        <div>{new Date(entry.createdAt).toLocaleString()}</div>
                    </div>
                ))}
            </div>
            {selectedEntry && (
                <div className={styles.details}>
                    <h3>Detalhes da Alteração</h3>
                    <pre>{JSON.stringify(selectedEntry.details, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default History;