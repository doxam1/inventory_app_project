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
  editPainterPost,
  editPainterGet,
} = require("../controllers/indexControllers");

const express = require("express");

const indexRouter = express.Router();

indexRouter.get("/log-in", (req, res, next) => {
  res.render("pages/log-in", { title: "Log in" });
});

indexRouter.get("/", getIndex);
indexRouter.get("/paintings", getAllPaintings);
indexRouter.get("/painters", getAllPainters);
indexRouter.get("/paintings/:category", getPaintingsByCategory);
indexRouter.get("/paintings/:id", getPaintingById);
indexRouter.get("/painters/:id", getPainterById);

indexRouter.get("/createpainter", (req, res, next) => {
  res.render("pages/createpainter", {
    title: "Add new painter",
    user: req.user,
  });
});

indexRouter.get("/createpainting", createPaintingGet);

indexRouter.post("/createpainter", painterValidation, addPainterToDb);
indexRouter.post("/createpainting", createPaintingPost);

indexRouter.get("/paintings/edit", editPaintingGet);
indexRouter.post("/paintings/edit", editPaintingPost);

indexRouter.get("/painters/edit", editPainterGet);
indexRouter.post("/painters/edit", editPainterPost);

module.exports = {
  indexRouter,
};
