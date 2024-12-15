const {
  getIndex,
  getAllPaintings,
  getAllPainters,
  getPaintingById,
} = require("../controllers/indexControllers");

const express = require("express");

const indexRouter = express.Router();

indexRouter.get("/", getIndex);
indexRouter.get("/paintings", getAllPaintings);
indexRouter.get("/painters", getAllPainters);
indexRouter.get("/paintings/:id", getPaintingById);

module.exports = {
  indexRouter,
};
