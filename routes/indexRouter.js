const { painterValidation } = require("../controllers/validators");

const {
  getIndex,
  getAllPaintings,
  getAllPainters,
  getPaintingById,
  addPainterToDb,
  getPainterById,
  getPaintingsByCategory,
  createPaintingGet,
  createPaintingPost,
  editPaintingGet,
  editPaintingPost,
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
  res.render("pages/createpainter", { title: "Add new painter" });
});

indexRouter.get("/createpainting", createPaintingGet);

indexRouter.post("/createpainter", painterValidation, addPainterToDb);
indexRouter.post("/createpainting", createPaintingPost);

indexRouter.get("/paintings/edit", editPaintingGet);
indexRouter.post("/paintings/edit", editPaintingPost);

module.exports = {
  indexRouter,
};
