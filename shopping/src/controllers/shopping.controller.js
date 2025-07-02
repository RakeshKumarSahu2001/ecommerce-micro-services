import ShoppingService from "../services/shopping.service.js";
import { publishToQueue } from "../services/rabbit.service.js";
import auth from "../middlewares/auth.middleware.js";

export default async (app) => {
  const shoppingService = new ShoppingService();

  app.post("/v1/add-to-cart", auth, async (req, res, next) => {
    try {
      const {productId,quantity} = req.body;
      const productAvailability = await publishToQueue(
        "PRODUCT_AVAILABILITY_CHECK",
        {productId,quantity}
      );
      console.log("productAvailability,",productAvailability)

      const isInsertedToCart=await shoppingService.addToCart({...productAvailability,quantity,customerId:req.user?.id});
console.log("isInsertedToCart",isInsertedToCart) 
      res.status(200).json({
        data:isInsertedToCart,
        success:true,
        message:"product is addded into the respective user's cart..."
      })
    } catch (error) {
      next(error);
    }
  });

  app.get("/v1/get-cart-product",auth,async(req,res,next)=>{
    try {
      const {id}=req.user;

      const allUserCartProducts=await shoppingService.fetchFromCart(id);
      res.status(200).json({
        success:true,
        message:"User's cart info fetched successfully...",
        data:allUserCartProducts
      })
    } catch (error) {
      next(error)
    }
  });

  app.delete("/v1/remove-from-cart/:id",auth,async(req,res,next)=>{
    try {
      const {id}=req.params;

      const removedProduct=await shoppingService.removeFromCart({id,customerId:req.user?.data?.id});
      
      res.status(200).json({
        success:true,
        message:"Successfully a product is removed from the cart...",
        data:removedProduct
      })
    } catch (error) {
      next(error);
    }
  })
};
