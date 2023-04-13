import userModel from '../models/userModel.js'
import asyncHandler from 'express-async-handler'

class UserController {
    // Get /user
    user(req, res) {
        userModel.find({}, function (err, user) {
            if (!err) res.json({
                text : 'user'
            })
        });
    }
}

export const deleteUser = asyncHandler(async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(204).redirect('back');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  })

export default new UserController();