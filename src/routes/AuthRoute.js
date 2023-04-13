import express from "express";
// import userModel from "../app/models/userModel.js";
import passport from "passport";
import csurf from "csurf";
import path from "path";

const __dirname = path.resolve();

const csrfProtection = csurf();

const router = express.Router();

router.use(csrfProtection);

router.get("/signup", (req, res, next) => {
  let messages = req.flash("error");
  res.render(path.join(__dirname + "/src/views/signup.handlebars"), {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

router.get("/logout", (req, res, next) => {
  let messages = req.flash("error");
  req.logOut({}, (err) => {
    if(err) {
      return
    }
    res.redirect("/")
  })

})

router.post(
  '/signup',
  passport.authenticate('local.signup', {
    failureRedirect: "/user/signup",
    failureFlash: true,
  }),
  (req, res, next) => {
    if (req.session.oldUrl) {
      let oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/index");
    }
  }
);

router.get("/signin", (req, res, next) => {
  let messages = req.flash("error");
  res.render(path.join(__dirname + "/src/views/signin.handlebars"), {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    failureRedirect: "/user/signup",
    failureFlash: true,
  }),
  (req, res, next) => {
    if (req.session.oldUrl) {
      let oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/index");
    }
  }
);

export default router;
