const jwt = require("jsonwebtoken");
const User = require("../models/User")

const authAdmin = (req, res, next) => {
    let token = 'xyz';
    let isAdminAuthenticated = token === 'xyz';
    if (!isAdminAuthenticated) {
        res.status(401).send("Unauthorized Request")
    } else {
        next();
    }
}

const authUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.status(401).json({message: "Invalid Token"});

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) throw new Error("Token Verification Fails");

        const { _id } = decodedToken;
        if (!_id) throw new Error("No Data In Token");

        const isUserExist = await User.findOne({_id: _id});
        if (!isUserExist) throw new Error("No User Found")
        
        req.user = isUserExist;
        next();
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
}

module.exports = {
    authAdmin,
    authUser
};