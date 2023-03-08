import express from "express";
import connect from "./config/db/connectdb.js";
import * as dotenv from "dotenv";
import { create } from "express-handlebars";
import path from "path";
import logger from "morgan";
import route from "./routes/index.js";

dotenv.config();
const app = express();

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

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
app.use(express.static(path.join(__dirname + '/public/')));
const hbs = create({ defaultLayout: "./views/layout", partialsDir: {dir: path.join(__dirname + "/src/views/partials")}, extname: ".handlebars" });

app.engine(".handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(logger("dev"));

connect();

// test UI

//contact
app.use("/pages/contact", (req, res) => {
  res.render(path.join(__dirname + "/src/views/contact.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars")
  });
});

// form-product
app.use("/form/product", (req, res) => {
  res.render(path.join(__dirname + "/src/views/form-product.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars")
  });
});

// form-blog
app.use("/form/blog", (req, res) => {
  res.render(path.join(__dirname + "/src/views/form-blog.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars")
  });
});

// checkout
app.use("/checkout", (req, res) => {
  res.render(path.join(__dirname + "/src/views/checkout.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars")
  });
});

// index
app.use("/index", (req, res) => {
  res.render(path.join(__dirname + "/src/views/index.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars")
  });
});

// shop
app.use("/shop", (req, res) => {
  res.render(path.join(__dirname + "/src/views/shop.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars")
  });
});

// thankyou
app.use("/thank-you", (req, res) => {
  res.render(path.join(__dirname + "/src/views/thank-you.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars")
  });
});


// home page
app.use("/", (req, res) => {
  res.render(path.join(__dirname + "/src/views/home.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars")
  });
});




route(app)



app.use("/js", express.static(__dirname + "/src/public/js"));
app.use("/css", express.static(path.join(__dirname + "/src/public/css/index.css")));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

