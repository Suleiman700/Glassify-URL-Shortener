function getClientIP(req) {
    return req.ip || req.connection.remoteAddress;
}

module.exports = {
    getClientIP
};
