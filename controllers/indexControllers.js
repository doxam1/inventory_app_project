// const { painters } = require("../db/mockDB"); // to be changed to Neon db.

const { validationResult } = require("express-validator");

const {
  getAllPaintingsFromDb,
  getAllPaintersFromDb,
  getAllCategoriesForPaintingByPaintingId,
  addPainterToDbQuery,
  getPainterName,
} = require("../db/queries");

async function getIndex(req, res, next) {
  res.render("pages/index", { title: "Virtual Museum" });
}

async function getAllPaintings(req, res, next) {
  const paintings = await getAllPaintingsFromDb();
  res.render("pages/allpaintings", { paintings, title: "All Paintings" });
}

async function getAllPainters(req, res, next) {
  const painters = await getAllPaintersFromDb();
  await res.render("pages/allpainters", {
    painters: painters.rows,
    title: "All Painters",
  });
}

async function getPaintingById(req, res, next) {
  try {
    const { id } = req.params;
    const paintings = await getAllPaintingsFromDb();

    // i'm adding 1, because the paintings array starts from 0 and the id in the DB starts from 1.
    const categories = await getAllCategoriesForPaintingByPaintingId(
      parseInt(id, 10) + 1
    );

    const painting = paintings[id];
    await res.render("pages/painting", {
      painting,
      categories,
      title: paintings[id].name,
    });
  } catch (err) {
    next(err);
  }
}

async function addPainterToDb(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("pages/createpainter", {
        title: "Add New Painter",
        values: req.body,
        errors: errors.array(),
      });
    }
    const { name, birth_year, death_year, image_url, description } = req.body;
    await addPainterToDbQuery(
      name,
      birth_year,
      death_year,
      image_url,
      description
    );
    return res.redirect("/painters");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getIndex,
  getAllPaintings,
  getAllPainters,
  getPaintingById,
  addPainterToDb,
};
