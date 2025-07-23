import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }

        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded_token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }
      
        req.body = req.body || {};//agar req.body set nhi rahega toh be default set kar raha hu yaha
        req.body.userId = decoded_token.id;

        next()

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export default userAuth;