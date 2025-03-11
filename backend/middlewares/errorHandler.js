export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: 'Erro de validação',
            details: err.errors.map(e => e.message)
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            error: 'Registro duplicado',
            details: err.errors.map(e => e.message)
        });
    }

    // Adicione um log mais detalhado para erros desconhecidos
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Erro desconhecido'
    });
};