import express from "express";
import userModel from "../app/models/userModel.js";
import passport from "passport";
import csurf from "csurf";
import path from "path";

const __dirname = path.resolve();

const csrfProtection = csurf();
const router = express.Router();

router.use(csrfProtection);

const HOST_IP = `http://localhost:${process.env.PORT}`;

router.get("/signup", (req, res, next) => {
  let messages = req.flash("error");
  res.render(path.join(__dirname + "/src/views/signup.handlebars"), {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
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
