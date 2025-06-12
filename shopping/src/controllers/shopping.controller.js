import ShoppingService from "../services/shopping.service.js";
import { publishToQueue } from "../services/rabbit.service.js";
import auth from "../middlewares/auth.middleware.js";

export default async (app) => {
  const shoppingService = new ShoppingService();

  app.post("/v1/add-to-cart", auth, async (req, res, next) => {
    try {
      const body = req.body;
      // publishToQueue("new-product-added-into-user-cart",JSON.stringify(body));
      const productAvailability = await publishToQueue(
        "PRODUCT_AVAILABILITY_CHECK",
        body
      );
      console.log("productAvailability", productAvailability);
      res.status(200).send("hello from shoppings");
    } catch (error) {
      next(error);
    }
  });
};
