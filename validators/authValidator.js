import { body } from "express-validator";

export const signupValidation = [
  body("fullName")
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long"),
  
  body("email")
    .isEmail().withMessage("Invalid email address"),
  
  body("password")
    .isLength({ min: 5 }).withMessage("Password must be at least 5 characters long"),
  
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

export const loginValidation = [
  body("email")
    .isEmail().withMessage("Invalid email address"),
  
  body("password")
    .notEmpty().withMessage("Password is required"),
];
