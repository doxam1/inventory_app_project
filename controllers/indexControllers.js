const { paintings, painters } = require("../db/mockDB");
function getIndex(req, res, next) {
  res.render("pages/index", { title: "Virtual Museum" });
}

async function getAllPaintings(req, res, next) {
  await res.render("pages/allpaintings", { paintings, title: "All Paintings" });
}

async function getAllPainters(req, res, next) {
  await res.render("pages/allpainters", { painters, title: "All Painters" });
}

async function getPaintingById(req, res, next) {
  const { id } = req.params;
  const painting = paintings[id];
  await res.render("pages/painting", {
    painting,
    title: paintings[id].painting_name,
  });
}

module.exports = {
  getIndex,
  getAllPaintings,
  getAllPainters,
  getPaintingById,
};
