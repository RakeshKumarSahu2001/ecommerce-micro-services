export default async(app)=>{
    app.get("/",(req,res)=>{
        res.send("hello from products");
    })
}