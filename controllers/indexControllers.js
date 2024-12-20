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
  addPaintingToDbQuery,
  getPaintingByNameFromDb,
  updatePaintingInDb,
  updatePainterInDb,
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
    await res.render("pages/category", {
      category: category.name,
      paintings,
      title: category.name,
    });
  } else {
    next();
  }
}

async function getPaintingById(req, res, next) {
  try {
    const { id } = req.params;

    if (id == "edit") return next(); // when i go to edit the painting, i want the next middleware to take place.

    const paintings = await getAllPaintingsFromDb();

    const categories = await getAllCategoriesForPaintingByPaintingId(
      parseInt(id, 10)
    );

    const painting = paintings.filter((painting) => painting.id == id);
    await res.render("pages/painting", {
      painting: painting[0],
      categories,
      title: painting[0].name,
    });
  } catch (err) {
    next(err);
  }
}

async function getPainterById(req, res, next) {
  try {
    const { id } = req.params;
    if (id == "edit") return next();
    const painters = (await getAllPaintersFromDb()).rows;
    const painter = painters.filter((painter) => painter.id == id)[0];
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

async function createPaintingGet(req, res, next) {
  const painters = (await getAllPaintersFromDb()).rows;
  const categories = await getAllCategories();
  // console.log(categories);
  // console.log(painters);
  res.render("pages/createPainting", {
    title: "Add new painting",
    painters,
    categories,
  });
}

async function createPaintingPost(req, res, next) {
  try {
    const { name, year, image_url, description, painter_id, categories } =
      req.body;
    await addPaintingToDbQuery(
      name,
      year,
      image_url,
      description,
      painter_id,
      categories.map(Number)
    );
    return res.redirect("/paintings");
  } catch (err) {
    next(err);
  }
  // console.log(req.body /* .categories.map(Number) || [] */);
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

async function editPaintingGet(req, res, next) {
  const { name } = req.query;

  const painting = await getPaintingByNameFromDb(name);

  const AllCategories = await getAllCategories();

  const checkedCategories = await getAllCategoriesForPaintingByPaintingId(
    parseInt(painting[0].id)
  );

  const allpainters = (await getAllPaintersFromDb()).rows;

  res.render("pages/editpainting", {
    painters: allpainters,
    painting: painting[0],
    checkedCategories,
    categories: AllCategories,
    title: "edit " + name,
  });
}

async function editPaintingPost(req, res, next) {
  const { name, year, image_url, painter_id, description, id, categories } =
    req.body;

  await updatePaintingInDb(
    name,
    year,
    image_url,
    painter_id,
    description,
    categories.map(Number),
    Number(id)
  );

  res.redirect(`/paintings/${id}`);
  //build validation.
}

async function editPainterGet(req, res, next) {
  const { name } = req.query;
  const AllPainters = (await getAllPaintersFromDb()).rows;

  const painter = AllPainters.filter((artist) => artist.name == name);

  res.render("pages/editpainter", {
    title: painter[0].name,
    painter: painter[0],
  });
}

async function editPainterPost(req, res, next) {
  const { name, birth_year, death_year, image_url, description, painter_id } =
    req.body;
  await updatePainterInDb(
    name,
    birth_year,
    death_year,
    image_url,
    description,
    painter_id
  );

  res.redirect(`/painters/${painter_id}`);
  //build a query for updating painters table. (UPDATE painters ....)
}

module.exports = {
  getIndex,
  getAllPaintings,
  getAllPainters,
  getPaintingById,
  getPainterById,
  addPainterToDb,
  getPaintingsByCategory,
  createPaintingGet,
  createPaintingPost,
  editPaintingGet,
  editPaintingPost,
  editPainterPost,
  editPainterGet,
};
