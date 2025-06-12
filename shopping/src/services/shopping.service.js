import ShoppingCrudOperation from "../database/repository/shopping.repository.js";

class ShoppingService{
    constructor(){
        this.repository=new ShoppingCrudOperation();
    }

    async addToCart(){
        try {
            
        } catch (error) {
            
        }
    }
}

export default ShoppingService;