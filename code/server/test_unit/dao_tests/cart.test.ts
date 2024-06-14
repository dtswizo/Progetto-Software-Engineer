import { test, expect, jest } from "@jest/globals"
import CartDAO from "../../src/dao/cartDAO"
import { Role, User } from "../../src/components/user";
import {Cart, ProductInCart} from "../../src/components/cart";
import { Category, Product } from "../../src/components/product";
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../../src/errors/productError";
import { CartNotFoundError, EmptyCartError, ProductNotInCartError } from "../../src/errors/cartError";
import db from "../../src/db/db"
import { Database } from "sqlite3"
//import '@types/jest';

//jest.mock("../../src/db/db.ts");


/* *************************** FUNZIONE checkIfCartExists ****************************** */

describe("UCD 1 checkIfCartExists", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    
    test("UCD 1.1 correct checkIfCartExists DAO", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null, new Cart("test",false,"",0,[]));
            return ({} as Database);
        });
        
        await expect(cartDAO.checkIfCartExists(testUser)).resolves.toBe(true);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 1.2 checkIfCartExists DAO: cart not exist", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkIfCartExists(testUser)).resolves.toBe(false);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 1.3 checkIfCartExists DAO:generic DB error", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkIfCartExists(testUser)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });
});


/* *************************** FUNZIONE checkIfProductExists ****************************** */

describe("UCD 2 checkIfProductExists", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 2.1 correct checkIfProductExists DAO", async () => {
        let model="test"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null, new Product(10,model,Category.APPLIANCE,"","",0));
            return ({} as Database);
        });
        
        await expect(cartDAO.checkIfProductExists(model)).resolves.toBe(true);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 2.2 checkIfProductExists DAO: product not exist", async () => {
        let model="test"
        let diff_model="test1"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null, new Product(10,diff_model,Category.APPLIANCE,"","",0));
            return ({} as Database);
        });
        
        await expect(cartDAO.checkIfProductExists(model)).resolves.toBe(false);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 2.2 checkIfProductExists DAO: product not exist V2", async () => {
        let model="test"
        let diff_model="test1"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkIfProductExists(model)).resolves.toBe(false);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test(" UCD 2.3 checkIfProductExists DAO:generic DB error", async () => {
        let model="test"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkIfProductExists(model)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });
});

/* *************************** FUNZIONE checkIfProductExistsInCart ****************************** */

describe("UCD 3 checkIfProductExistsInCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    
    test("UCD 3.1correct checkIfProductExistsInCart DAO", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let model="test"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null, new Cart("test", false, "", 0, [new ProductInCart(model,1,Category.APPLIANCE,10)]));
            return ({} as Database);
        });
        
        await expect(cartDAO.checkIfProductExistsInCart(testUser,model)).resolves.toBe(true);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 3.2 checkIfProductExistsInCart DAO: product not exist in cart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let model="test"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkIfProductExistsInCart(testUser,model)).resolves.toBe(false);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 3.3 checkIfCartExists DAO:generic DB error", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let model="test"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkIfProductExistsInCart(testUser,model)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });
});

/* *************************** FUNZIONE checkProductAvailability ****************************** */

describe("UCD 4 checkProductAvailability", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 4.1 correct checkProductAvailability DAO", async () => {
        let model="test"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            //callback(null, new Product(5,model,Category.APPLIANCE,"","",10));
            callback(null, {sellingPrice:5,model:model,category:Category.APPLIANCE,arrivalDate:"",details:"",quantity:10});
            return ({} as Database);
        });
        
        await expect(cartDAO.checkProductAvailability(model)).resolves.toBe(10);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 4.2 checkProductAvailability DAO: product not exist", async () => {
        let model="test"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkProductAvailability(model)).resolves.toBe(-1);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 4.3 checkProductAvailability DAO:generic DB error", async () => {
        let model="test"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkProductAvailability(model)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });
});

/* *************************** FUNZIONE checkProductQuantityInCart ****************************** */

describe("UCD 5 checkProductQuantityInCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 5.1 correct checkProductQuantityInCart DAO", async () => {
        let model="test"
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null, {sellingPrice:5,model:model,category:Category.APPLIANCE,arrivalDate:"",details:"",quantity:10});
            return ({} as Database);
        });
        
        await expect(cartDAO.checkProductQuantityInCart(testUser,model)).resolves.toBe(10);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 5.2 checkProductQuantityInCart DAO: product not exist", async () => {
        let model="test"
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkProductQuantityInCart(testUser,model)).resolves.toBe(-1);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 5.3 checkProductQuantityInCart DAO:generic DB error", async () => {
        let model="test"
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkProductQuantityInCart(testUser,model)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });
});

/* *************************** FUNZIONE getCartId ****************************** */

describe("UCD 6 getCartId", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 6.1 correct getCartId DAO", async () => {
        let row={idCart:1,customer:"test",paid:false,paymentDate:"",total:0}
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null, row );
            return ({} as Database);
        });
        
        await expect(cartDAO.getCartId(testUser)).resolves.toBe(row.idCart);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 6.2 getCartId DAO: cart not exist", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.getCartId(testUser)).rejects.toStrictEqual(new CartNotFoundError());
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("UCD 6.3 getCartId DAO:generic DB error", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.getCartId(testUser)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });
});

/* *************************** FUNZIONE updateCartTotal ****************************** */

describe("UCD 7 updateCartTotal", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 7.1 correct updateCartTotal DAO", async () => {
        let price=10
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 1},null);
            return ({} as Database);
        });
        
        await expect(cartDAO.updateCartTotal(testUser,price)).resolves.toBe(true);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
    });

    test("UCD 7.2 updateCartTotal DAO: not paied cart for the user doesn't exist", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let price=10

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 0},null);
            return ({} as Database);
        });
        
        await expect(cartDAO.updateCartTotal(testUser,price)).rejects.toBe(false);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
    });

    test("UCD 7.3 updateCartTotal DAO:generic DB error", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let price=10

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.updateCartTotal(testUser,price)).rejects.toBe(Error);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
    });
});

/* *************************** FUNZIONE resetCartTotal ****************************** */

describe("UCD 8 resetCartTotal", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 8.1 correct resetCartTotal DAO", async () => {
        let price=10
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 1},null);
            return ({} as Database);
        });
        
        await expect(cartDAO.resetCartTotal(testUser)).resolves.toBe(true);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
    });

    test("UCD 8.2 resetCartTotal DAO: not paied cart for the user doesn't exist", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let price=10

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes: 0},null);
            return ({} as Database);
        });
        
        await expect(cartDAO.resetCartTotal(testUser)).rejects.toBe(false);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
    });

    test("UCD 8.3 resetCartTotal DAO:generic DB error", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let price=10

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.resetCartTotal(testUser)).rejects.toBe(Error);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
    });
});

/* *************************** FUNZIONE addToCart ****************************** */

describe("UCD 9 addToCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 9.1 correct addToCart: cart already exist and an instance of product is already in the cart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"
        let price=20
        let category=Category.APPLIANCE
        let quantity=1
        let product_object={product:product,quantity:quantity,category:category,sellingPrice:price};
        let idCart=3;

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
        jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(true);
        jest.spyOn(CartDAO.prototype, "updateCartTotal").mockResolvedValueOnce(true);
        //get del prodotto
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,product_object);
            return ({} as Database);
        });
        /////////
        // get cart id
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,{idCart:idCart});
            return ({} as Database);
        });
        //update product quantity in cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.addToCart(testUser,product)).resolves.toBe(true);
        expect(Database.prototype.get).toHaveBeenCalledTimes(2);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledWith(testUser);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledTimes(1);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledWith(testUser,product);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledTimes(1);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledWith(testUser,price);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledTimes(1);

    });

    test("UCD 9.2 correct addToCart: cart already exist product is not in the cart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"
        let price=20
        let category=Category.APPLIANCE
        let quantity=1
        let product_object={product:product,quantity:quantity,category:category,sellingPrice:price};
        let idCart=3;

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
        jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(false);
        jest.spyOn(CartDAO.prototype, "updateCartTotal").mockResolvedValueOnce(true);
        //get del prodotto
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,product_object);
            return ({} as Database);
        });
        /////////
        //get cart id
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,{idCart:idCart});
            return ({} as Database);
        });
        //insert product in cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.addToCart(testUser,product)).resolves.toBe(true);
        expect(Database.prototype.get).toHaveBeenCalledTimes(2);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledWith(testUser);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledTimes(1);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledWith(testUser,product);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledTimes(1);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledWith(testUser,price);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledTimes(1);

    });

    test("UCD 9.3 correct addToCart: cart doesn't exist", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"
        let price=20
        let category=Category.APPLIANCE
        let quantity=1
        let product_object={product:product,quantity:quantity,category:category,sellingPrice:price};
        let idCart=3;

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(false);
        jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(false);
        jest.spyOn(CartDAO.prototype, "updateCartTotal").mockResolvedValueOnce(true);
        //get del prodotto
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,product_object);
            return ({} as Database);
        });
        /////////
        // run insert new cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        //get cart id
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,{idCart:idCart});
            return ({} as Database);
        });
        //run insert product in cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.addToCart(testUser,product)).resolves.toBe(true);
        expect(Database.prototype.get).toHaveBeenCalledTimes(2);
        expect(Database.prototype.run).toHaveBeenCalledTimes(2);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledWith(testUser);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledTimes(1);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledWith(testUser,product);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledTimes(1);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledWith(testUser,price);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledTimes(1);

    });

    test("UCD 9.4 error addToCart: error in checkIfCartExists", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockRejectedValueOnce(Error);

        
        await expect(cartDAO.addToCart(testUser,product)).rejects.toBe(Error);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledWith(testUser);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledTimes(1);


    });

    test("UCD 9.5 error addToCart: error in checkIfProductExistsInCart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
        jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockRejectedValueOnce(Error);

        
        await expect(cartDAO.addToCart(testUser,product)).rejects.toBe(Error);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledWith(testUser);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledTimes(1);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledWith(testUser,product);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledTimes(1);

    });

    test("UCD 9.6 error addToCart: error in updateCartTotal con prodotto gia esistente", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"
        let price=20
        let category=Category.APPLIANCE
        let quantity=1
        let product_object={product:product,quantity:quantity,category:category,sellingPrice:price};
        let idCart=3;

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
        jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(true);
        jest.spyOn(CartDAO.prototype, "updateCartTotal").mockRejectedValueOnce(Error);
        //get del prodotto
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,product_object);
            return ({} as Database);
        });
        /////////
        // get cart id
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,{idCart:idCart});
            return ({} as Database);
        });
        //update product quantity in cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.addToCart(testUser,product)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(2);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledWith(testUser);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledTimes(1);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledWith(testUser,product);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledTimes(1);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledWith(testUser,price);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledTimes(1);

    });

    test("UCD 9.7 error addToCart: error in updateCartTotal con prodotto non ancora esistente", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"
        let price=20
        let category=Category.APPLIANCE
        let quantity=1
        let product_object={product:product,quantity:quantity,category:category,sellingPrice:price};
        let idCart=3;

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
        jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(false);
        jest.spyOn(CartDAO.prototype, "updateCartTotal").mockRejectedValueOnce(Error);
        //get del prodotto
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,product_object);
            return ({} as Database);
        });
        /////////
        // get cart id
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,{idCart:idCart});
            return ({} as Database);
        });
        //update product quantity in cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.addToCart(testUser,product)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(2);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledWith(testUser);
        expect(CartDAO.prototype.checkIfCartExists).toBeCalledTimes(1);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledWith(testUser,product);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toBeCalledTimes(1);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledWith(testUser,price);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledTimes(1);

    });
});


/* *************************** FUNZIONE getCart ****************************** */

describe("UCD 10 getCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 10.1 correct getCart: cart not exist so return empty cart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cart=new Cart(testUser.username,false,null,0,[]);

        let cartDAO = new CartDAO();

        //get carts
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.getCart(testUser)).resolves.toStrictEqual(cart);
        expect(Database.prototype.all).toHaveBeenCalledTimes(1);

    });

    test("UCD 10.2 correct getCart: return exisisting cart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let rows=[{total:100,model:"test",quantity:2,category:Category.APPLIANCE,sellingPrice:20},
            {total:100,model:"test1",quantity:1,category:Category.SMARTPHONE,sellingPrice:60}
        ]
        let products_in_cart=[new ProductInCart( "test", 2,Category.APPLIANCE,20),
                                new ProductInCart("test1",1,Category.SMARTPHONE,60)];
        
        let cart=new Cart(testUser.username,false,null,rows[0].total,products_in_cart)
        let cartDAO = new CartDAO();

        //get carts
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null, rows);
            return ({} as Database);
        });
        
        await expect(cartDAO.getCart(testUser)).resolves.toStrictEqual(cart);
        expect(Database.prototype.all).toHaveBeenCalledTimes(1);

    });

    test("UCD 10.3 error getCart: error from DB", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let cartDAO = new CartDAO();

        //get carts
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.getCart(testUser)).rejects.toBe(Error);
        expect(Database.prototype.all).toHaveBeenCalledTimes(1);

    });

});


/* *************************** FUNZIONE removeProductFromCart ****************************** */

describe("UCD 11 removeProductFromCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 11.1 correct removeProductFromCart: case quantity_in_cart==1", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"
        let price=20
        let quantity=10
        let product_object={product:product,quantity:quantity,category:Category.APPLIANCE,sellingPrice:price};
        let idCart=3;
        let quantity_in_cart=1

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCartId").mockResolvedValueOnce(idCart);
        jest.spyOn(CartDAO.prototype, "checkProductQuantityInCart").mockResolvedValueOnce(quantity_in_cart);
        jest.spyOn(CartDAO.prototype, "updateCartTotal").mockResolvedValueOnce(true);
        //get del prodotto
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,product_object);
            return ({} as Database);
        });

        /////////

        //delete product from cart cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback.call({changes:1},null);
            return ({} as Database);
        });
        
        await expect(cartDAO.removeProductFromCart(testUser,product)).resolves.toBe(true);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCartId).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCartId).toBeCalledTimes(1);
        expect(CartDAO.prototype.checkProductQuantityInCart).toBeCalledWith(testUser,product);
        expect(CartDAO.prototype.checkProductQuantityInCart).toBeCalledTimes(1);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledWith(testUser,-price);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledTimes(1);
    });

    test("UCD 11.2 correct removeProductFromCart: case quantity_in_cart>1", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"
        let price=20
        let quantity=10
        let product_object={product:product,quantity:quantity,category:Category.APPLIANCE,sellingPrice:price};
        let idCart=3;
        let quantity_in_cart=5

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCartId").mockResolvedValueOnce(idCart);
        jest.spyOn(CartDAO.prototype, "checkProductQuantityInCart").mockResolvedValueOnce(quantity_in_cart);
        jest.spyOn(CartDAO.prototype, "updateCartTotal").mockResolvedValueOnce(true);
        //get del prodotto
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,product_object);
            return ({} as Database);
        });

        /////////

        //update product quantity in cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback.call({changes:1},null);
            return ({} as Database);
        });
        
        await expect(cartDAO.removeProductFromCart(testUser,product)).resolves.toBe(true);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCartId).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCartId).toBeCalledTimes(1);
        expect(CartDAO.prototype.checkProductQuantityInCart).toBeCalledWith(testUser,product);
        expect(CartDAO.prototype.checkProductQuantityInCart).toBeCalledTimes(1);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledWith(testUser,-price);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledTimes(1);
    });

    test("UCD 11.3 error removeProductFromCart: error in getCartId", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"
        let price=20
        let quantity=10
        let product_object={product:product,quantity:quantity,category:Category.APPLIANCE,sellingPrice:price};
        let idCart=3;
        let quantity_in_cart=1

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCartId").mockRejectedValueOnce(Error);
        
        await expect(cartDAO.removeProductFromCart(testUser,product)).rejects.toBe(Error);
        expect(CartDAO.prototype.getCartId).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCartId).toBeCalledTimes(1);
    });

    test("UCD 11.4 error removeProductFromCart: error in checkProductQuantityInCart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"
        let idCart=3;

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCartId").mockResolvedValueOnce(idCart);
        jest.spyOn(CartDAO.prototype, "checkProductQuantityInCart").mockRejectedValueOnce(Error);
        
        await expect(cartDAO.removeProductFromCart(testUser,product)).rejects.toBe(Error);
        expect(CartDAO.prototype.getCartId).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCartId).toBeCalledTimes(1);
        expect(CartDAO.prototype.checkProductQuantityInCart).toBeCalledWith(testUser,product);
        expect(CartDAO.prototype.checkProductQuantityInCart).toBeCalledTimes(1);
    });

    test("UCD 11.5 error removeProductFromCart: error in updateCartTotal with quantity==1", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"
        let price=20
        let quantity=10
        let product_object={product:product,quantity:quantity,category:Category.APPLIANCE,sellingPrice:price};
        let idCart=3;
        let quantity_in_cart=1

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCartId").mockResolvedValueOnce(idCart);
        jest.spyOn(CartDAO.prototype, "checkProductQuantityInCart").mockResolvedValueOnce(quantity_in_cart);
        jest.spyOn(CartDAO.prototype, "updateCartTotal").mockRejectedValueOnce(Error);
        //get del prodotto
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,product_object);
            return ({} as Database);
        });

        /////////

        //delete product from cart cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback.call({changes:1},null);
            return ({} as Database);
        });
        
        await expect(cartDAO.removeProductFromCart(testUser,product)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCartId).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCartId).toBeCalledTimes(1);
        expect(CartDAO.prototype.checkProductQuantityInCart).toBeCalledWith(testUser,product);
        expect(CartDAO.prototype.checkProductQuantityInCart).toBeCalledTimes(1);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledWith(testUser,-price);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledTimes(1);
    });

    test("UCD 11.6 error removeProductFromCart: error in updateCartTotal with quantity>1", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let product="test"
        let price=20
        let quantity=10
        let product_object={product:product,quantity:quantity,category:Category.APPLIANCE,sellingPrice:price};
        let idCart=3;
        let quantity_in_cart=3

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCartId").mockResolvedValueOnce(idCart);
        jest.spyOn(CartDAO.prototype, "checkProductQuantityInCart").mockResolvedValueOnce(quantity_in_cart);
        jest.spyOn(CartDAO.prototype, "updateCartTotal").mockRejectedValueOnce(Error);
        //get del prodotto
        jest.spyOn(Database.prototype, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null,product_object);
            return ({} as Database);
        });

        /////////

        //update product from cart cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback.call({changes:1},null);
            return ({} as Database);
        });
        
        await expect(cartDAO.removeProductFromCart(testUser,product)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCartId).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCartId).toBeCalledTimes(1);
        expect(CartDAO.prototype.checkProductQuantityInCart).toBeCalledWith(testUser,product);
        expect(CartDAO.prototype.checkProductQuantityInCart).toBeCalledTimes(1);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledWith(testUser,-price);
        expect(CartDAO.prototype.updateCartTotal).toBeCalledTimes(1);
    });

});


/* *************************** FUNZIONE clearCart ****************************** */

describe("UCD 12 clearCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 12.1 correct clearCart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let idCart=3;

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCartId").mockResolvedValueOnce(idCart);
        jest.spyOn(CartDAO.prototype, "resetCartTotal").mockResolvedValueOnce(true);

        /////////

        //delete products from cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.clearCart(testUser)).resolves.toBe(true);
        expect(Database.prototype.get).toHaveBeenCalledTimes(0);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCartId).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCartId).toBeCalledTimes(1);
        expect(CartDAO.prototype.resetCartTotal).toBeCalledWith(testUser);
        expect(CartDAO.prototype.resetCartTotal).toBeCalledTimes(1);
    });

    test("UCD 12.2 error clearCart: error from DB", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let idCart=3;

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCartId").mockResolvedValueOnce(idCart);
        jest.spyOn(CartDAO.prototype, "resetCartTotal").mockResolvedValueOnce(true);

        /////////

        //delete products from cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.clearCart(testUser)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(0);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCartId).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCartId).toBeCalledTimes(1);
        expect(CartDAO.prototype.resetCartTotal).toBeCalledTimes(0);
    });

    test("UCD 12.3 error clearCart: error on getCartId", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCartId").mockRejectedValueOnce(Error);
        
        await expect(cartDAO.clearCart(testUser)).rejects.toBe(Error);
        expect(CartDAO.prototype.getCartId).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCartId).toBeCalledTimes(1);
    });

    test("UCD 12.4 error clearCart: error on resetCartTotal", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let idCart=3;

        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCartId").mockResolvedValueOnce(idCart);
        jest.spyOn(CartDAO.prototype, "resetCartTotal").mockRejectedValueOnce(Error);

        /////////

        //delete products from cart
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.clearCart(testUser)).rejects.toBe(Error);
        expect(Database.prototype.get).toHaveBeenCalledTimes(0);
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCartId).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCartId).toBeCalledTimes(1);
        expect(CartDAO.prototype.resetCartTotal).toBeCalledWith(testUser);
        expect(CartDAO.prototype.resetCartTotal).toBeCalledTimes(1);
    });

});

/* *************************** FUNZIONE checkoutCart ****************************** */

describe("UCD 13 checkoutCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 13.1 correct checkoutCart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let np_in_cart=2;
        let cart=new Cart(testUser.username, false, null, 70, [new ProductInCart("test",1,Category.APPLIANCE,10),
            new ProductInCart("test1",2,Category.APPLIANCE,30)]);
        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(cart);
        //update product stock quantities
        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes:1},null);
            return ({} as Database);
        });

        /////////

        //mark cart as paid cart
        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes:1},null);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkoutCart(testUser)).resolves.toBe(true);
        expect(Database.prototype.get).toHaveBeenCalledTimes(0);
        expect(Database.prototype.run).toHaveBeenCalledTimes(np_in_cart+1);
        expect(CartDAO.prototype.getCart).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCart).toBeCalledTimes(1);
    });

    test("UCD 13.2 error checkoutCart: error updaiting product stock", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let np_in_cart=2;
        let cart=new Cart(testUser.username, false, null, 70, [new ProductInCart("test",1,Category.APPLIANCE,10),
            new ProductInCart("test1",2,Category.APPLIANCE,30)]);
        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(cart);
        //update product stock quantities
        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes:0},null);
            return ({} as Database);
        });

        /////////
        
        await expect(cartDAO.checkoutCart(testUser)).rejects.toStrictEqual(new ProductNotFoundError());
        expect(Database.prototype.get).toHaveBeenCalledTimes(0);
        //ipotizzo che l'errore avvenga sull'aggiornamento del primo prodotto in lista
        expect(Database.prototype.run).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCart).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCart).toBeCalledTimes(1);
    });

    test("UCD 13.3 error checkoutCart: error updaiting cart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let np_in_cart=2;
        let cart=new Cart(testUser.username, false, null, 70, [new ProductInCart("test",1,Category.APPLIANCE,10),
            new ProductInCart("test1",2,Category.APPLIANCE,30)]);
        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(cart);

        /////////

        //mark cart as paid cart
        
        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            if (sql.includes("products")){
                callback.call({changes:1},null);
            }else{
                callback.call({changes:0},null);
            }
            return ({} as Database);
        });
        
        await expect(cartDAO.checkoutCart(testUser)).rejects.toStrictEqual(new CartNotFoundError());
        expect(Database.prototype.get).toHaveBeenCalledTimes(0);
        expect(Database.prototype.run).toHaveBeenCalledTimes(np_in_cart+1);
        expect(CartDAO.prototype.getCart).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCart).toBeCalledTimes(1);
    });

    test("UCD 13.4 error checkoutCart: error DB updaiting product stock", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let np_in_cart=2;
        let cart=new Cart(testUser.username, false, null, 70, [new ProductInCart("test",1,Category.APPLIANCE,10),
            new ProductInCart("test1",2,Category.APPLIANCE,30)]);
        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(cart);
        //update product stock quantities
        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });

        /////////

        //mark cart as paid cart
        /*
        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback.call({changes:1},null);
            return ({} as Database);
        });*/
        
        await expect(cartDAO.checkoutCart(testUser)).rejects.toBe(Error);
        //ipotizzo che l'errore avvenga sull'aggiornamento del primo prodotto in lista
        expect(Database.prototype.run).toHaveBeenCalledTimes(1); 
        expect(CartDAO.prototype.getCart).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCart).toBeCalledTimes(1);
    });

    test("UCD 13.5 error checkoutCart: error DB updaiting cart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let np_in_cart=2;
        let cart=new Cart(testUser.username, false, null, 70, [new ProductInCart("test",1,Category.APPLIANCE,10),
            new ProductInCart("test1",2,Category.APPLIANCE,30)]);
        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(cart);
        //update product stock quantities
        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            callback.call(Error,null);
            return ({} as Database);
        });

        /////////

        //mark cart as paid cart
        jest.spyOn(Database.prototype, "run").mockImplementation((sql, params, callback) => {
            if(sql.includes("carts")){
                callback(Error);
            }else{
                callback.call({changes:1},null);
            }
            return ({} as Database);
        });

        await expect(cartDAO.checkoutCart(testUser)).rejects.toBe(Error);
        expect(Database.prototype.run).toHaveBeenCalledTimes(np_in_cart+1);
        expect(CartDAO.prototype.getCart).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCart).toBeCalledTimes(1);
    });

    test("UCD 13.6 error checkoutCart: error in getCart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        let cartDAO = new CartDAO();

        // mock di base per tutti i casi
        jest.spyOn(CartDAO.prototype, "getCart").mockRejectedValueOnce(Error);
        
        await expect(cartDAO.checkoutCart(testUser)).rejects.toBe(Error);
        expect(CartDAO.prototype.getCart).toBeCalledWith(testUser);
        expect(CartDAO.prototype.getCart).toBeCalledTimes(1);
    });

});

/* *************************** FUNZIONE getCustomerCarts ****************************** */
describe("UCD 14 getCustomerCarts", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 14.1 correct getCustomerCarts: list of carts unempty", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let rows=[
            {idCart:1,customer:testUser.username,paid:true,paymentDate:"27/05/2024",total:50},
            {idCart:2,customer:testUser.username,paid:true,paymentDate:"10/01/2023",total:20}
        ]

        let carts=[
            new Cart(testUser.username,true,"27/05/2024",50,[new ProductInCart("test",1,Category.SMARTPHONE,50)]),
            new Cart(testUser.username,true,"10/01/2023",20,[new ProductInCart("test1",2,Category.LAPTOP,10)]),
        ]

        let nCarts=2
        
        let joined_rows=[
            {idCart:1,customer:testUser.username,paid:true,paymentDate:"27/05/2024",total:50,
                model:"test",quantity:1,category:Category.SMARTPHONE,price:50},
            {idCart:2,customer:testUser.username,paid:true,paymentDate:"10/01/2023",total:20,
                model:"test1",quantity:2,category:Category.LAPTOP,price:10}
        ]

        let cartDAO = new CartDAO();

        //get all paied carts of the user
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null,rows);
            return ({} as Database);
        });

        //get all paied carts of the user with products
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null,[joined_rows[0]]);
            return ({} as Database);
        });
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null,[joined_rows[1]]);
            return ({} as Database);
        });
        
        await expect(cartDAO.getCustomerCarts(testUser)).resolves.toStrictEqual(carts);
        expect(Database.prototype.all).toHaveBeenCalledTimes(nCarts+1);
    });

    test("UCD 14.2 correct getCustomerCarts: empty list of carts from carts", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        //get all paied carts of the user
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null,[]);
            return ({} as Database);
        });
        
        await expect(cartDAO.getCustomerCarts(testUser)).resolves.toStrictEqual([]);
        expect(Database.prototype.all).toHaveBeenCalledTimes(1);
    });

    test("UCD 14.3 error getCustomerCarts: list of empty carts", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let rows=[
            {cartId:1,customer:testUser.username,paid:true,paymentDate:"27/05/2024",total:50},
            {cartId:2,customer:testUser.username,paid:true,paymentDate:"10/01/2023",total:20}
        ]

        let carts=[
            new Cart(testUser.username,true,"27/05/2024",50,[new ProductInCart("test",1,Category.SMARTPHONE,50)]),
            new Cart(testUser.username,true,"10/01/2023",20,[new ProductInCart("test1",2,Category.LAPTOP,10)]),
        ]

        let nCarts=2
        
        let joined_rows=[
            {cartId:1,customer:testUser.username,paid:true,paymentDate:"27/05/2024",total:50,
                model:"test",quantity:1,category:Category.SMARTPHONE,price:50},
            {cartId:2,customer:testUser.username,paid:true,paymentDate:"10/01/2023",total:20,
                model:"test1",quantity:2,category:Category.LAPTOP,price:10}
        ]

        let cartDAO = new CartDAO();

        //get all paied carts of the user
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null,rows);
            return ({} as Database);
        });

        //get all paied carts of the user with products
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.getCustomerCarts(testUser)).rejects.toStrictEqual(new CartNotFoundError());
        expect(Database.prototype.all).toHaveBeenCalledTimes(nCarts+1);
    });

    test("UCD 14.5 error getCustomerCarts:DB error in carts", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        //get all paied carts of the user
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.getCustomerCarts(testUser)).rejects.toBe(Error);
        expect(Database.prototype.all).toHaveBeenCalledTimes(1);
    });


    test("UCD 14.6error getCustomerCarts:DB error in products_in_cart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let rows=[
            {cartId:1,customer:testUser.username,paid:true,paymentDate:"27/05/2024",total:50},
            {cartId:2,customer:testUser.username,paid:true,paymentDate:"10/01/2023",total:20}
        ]

        let nCarts=2

        let cartDAO = new CartDAO();

        //get all paied carts of the user
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null,rows);
            return ({} as Database);
        });

        //get all paied carts of the user with products
        jest.spyOn(Database.prototype, "all").mockImplementation((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.getCustomerCarts(testUser)).rejects.toBe(Error);
        expect(Database.prototype.all).toHaveBeenCalledTimes(nCarts+1);
    });
});


/* *************************** FUNZIONE deleteAllCarts ****************************** */

describe("UCD 15 deleteAllCarts", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("UCD 15.1 correct deleteAllCarts", async () => {
        let cartDAO = new CartDAO();

        //delete from carts
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null,true);
            return ({} as Database);
        });
        //delete from carts_in_product
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null,true);
            return ({} as Database);
        });

        await expect(cartDAO.deleteAllCarts()).resolves.toBe(true);
        expect(Database.prototype.run).toHaveBeenCalledTimes(2);

    });

    test("UCD 15.1 error deleteAllCarts: DB error in carts", async () => {
        let cartDAO = new CartDAO();

        //delete from carts
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        //delete from carts_in_product
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null,true);
            return ({} as Database);
        });

        await expect(cartDAO.deleteAllCarts()).rejects.toBe(Error);
        expect(Database.prototype.run).toHaveBeenCalledTimes(2);

    });

    test("UCD 15.2error deleteAllCarts: DB error in product_in_carts", async () => {
        let cartDAO = new CartDAO();

        //delete from carts
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(null,true);
            return ({} as Database);
        });
        //delete from carts_in_product
        jest.spyOn(Database.prototype, "run").mockImplementationOnce((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });

        await expect(cartDAO.deleteAllCarts()).rejects.toBe(Error);
        expect(Database.prototype.run).toHaveBeenCalledTimes(2);

    });
});

/* *************************** FUNZIONE getAllCarts ****************************** */
describe("UCD 16 getAllCarts", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    test("UCD 16.1 correct getAllCarts: list of carts unempty", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        const testUser2 = {
            username: "test2",
            name: "test2",
            surname: "test2",
            role: Role.CUSTOMER,
            address: "test2",
            birthdate: "04/03/2000"
        }

        let carts=[
            new Cart(testUser.username,true,"27/05/2024",50,[new ProductInCart("test",1,Category.SMARTPHONE,50)]),
            new Cart(testUser2.username,true,"10/01/2023",20,[new ProductInCart("test1",2,Category.LAPTOP,10)]),
        ]
        
        let joined_rows=[
            {idCart:1,customer:testUser.username,paid:true,paymentDate:"27/05/2024",total:50,
                model:"test",quantity:1,category:Category.SMARTPHONE,price:50},
            {idCart:2,customer:testUser2.username,paid:true,paymentDate:"10/01/2023",total:20,
                model:"test1",quantity:2,category:Category.LAPTOP,price:10}
        ]

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null,joined_rows);
            return ({} as Database);
        });
        await expect(cartDAO.getAllCarts()).resolves.toStrictEqual(carts);
        expect(Database.prototype.all).toHaveBeenCalledTimes(1);
    });

    test("UCD 16.2 correct getAllCarts: empty list of carts from carts", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        let cartDAO = new CartDAO();

        //get all paied carts of the user
        jest.spyOn(Database.prototype, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null,[]);
            return ({} as Database);
        });
        
        await expect(cartDAO.getAllCarts()).resolves.toStrictEqual([]);
        expect(Database.prototype.all).toHaveBeenCalledTimes(1);
    });

    test("UCD 16.3 error getAllCarts: list of empty carts", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        const testUser2 = {
            username: "test2",
            name: "test2",
            surname: "test2",
            role: Role.CUSTOMER,
            address: "test2",
            birthdate: "04/03/2000"
        }

        
        let cartDAO = new CartDAO();

        let joined_rows=[
            {idCart:1,customer:testUser.username,paid:true,paymentDate:"27/05/2024",total:50},
            {idCart:2,customer:testUser2.username,paid:true,paymentDate:"10/01/2023",total:20}
        ]

        let carts=[
            new Cart(testUser.username,true,"27/05/2024",50,[]),
            new Cart(testUser2.username,true,"10/01/2023",20,[]),
        ]

        jest.spyOn(Database.prototype, "all").mockImplementation((sql, params, callback) => {
            callback(null,joined_rows);
            return ({} as Database);
        });
        
        await expect(cartDAO.getAllCarts()).resolves.toStrictEqual(carts);
        expect(Database.prototype.all).toHaveBeenCalledTimes(1);
    });


    test("UCD 16.4 error getAllCarts:DB error in products_in_cart", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }

        const testUser2 = {
            username: "test2",
            name: "test2",
            surname: "test2",
            role: Role.CUSTOMER,
            address: "test2",
            birthdate: "04/03/2000"
        }

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "all").mockImplementation((sql, params, callback) => {
            callback(Error);
            return ({} as Database);
        });
        
        await expect(cartDAO.getAllCarts()).rejects.toBe(Error);
        expect(Database.prototype.all).toHaveBeenCalledTimes(1);
    });

});




