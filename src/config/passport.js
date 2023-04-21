import passport from "passport";
import userModel from "../app/models/userModel.js";
import passportLocal from "passport-local";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id, (err, user) => {
    done(err, user);
  });
});

const LocalStrategy = passportLocal.Strategy;

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      req.checkBody("email", "Invalid email").notEmpty().isEmail();
      req
        .checkBody("password", "Invalid password")
        .notEmpty()
        .isLength({ min: 4 });

      let errors = req.validationErrors();

      if (req.body.password !== req.body.confirmPassword) {
        return done(null, false, { message: "Passwords do not match." });
      }

      if (errors) {
        let messages = [];
        errors.forEach((err) => {
          messages.push(err.msg);
        });
        return done(null, false, messages);
      }

      const { name } = req.body;

      try {
        const user = await userModel.findOne({ email: email });
        if (user) {
          return done(null, false, { message: "Email already in use." });
        }

        let newUser = new userModel()
          newUser.name = name
          newUser.email = email
          newUser.isAdmin = false
          newUser.password = newUser.encryptPassword(password)
          newUser.address = ""
          newUser.phone = ""
          // newUser.username = ""
          newUser.image = "/img/user_default.png"
          newUser.dayJoined = new Date()

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);



passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      req.checkBody("email", "Invalid email").notEmpty().isEmail();
      req.checkBody("password", "Invalid password").notEmpty();
      let errors = req.validationErrors();

      if (errors) {
        let messages = [];
        errors.forEach((err) => {
          messages.push(err.msg);
        });
        return done(null, false, req.flash("error", messages));
      }

      userModel.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "No user found." });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Wrong password." });
        }
        req.session.user = user
        return done(null, user);
      });
    }
  )
);
