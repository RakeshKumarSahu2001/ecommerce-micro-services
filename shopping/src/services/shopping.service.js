import ShoppingCrudOperation from "../database/repository/shopping.repository.js";
import ApiError from "../utils/ApiError.js";

class ShoppingService {
  constructor() {
    this.repository = new ShoppingCrudOperation();
  }

  async addToCart(userInput) {
    try {
        if(!userInput?.exists){
            throw new ApiError(404,"Product is not available...","Out of Stock...");
        }
        const insertTocart=await this.repository.addNewItem(userInput);
        
        return insertTocart;
    } catch (error) {
      throw new ApiError(
        404,
        "Product information required to insert into cart...",
        "Product information required to insert into cart..."
      );
    }
  }

  async fetchFromCart(id){
    try {
      if(!id){
        throw new ApiError(401,
          "User id is required to fetch the user cart information",
          "User id is required to fetch the user cart information"
        );
      }

      const cartInfo=await this.repository.getCartItems(id);
      return cartInfo;
    } catch (error) {
      throw new ApiError(
        400,
        "No cart record found...",
        "No cart record found...",
      )
    }
  }

  async removeFromCart(userInput){
    try {
      const {id,customerId}=userInput;
      if(!id || !customerId){
        throw new ApiError(401,
          "Information required to remove product from the cart...",
          "Information required to remove product from the cart..."
        )
      }
      const removedCartItem=await this.repository.removeCartItem(userInput);
      return removedCartItem;
    } catch (error) {
      throw new ApiError(
        404,
        "Product is not found in the user's Cart...",
        "Product is not found in the user's Cart..."
      )
    }
  }
}

export default ShoppingService;
