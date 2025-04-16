class isAdmin {
    constructor() {
        this.isAllow = sessionStorage.getItem("Role")
    }
    get access() {
        return this.isAllow==="admin";
    }
}

export default isAdmin;