const { painterValidation } = require("../controllers/validators");

const {
  getIndex,
  getAllPaintings,
  getAllPainters,
  getPaintingById,
  addPainterToDb,
  getPainterById,
  getPaintingsByCategory,
} = require("../controllers/indexControllers");

const express = require("express");

const indexRouter = express.Router();

indexRouter.get("/", getIndex);
indexRouter.get("/paintings", getAllPaintings);
indexRouter.get("/painters", getAllPainters);
indexRouter.get("/paintings/:category", getPaintingsByCategory);
indexRouter.get("/paintings/:id", getPaintingById);
indexRouter.get("/painters/:id", getPainterById);

indexRouter.get("/createpainter", (req, res, next) => {
  res.render("pages/createpainter", { title: "add new painter" });
});

indexRouter.post("/createpainter", painterValidation, addPainterToDb);

module.exports = {
  indexRouter,
};
