import productCrudOperation from "../database/repository/product.repository.js";
import ApiError from "../utils/ApiError.js";

class ProductServices {
  constructor() {
    this.repository = new productCrudOperation();
  }

  async addNewProduct(userInput) {
    try {
      const insertionResult = await this.repository.insertNewProduct(userInput);

      return insertionResult;
    } catch (error) {
      throw new ApiError(404, "Data not found...", error);
    }
  }

  async getAllProduct() {
    try {
      const products = await this.repository.getProducts();
      console.log("products :", products);
      return products;
    } catch (error) {
      throw new ApiError(404, "Products record not found...", error);
    }
  }

  async getProduct(id) {
    try {
      const product = await this.repository.getProduct(id);
      return product;
    } catch (error) {
      throw new ApiError(401, "Product id is not given...", error);
    }
  }

  async deleteProduct(id) {
    try {
      const isDeleted = this.repository.deleteProduct(id);

      console.log("is deleted :", isDeleted);
      return isDeleted;
    } catch (error) {
      throw new ApiError(
        401,
        "The id of the product is required to delete it...",
        error
      );
    }
  }
}

export default ProductServices;
