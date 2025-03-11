/**
 * Middleware para converter tipos de dados antes de processar a requisição
 * Converte strings como 'sim'/'não' para valores booleanos
 */
export const dataTypeConverter = (req, res, next) => {
    if (req.body) {
        // Lista de campos que devem ser convertidos para boolean
        const booleanFields = ['hasDocumentation', 'securityMeasures', 'compliance'];
        
        for (const field of booleanFields) {
            if (req.body[field] !== undefined) {
                // Converte 'sim' para true
                if (req.body[field] === 'sim') {
                    req.body[field] = true;
                }
                // Converte 'não' ou 'nao' para false
                else if (req.body[field] === 'não' || req.body[field] === 'nao') {
                    req.body[field] = false;
                }
            }
        }
    }
    
    next();
};