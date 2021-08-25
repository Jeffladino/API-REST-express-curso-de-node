function log(req, res, next){
    console.log('loggin..........');
    next();
}

module.exports = log;