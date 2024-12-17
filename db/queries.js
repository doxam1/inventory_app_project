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

async function getAllPaintersFromDb() {
  const { rows } = await pool.query("SELECT * FROM painters");
  return { rows };
}

async function getAllCategoriesForPaintingByPaintingId(paintingId) {
  const { rows } = await pool.query(
    "SELECT c.name FROM categories AS c JOIN painting_categories AS pc ON c.id = pc.category_id WHERE pc.painting_id = ($1)",
    [paintingId]
  );
  return rows.map((row) => row.name);
}

async function addPainterToDbQuery(
  name,
  birth_year,
  death_year,
  image_url,
  description
) {
  return await pool.query(
    "INSERT INTO painters (name, birth_year, death_year, image_url, description) VALUES ($1, $2, $3, $4, $5)",
    [name, birth_year, death_year, image_url, description]
  );
}

async function getPaintingsOfPainterQuery(painterName) {
  const { rows } = await pool.query(
    "SELECT paintings.name, paintings.year, paintings.image_url FROM paintings JOIN painters ON paintings.painter_id = painters.id WHERE painters.name = ($1)",
    [painterName]
  );
  return rows;
}

async function getAllCategories() {
  const { rows } = await pool.query("SELECT name, id FROM categories");
  return rows;
}

async function getAllPaintingsByCategory(category_id) {
  const { rows } = await pool.query(
    "SELECT paintings.name, paintings.year, paintings.image_url FROM paintings JOIN painting_categories AS pc ON paintings.id = pc.painting_id WHERE pc.category_id = ($1)",
    [category_id]
  );
  // console.log(rows);
  return rows;
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
  getAllPaintersFromDb,
  getAllCategoriesForPaintingByPaintingId,
  addPainterToDbQuery,
  getPaintingsOfPainterQuery,
  getAllCategories,
  getAllPaintingsByCategory,
  /*   getPainterName,
   */
};
