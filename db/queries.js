const pool = require("./pool");

// async function getAllPaintingsFromDb() {
//   const { rows } = await pool.query("SELECT * FROM paintings");
//   return rows;
// }

async function getAllPaintingsFromDb() {
  const { rows } = await pool.query(
    `SELECT paintings.id, paintings.name, paintings.year, paintings.image_url, paintings.description, painters.name AS painter_name
       FROM paintings
       INNER JOIN painters ON paintings.painter_id = painters.id`
  );
  return rows;
}

async function getAllCategoriesForPaintingByPaintingId(paintingId) {
  const { rows } = await pool.query(
    "SELECT c.name FROM categories AS c JOIN painting_categories AS pc ON c.id = pc.category_id WHERE pc.painting_id = ($1)",
    [paintingId]
  );
  return rows.map((row) => row.name);
}

// async function getPainterName(id) {
//   const { rows } = await pool.query(
//     "SELECT painters.name FROM painters INNER JOIN paintings ON paintings.painter_id = painters.id WHERE painters.id = ($1)",
//     [id]
//   );
//   return rows[0].name;
// }

module.exports = {
  getAllPaintingsFromDb,
  getAllCategoriesForPaintingByPaintingId,
  /*   getPainterName,
   */
};
