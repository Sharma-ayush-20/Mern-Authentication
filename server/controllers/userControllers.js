import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {

        const {userId} = req.body;

        if(!userId){
            return res.status(401).json({
                success: false,
                message: "User Id not found"
            })
        }

        const user = await userModel.findById(userId)

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User Not Found"
            })
        }

        return res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export default getUserData;