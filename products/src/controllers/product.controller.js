import { upload } from "../middlewares/multer.middleware.js";
import ProductServices from "../services/product.service.js";
import ApiError from "../utils/ApiError.js";
import auth from "../middlewares/auth.middleware.js";
import { subscribeToQueue } from "../services/rabbit.service.js";

export default async (app) => {
  const productServices = new ProductServices();

  //get all products
  app.get("/v1/get-all-product", auth, async (req, res, next) => {
    try {
      const products = await productServices.getAllProduct();

      res.status(200).json({
        success: true,
        message: "All product record fetched successfully.",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  });

  //select specific product
  app.get("/v1/get-product/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await productServices.getProduct(id);

      res.status(200).json({
        success: true,
        message: "Product information fetched successfully...",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  });

  //insert new product
  app.post(
    "/v1/add-new-product",
    upload.fields([
      {
        name: "thumbNailImage",
        maxCount: 1,
      },
      {
        name: "images",
        maxCount: 3,
      },
    ]),
    async (req, res, next) => {
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
        } = req.body;

        const thumbNailImageLocation = req.files?.thumbNailImage[0]?.path;
        const imagesLocation = req.files?.images?.map((img) => img.path);

        if (
          !productName ||
          !rating ||
          !price ||
          !discount ||
          !stockQuantity ||
          !brand ||
          !category ||
          !description ||
          !thumbNailImageLocation ||
          !imagesLocation
        ) {
          throw new ApiError(
            404,
            "Missing product information...",
            "Missing product information..."
          );
        }

        const insertedNewProduct = await productServices.addNewProduct({
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
        });

        res.status(201).json({
          success: true,
          message: "New Product added successfully.",
          data: insertedNewProduct,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  //update specific product information
  app.put("/v1/update-product/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        productName,
        rating,
        price,
        discount,
        stockQuantity,
        brand,
        category,
        description,
      } = req.body;

      if (
        !id ||
        !productName ||
        !rating ||
        !price ||
        !discount ||
        !stockQuantity ||
        !brand ||
        !category ||
        !description
      ) {
        throw new ApiError(
          404,
          "Missing product information...",
          "Missing product information..."
        );
      }

      const updatedProduct = await productServices.updateProduct({
        id,
        productName,
        rating,
        price,
        discount,
        stockQuantity,
        brand,
        category,
        description,
      });

      res.status(200).json({
        success: true,
        message: "Produxt information updated successfully.",
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  });

  //delete specific product
  app.delete("/v1/delete-product/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const isDeleted = await productServices.deleteProduct(id);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
        data: isDeleted,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/v1/filter-props", async (req, res, next) => {
    try {
      const brands = await productServices.getFilterProperties();

      res.status(200).json({
        success: true,
        message: "Brand information fetched successfully from the db...",
        data: brands,
      });
    } catch (error) {
      next(error);
    }
  });

  //check product is available or not for adding product into the cart
  subscribeToQueue("PRODUCT_AVAILABILITY_CHECK", async (data, msg,channel) => {
    const { productId, quantity } = JSON.parse(data);
    const productInfo = await productServices.getProduct(productId);
    const isProductAvailable =
      productInfo && productInfo?.stockQuantity > quantity;
    console.log(isProductAvailable, "isProductAvailable");
    channel.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(JSON.stringify({ exists: isProductAvailable, productId })),
      {
        correlationId: msg.properties.correlationId,
      }
    );

    channel.ack(msg);
  });
};
