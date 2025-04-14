function routeError(req,res,next){
    res.status(404).json({
        error: '404 Not Found',
        message:'Route not found',
    });
}

module.exports = routeError;