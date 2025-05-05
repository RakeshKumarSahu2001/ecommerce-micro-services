export default async (app) => {
  app.get("/", (req, res) => {
    console.log("*********************");
    res.send("hello from shoppings");
  });
};
