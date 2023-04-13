import express from "express";
import connect from "./config/db/connectdb.js";
import * as dotenv from "dotenv";
import { create } from "express-handlebars";
import path from "path";
import logger from "morgan";
import route from "./routes/index.js";
import passport from "passport";
import MongoStore from "connect-mongo";
import session from "express-session";
import bodyParser from "body-parser";
import flash from "connect-flash";
import validator from "express-validator";
import cookieParser from "cookie-parser";
import methodOverride from "method-override"
import csurf from "csurf";
import { Cart } from "./app/models/cartModel.js";
import Handlebars from 'handlebars'

import "./config/passport.js";

dotenv.config();
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(flash());
app.use(validator());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

const __dirname = path.resolve();

// static files
app.use(express.static(path.join(__dirname + "/public/")));
const hbs = create({
  defaultLayout: "./views/layout",
  partialsDir: { dir: path.join(__dirname + "/src/views/partials") },
  extname: ".handlebars",
  helpers: {
    sum: (a, b) => a + b,
  }
});

app.engine(".handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(logger("dev"));

connect();

app.use(
  session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


// test UI

//contact
app.use("/pages/contact", (req, res) => {
  res.render(path.join(__dirname + "/src/views/contact.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

app.use("/session", (req, res) => {
  res.render(path.join(__dirname + "/src/views/session.handlebars"), {
    session: req.session.toString(),
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  })
})

// stat for admin
app.use("/admin/stat", (req, res) => {
  res.render(path.join(__dirname + "/src/views/chart.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

// add dashboard
app.use("/admin/dashboard", (req, res) => {
  res.render(path.join(__dirname + "/src/views/dashboard.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
  });
});


//add analytics admin
// app.use("/admin/analytics", (req, res) => {
//   res.render(path.join(__dirname + "/src/views/analytics.handlebars"), {
//     layout: path.join(__dirname + "/src/views/layout/admin-sidebar.handlebars"),
//   });
// });

// checkout
app.use("/pages/checkout", (req, res) => {
  res.render(path.join(__dirname + "/src/views/checkout.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

// index
app.use("/home", (req, res) => {
  res.render(path.join(__dirname + "/src/views/home.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

//account
app.use("/pages/account", (req, res) => {
  res.render(path.join(__dirname + "/src/views/account.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

// cart
app.use("/pages/cart", (req, res) => {
  if (!req.session.cart) {
    return res.render(path.join(__dirname + "/src/views/cart.handlebars"), {
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
      products: null,
    });
  }

  let cart = new Cart(req.session.cart);
  res.render(path.join(__dirname + "/src/views/cart.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});
//wishlist
app.use("/pages/wishlist", (req, res) => {
  res.render(path.join(__dirname + "/src/views/wishlist.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

// about
app.use("/about", (req, res) => {
  res.render(path.join(__dirname + "/src/views/about.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

// thankyou
app.use("/thank-you", (req, res) => {
  res.render(path.join(__dirname + "/src/views/thank-you.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

route(app);

// home page
app.use("/", (req, res) => {
  res.render(path.join(__dirname + "/src/views/home.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
  });
});

app.use("/js", express.static(__dirname + "/src/public/js"));
app.use(
  "/css",
  express.static(path.join(__dirname + "/src/public/css/index.css"))
);

// app.listen(process.env.PORT, () => {
//   console.log(`Example app listening on port ${process.env.PORT}`);
// });

// Handlebars.registerHelper("xif", function (expression, options) {
//   return Handlebars.helpers["x"].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
// });

export default app;
