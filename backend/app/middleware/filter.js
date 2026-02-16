import jwt from "jsonwebtoken";

export const filter = (...allowedRoles) => {
    return (req, res, next) => {

        let filt = {};
        let user = null;

        let token = req.query.token || req.headers['x-access-token'];

        if (token) {
            try {
                user = jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                user = null;
            }
        }

        let role = user ? user.role : null;

        if (!allowedRoles.includes(role)) {
            filt.isDraft = false;
        }

        req.filter = filt;
        next();
    };
};
