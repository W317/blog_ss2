class DocController {
    // Get /doc
    index(req, res) {
        res.render('doc');
    }
}

export default new DocController();
