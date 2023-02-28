import morgan from "morgan";
import express from "express";
import connect from "./config/db/connectdb.js";
import * as dotenv from "dotenv";
import { create } from "express-handlebars";
import path from "path";
import logger from "morgan";

dotenv.config();
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(morgan("combined"));

const __dirname = path.resolve();

// static files
app.use(express.static(path.join(__dirname + '/public/')));
const hbs = create({ defaultLayout: "./views/layout", partialsDir: {dir: path.join(__dirname + "/src/views/partials")}, extname: ".handlebars" });

app.engine(".handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(logger("dev"));

connect();

app.use("/", (req, res) => {
  res.render(path.join(__dirname + "/src/views/home.handlebars"), {
    layout: path.join(__dirname + "/src/views/layout/main.handlebars")
  });
});

app.use("/js", express.static(__dirname + "/src/public/js"));
app.use("/css", express.static(path.join(__dirname + "/src/public/css/index.css")));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
