import ApiError from "../../utils/ApiError.js";
import prisma from "../Connection.js";

class ShoppingCrudOperation {
  async addNewItem(userInput) {
    try {
      const {
        customerId,
        productId,
        quantity,
        name,
        description,
        thumbnailImage,
        price,
      } = userInput;

      const product = await prisma.product.upsert({
        where: { id: productId },
        update: {},
        create: {
          id: productId,
          name,
          description,
          thumbnailImage,
          price,
          units: quantity,
        },
      });

      let cart = await prisma.cart.findFirst({
        where: { customerId },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { customerId },
        });
      }

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: productId,
        },
      });

      let updatedCartItem;

      if (existingItem) {
        updatedCartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { unit: existingItem.unit + quantity },
        });
      } else {
        updatedCartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            unit: quantity,
          },
        });
      }

      return updatedCartItem;
    } catch (error) {
      throw new ApiError(
        405,
        "Error occured while inserting the product into the cart...",
        "Error occured while inserting the product into the cart..."
      );
    }
  }

  async getCartItems(userInput) {
    try {
      const { id } = userInput;
      const cartProducts = await prisma.cart.findMany({
        where: {
          customerId: id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return cartProducts;
    } catch (error) {
      throw new ApiError();
    }
  }

  async removeCartItem(userInput){
    try {
      const {id,customerId}=userInput;
      const removedProduct=await prisma.cartItem.deleteMany({
        where:{
          id:id,
          cart:{
            customerId
          }
        }
      })

      return removedProduct;
    } catch (error) {
      throw new ApiError(
        404,
        "Product is not present in the cart...",
        error
      )
    }
  }
}

export default ShoppingCrudOperation;
