const { check } = require("express-validator");

const validation = {
  create: [
    check("fullName").isLength({ min: 7 }),
    check("phoneNumber").isLength({ min: 10 }),
  ],
};

module.exports = validation;
