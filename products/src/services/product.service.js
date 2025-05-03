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
      const isDeleted = await this.repository.deleteProduct(id);

      return isDeleted;
    } catch (error) {
      throw new ApiError(
        401,
        "The id of the product is required to delete it...",
        error
      );
    }
  }

  async updateProduct(userInput) {
    try {
      const { id } = userInput;

      const isProductExist = await this.repository.getProduct(id);

      if (!isProductExist) {
        throw new ApiError(
          404,
          "Product doesn't exist in the DB...",
          "Product doesn't exist in the DB..."
        );
      }

      const updatedProduct = await this.repository.updateProduct(userInput);

      return updatedProduct;
    } catch (error) {
      throw new ApiError(404, "Product Information not found...", error);
    }
  }

  async getFilterProperties() {
    try {
      const brands = await this.repository.getFilterProperties();
      if (!brands) {
        throw new ApiError(
          404,
          "got error while fetching the brands records from the db...",
          "got error while fetching the brands records from the db..."
        );
      }
      return brands;
    } catch (error) {
      throw new ApiError();
    }
  }
}

export default ProductServices;
