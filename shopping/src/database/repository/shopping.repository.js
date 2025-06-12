import ApiError from "../../utils/ApiError.js";
import prisma from "../Connection.js";

class ShoppingCrudOperation {
  async addNewItem(userInput) {
    try {
      const { customerId, productId, quantity } = userInput;
      console.log("userInput :",userInput);
      const isItemAddedIntoCart = await prisma.cart.create({
        data: {
            customerId,
            productId,
            quantity
        },
      });

      return isItemAddedIntoCart;
    } catch (error) {
      throw new ApiError(
        401,
        "Error occured while inserting the product into the cart...",
        "Error occured while inserting the product into the cart..."
      );
    }
  }
}

export default ShoppingCrudOperation;
