import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../Middlewares/error.js";
import { Product } from "../Models/product.js";
import { newProductRequestBody } from "../Types/types.js";
import ErrorHandler from "../Utils/utilityClass.js";
import { rm } from "fs";

export const newProduct = tryCatch(
  async (
    req: Request<{}, {}, newProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, stock, category, price } = req.body;
    const photo = req.file;
    if (!photo) return next(new ErrorHandler("Please attach a photo", 400));

    if (!name || !stock || !category || !photo || !price) {
      rm(photo.path, () => {
        console.log("Deleted");
      });
      return next(new Error("Please add all fields!"));
    }
    await Product.create({
      name,
      price,
      stock,
      photo: photo?.path,
      category: category.toLowerCase(),
    });

    return res.status(201).json({
      success: true,
      message: `New Product ${name} has created successfully`,
    });
  }
);

export const getLatestProduct = tryCatch(async (req, res, next) => {
  const products = await Product.find({}).sort({ createdat: -1 }).limit(5);

  return res.status(200).json({
    success: true,
    products,
  });
});
