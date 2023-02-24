import userModel from '../models/userModel.js'

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

export default new UserController();