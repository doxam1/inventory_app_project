const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

const { indexRouter } = require("./routes/indexRouter");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

app.use("/", indexRouter);

app.use((req, res, next) => {
  res
    .status(404)
    .render("pages/error", { err: "Path not found", title: "OOPS..." });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .render("pages/error", { err: "Something broke!", title: "OOPS..." });
});

app.listen(PORT, () => console.log(`app on port ${PORT}`));
