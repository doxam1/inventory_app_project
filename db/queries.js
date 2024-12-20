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

async function addPaintingToDbQuery(
  name,
  year,
  image_url,
  description,
  painter_id,
  categories
) {
  await pool.query(
    "INSERT INTO paintings (name, year, image_url, description, painter_id) VALUES ($1, $2, $3, $4, $5)",
    [name, year, image_url, description, painter_id]
  );
  for (const category of categories) {
    // Get the painting ID
    const result = await pool.query(
      "SELECT id FROM paintings WHERE name = ($1)",
      [name]
    );
    const paintingId = result.rows[0].id;

    // Insert into painting_categories
    await pool.query(
      "INSERT INTO painting_categories (painting_id, category_id) VALUES ($1, $2)",
      [paintingId, category]
    );
  }

  return;
}
async function getPaintingsOfPainterQuery(painterName) {
  const { rows } = await pool.query(
    "SELECT paintings.name, paintings.year, paintings.image_url, paintings.id FROM paintings JOIN painters ON paintings.painter_id = painters.id WHERE painters.name = ($1)",
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
    "SELECT paintings.name, paintings.year, paintings.image_url, paintings.id FROM paintings JOIN painting_categories AS pc ON paintings.id = pc.painting_id WHERE pc.category_id = ($1)",
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
async function getPaintingByNameFromDb(name) {
  const { rows } = await pool.query("SELECT * FROM paintings WHERE NAME = $1", [
    name,
  ]);
  return rows;
}

async function updatePaintingInDb(
  name,
  year,
  image_url,
  painter_id,
  description,
  categories,
  id
) {
  await pool.query(
    "UPDATE paintings SET name=$1, year=$2, image_url=$3, painter_id=$4, description=$5 WHERE paintings.id = $6",
    [name, year, image_url, painter_id, description, id]
  );

  // // Get the painting ID
  // const result = await pool.query(
  //   "SELECT id FROM paintings WHERE name = ($1)",
  //   [name]
  // );

  // const paintingId = await result.rows[0].id;

  // remove old rows from painting_categories
  await pool.query("DELETE FROM painting_categories WHERE painting_id = $1", [
    id,
  ]);

  for (const category of categories) {
    // Insert into painting_categories
    await pool.query(
      "INSERT INTO painting_categories (painting_id, category_id) VALUES ($1, $2)",
      [id, category]
    );
  }
}

//chatgpt solution:
// async function updatePaintingInDb(
//   name,
//   year,
//   image_url,
//   painter_id,
//   description,
//   categories,
//   id
// ) {
//   const paintingId = Number(id);
//   console.log(id);
//   // Validate id and categories
//   if (!paintingId || isNaN(paintingId)) {
//     throw new Error("Invalid painting ID");
//   }
//   if (
//     !Array.isArray(categories) ||
//     categories.some((cat) => isNaN(Number(cat)))
//   ) {
//     throw new Error("Invalid categories");
//   }

//   // Begin transaction
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     // Update the painting
//     await client.query(
//       "UPDATE paintings SET name=$1, year=$2, image_url=$3, painter_id=$4, description=$5 WHERE id=$6",
//       [name, year, image_url, painter_id, description, id]
//     );

//     // Delete old rows from painting_categories
//     await client.query(
//       "DELETE FROM painting_categories WHERE painting_id = $1",
//       [id]
//     );

//     // Insert new categories
//     const insertCategoryQuery =
//       "INSERT INTO painting_categories (painting_id, category_id) VALUES ($1, $2)";
//     for (const category of categories.map(Number)) {
//       await client.query(insertCategoryQuery, [id, category]);
//     }

//     await client.query("COMMIT");
//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// }

async function updatePainterInDb(
  name,
  birth_year,
  death_year,
  image_url,
  description,
  painter_id
) {
  return await pool.query(
    "UPDATE painters SET name=$1, birth_year=$2, death_year=$3, image_url=$4, description=$5 WHERE painters.id = $6",
    [name, birth_year, death_year, image_url, description, painter_id]
  );
}
module.exports = {
  getAllPaintingsFromDb,
  getAllPaintersFromDb,
  getAllCategoriesForPaintingByPaintingId,
  addPainterToDbQuery,
  getPaintingsOfPainterQuery,
  getAllCategories,
  getAllPaintingsByCategory,
  addPaintingToDbQuery,
  getPaintingByNameFromDb,
  updatePaintingInDb,
  updatePainterInDb,
  /*   getPainterName,
   */
};
