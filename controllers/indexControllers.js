// const { painters } = require("../db/mockDB"); // to be changed to Neon db.

const { validationResult } = require("express-validator");

const {
  getAllCategories,
  getAllPaintingsFromDb,
  getAllPaintersFromDb,
  getAllCategoriesForPaintingByPaintingId,
  addPainterToDbQuery,
  getPaintingsOfPainterQuery,
  getAllPaintingsByCategory,
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

async function getPaintingsByCategory(req, res, next) {
  const categories = await getAllCategories();
  const category = categories.find(
    (category) => category.name.replace(/\s/g, "") == req.params.category
  );
  const category_id = category ? category.id : null;
  if (category) {
    const paintings = await getAllPaintingsByCategory(category_id);
    await res.render("pages/category", { category: category.name, paintings });
  } else {
    next();
  }
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

async function getPainterById(req, res, next) {
  try {
    const { id } = req.params;
    const painters = await getAllPaintersFromDb();
    const painter = painters.rows[parseInt(id) - 1];
    const paintings = await getPaintingsOfPainterQuery(painter.name);
    await res.render("pages/painter", {
      title: painter.name,
      painter,
      paintings,
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
  getPainterById,
  addPainterToDb,
  getPaintingsByCategory,
};
