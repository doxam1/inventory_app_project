const { body } = require("express-validator");

const painterValidation = [
  body("name")
    .notEmpty()
    .withMessage("please enter a name.")
    .trim()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name field must contain only letters."),

  body("birth_year")
    .notEmpty()
    .withMessage("please enter birth year.")
    .trim()
    .isInt({ gt: 0 })
    .withMessage("birth year must be a valid positive integer."),

  body("death_year")
    .notEmpty()
    .withMessage("please enter death year.")
    .trim()
    .isInt()
    .withMessage("death year must be a valid positive integer."),

  // Custom validation: death_year must be greater than birth_year if both exist
  body("death_year").custom((value, { req }) => {
    if (value && req.body.birth_year && value <= req.body.birth_year) {
      throw new Error("Death year must be greater than birth year");
    }
    return true;
  }),

  body("image_url")
    .notEmpty()
    .withMessage("please enter an image URL address.")
    .trim()
    .isURL()
    .withMessage("please enter a valid URL for the image."),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot be longer than 500 characters"),
];

module.exports = {
  painterValidation,
};
