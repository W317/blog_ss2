import express from "express";
import passport from "passport";
import csurf from "csurf";
import path from "path";
import userModel from "../app/models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt-nodejs";

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
    if (err) {
      return;
    }
    res.redirect("/");
  });
});

// const checkConfirmPass = async (req, res, next) => {
//   try {
//     const { password, confirmPassword} = req.body
//     console.log(password, confirmPassword);
//     if(password && confirmPassword && password === confirmPassword) {
//       delete req.body.confirmPassword
//       next()
//     }

//     return
//   } catch (error) {
//     console.error(error)
//     throw new Error(error.toString())
//   }
// }

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
      res.redirect("/");
    }
  }
);

router.get("/logout", (req, res, next) => {
  let messages = req.flash("error");
  req.logOut({}, (err) => {
    if (err) {
      return;
    }
    res.redirect("/");
  });
});

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
    failureRedirect: "/user/signin",
    failureFlash: true,
  }),
  async (req, res, next) => {
    if (req.session.oldUrl) {
      let oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      const user = await userModel.findById(req?.session?.passport?.user);
      if (user && user?.isAdmin) {
        res?.redirect("/admin/dashboard");
      } else {
        res.redirect("/");
      }
    }
  }
);

export default router;
