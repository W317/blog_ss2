import BlogModel from '../models/blog.js'

class SiteController {
    // Get /
    home(req, res) {
        BlogModel.find({}, function (err, blog) {
            if (!err) res.json({
                text : 'hi'
            })
        });
    }

    search(req, res) {
        res.render('search');
    }
}


export default new SiteController();
