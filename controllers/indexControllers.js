const { painters } = require("../db/mockDB"); // to be changed to Neon db.

const {
  getAllPaintingsFromDb,
  getAllCategoriesForPaintingByPaintingId,
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
  await res.render("pages/allpainters", { painters, title: "All Painters" });
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
      title: paintings[id].painting_name,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getIndex,
  getAllPaintings,
  getAllPainters,
  getPaintingById,
};
