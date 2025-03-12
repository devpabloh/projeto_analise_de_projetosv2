import History from "../models/History.js";

const historyLogger = async (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;

    const logHistory = (data) => {
        if (req.user && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
            const entityType = req.path.includes('projects') ? 'PROJECT' : 'USER';
            const actionType = req.method === 'POST' ? 'CREATE' : 
                            req.method === 'PUT' ? 'UPDATE' : 'DELETE';
            
            History.create({
                userId: req.user.id,
                actionType,
                entityType,
                entityId: req.params.id || data.id,
                details: req.body
            });
        }
    };

    res.send = function (data) {
        logHistory(data);
        return originalSend.apply(this, arguments);
    };

    res.json = function (data) {
        logHistory(data);
        return originalJson.apply(this, arguments);
    };

    next();
};

export default historyLogger;