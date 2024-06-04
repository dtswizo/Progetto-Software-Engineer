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

describe("checkIfCartExists", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    
    test("correct checkIfCartExists DAO", async () => {
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

    test("checkIfCartExists DAO: cart not exist", async () => {
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

    test("checkIfCartExists DAO:generic DB error", async () => {
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

describe("checkIfProductExists", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("correct checkIfProductExists DAO", async () => {
        let model="test"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null, new Product(10,model,Category.APPLIANCE,"","",0));
            return ({} as Database);
        });
        
        await expect(cartDAO.checkIfProductExists(model)).resolves.toBe(true);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("checkIfProductExists DAO: product not exist", async () => {
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

    test("checkIfProductExists DAO: product not exist V2", async () => {
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

    test("checkIfProductExists DAO:generic DB error", async () => {
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

describe("checkIfProductExistsInCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    
    test("correct checkIfProductExistsInCart DAO", async () => {
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

    test("checkIfProductExistsInCart DAO: product not exist in cart", async () => {
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

    test("checkIfCartExists DAO:generic DB error", async () => {
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

describe("checkProductAvailability", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("correct checkProductAvailability DAO", async () => {
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

    test("checkProductAvailability DAO: product not exist", async () => {
        let model="test"

        let cartDAO = new CartDAO();

        jest.spyOn(Database.prototype, "get").mockImplementation((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });
        
        await expect(cartDAO.checkProductAvailability(model)).resolves.toBe(-1);
        expect(Database.prototype.get).toHaveBeenCalledTimes(1);
    });

    test("checkProductAvailability DAO:generic DB error", async () => {
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

describe("checkProductQuantityInCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("correct checkProductQuantityInCart DAO", async () => {
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

    test("checkProductQuantityInCart DAO: product not exist", async () => {
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

    test("checkProductQuantityInCart DAO:generic DB error", async () => {
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