import async from "async";
import asyncHandler from "express-async-handler";
import path from "path";
import userModel from "../models/userModel.js";
const __dirname = path.resolve();
import crypto from "crypto";
import nodemailer from "nodemailer";

const getEmail = asyncHandler(async (req, res) => {
  const messages = req.flash("error");
  res.render(path.join(__dirname + "/src/views/reset-password.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

const handleSendEmail = asyncHandler(async (req, res) => {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        const token = buf.toString("hex");
        done(err, token);
      });
    },
    function (token, done) {
      if (!req.body.email) {
        req.flash("error", "Please enter an E-mail. ");
        return res.redirect("/user/reset-password");
      }
      userModel.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          req.flash("error", "No account with that E-mail exists. ");
          return res.redirect("/user/reset-password");
        }
        user.resetPasswordToken = token;
        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var smtTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "cuunhatnhat51@gmail.com",
          pass: "cnavmslaggcejjpi",
        },
      });
      var mailOptions = {
        from: "cuunhatnhat51@gmail.com",
        to: user.email,
        subject: "Account Activation Link from SolStore COSMETIC",
        text:
          "You are receiving this beacause you have requested the reset of the password for SolStore COSMETIC" +
          "\n\n" +
          "http://" +
          req.headers.host +
          "/user/reset-password/" +
          token +
          "\n\n" +
          "If you did not request this, please ignore this email",
      };
      smtTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.render(path.join(__dirname + "/src/views/emailSent.handlebars"), {
            layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
          });
        } else {
          req.flash("error", "Failed to send request to" + user.email);
          res.redirect("/user/reset-password");
        }
      });
    },
  ]);
});

const getResetPassword = asyncHandler(async (req, res) => {
  const user = await userModel.findOne({
    resetPasswordToken: req?.params?.token,
  });
  if (!user) {
    req.flash("error", "No account with that Email exists.");
    return res.redirect("/user/reset-password");
  }

  res.render(path.join(__dirname + "/src/views/change-password.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    csrfToken: req.csrfToken(),
    token: req.params.token,
  });
});

const handleUpdatePassword = asyncHandler(async (req, res) => {
  async.waterfall([
    function (done) {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   let messages = [];
      //   errors.errors.forEach((err) => messages.push(err.msg));
      //   return done(null, false);
      // }
      userModel.findOne(
        { resetPasswordToken: req.params.token },
        function (err, user) {
          if (!user) {
            req.flash(
              "error",
              "Password reset token is invalid or has expired. "
            );
            return res.redirect("back");
          }
          if (req.body.password === req.body.passwordConfirm) {
            user.password = user.encryptPassword(req.body.password);
            user.resetPasswordToken = undefined;
            user.save((err, resut) => {
              if (err) {
                return done(err);
              }
              return done(null, user);
            });
          } else {
            req.flash("error", "Passwords do not match!");
            return res.redirect("/resetpassword/" + req.params.token);
          }
        }
      );
    },
    function (user, done) {
      var smtTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "cuunhatnhat51@gmail.com",
          pass: "cnavmslaggcejjpi",
        },
      });
      var mailOptions = {
        from: "cuunhatnhat51@gmail.com",
        to: user.email,
        subject: "Your Password has been changed",
        text:
          "Hello,\n\n" +
          "This is a confirmation that the password for your account " +
          user.email +
          "has just been changed sucessfully",
      };
      smtTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          // return res.render('home',{csrfToken: req.csrfToken()});
          return res.redirect("/");
        } else {
          req.flash("error", "Failed to send request to" + user.email);
          return res.render("resetpassword");
        }
      });
    },
  ]);
});

export { getEmail, handleSendEmail, getResetPassword, handleUpdatePassword };
