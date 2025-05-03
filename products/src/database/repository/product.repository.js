import { Prisma } from "@prisma/client";
import uploadOnCloudinary from "../../services/cloudinary.service.js";
import ApiError from "../../utils/ApiError.js";
import prisma from "../Connection.js";

class productCrudOperation {
  async insertNewProduct(userInput) {
    try {
      const {
        productName,
        rating,
        price,
        discount,
        stockQuantity,
        brand,
        category,
        description,
        thumbNailImageLocation,
        imagesLocation,
      } = userInput;

      const thumbnailImage = await uploadOnCloudinary(thumbNailImageLocation);
      const images = Array.isArray(imagesLocation)
        ? await Promise.all(
            imagesLocation.map(async (img) => {
              const result = await uploadOnCloudinary(img);
              return result.secure_url;
            })
          )
        : [];

      const isInserted = await prisma.goods.create({
        data: {
          productName: productName,
          description: description,
          rating: new Prisma.Decimal(rating),
          price: new Prisma.Decimal(price),
          category: category,
          discount: new Prisma.Decimal(discount),
          stockQuantity: Number(stockQuantity),
          brand: brand,
          thumbnailImage: thumbnailImage.secure_url,
          images: images,
        },
        select: {
          id: true,
        },
      });

      return isInserted;
    } catch (error) {
      throw new ApiError(500, "Product data insertion error...", error);
    }
  }

  async getProducts() {
    try {
      const products = await prisma.goods.findMany({
        select: {
          id: true,
          productName: true,
          description: true,
          rating: true,
          price: true,
          category: true,
          discount: true,
          stockQuantity: true,
          brand: true,
          thumbnailImage: true,
          images: true,
        },
      });

      return products;
    } catch (error) {
      throw new ApiError(404, "No records found...", error);
    }
  }

  async getProduct(id) {
    try {
      const product = await prisma.goods.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          productName: true,
          description: true,
          rating: true,
          price: true,
          category: true,
          discount: true,
          stockQuantity: true,
          brand: true,
          thumbnailImage: true,
          images: true,
        },
      });

      return product;
    } catch (error) {
      throw new ApiError(404, "Product record not found...", error);
    }
  }

  async deleteProduct(id) {
    try {
      const isDeleted = await prisma.goods.delete({
        where: {
          id,
        },
        select: {
          id: true,
          productName: true,
        },
      });

      return isDeleted;
    } catch (error) {
      throw new ApiError(
        404,
        "you cant delete the product because it doesn't exist...",
        error
      );
    }
  }

  async updateProduct(userInput) {
    try {
      const {
        id,
        productName,
        rating,
        price,
        discount,
        stockQuantity,
        brand,
        category,
        description,
      } = userInput;

      const updatedProduct = await prisma.goods.update({
        where: {
          id,
        },
        data: {
          productName,
          rating:new Prisma.Decimal(rating),
          price:new Prisma.Decimal(price),
          discount:new Prisma.Decimal(discount),
          stockQuantity,
          brand,
          category,
          description,
        },
      });

      return updatedProduct;
    } catch (error) {
      throw new ApiError(404, "Product record updatation error...", error);
    }
  }

  async getFilterProperties(){
    try {
      const brands=await prisma.goods.findMany({ distinct: ['brand',"category"],
        select: {
          brand: true,
          category:true,
        }
      });

      return brands;
    } catch (error) {
      throw new ApiError(404,"Error occured during fetching all the brands",error);
    }
  }
}

export default productCrudOperation;
