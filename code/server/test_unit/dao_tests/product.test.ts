import { expect, jest } from '@jest/globals';
import ProductDAO from '../../src/dao/productDAO';
import db from "../../src/db/db";
import { ProductAlreadyExistsError, ProductNotFoundError } from "../../src/errors/productError";
import { Product, Category } from '../../src/components/product';
import { Database } from "sqlite3";
//import "@types/jest"

jest.mock("../../src/db/db.ts");

let productDAO = new ProductDAO();

describe("registerProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - void", async () => {
        const testModel = 'iPhone13';
        const testCategory = Category.SMARTPHONE;
        const testQuantity = 10;
        const testDetails = 'Latest model';
        const testSellingPrice = 999.99;
        const testArrivalDate = '2024-05-31';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null); 
            return {} as Database;
        });

        await expect(productDAO.registerProducts(testModel, testCategory, testQuantity, testDetails, testSellingPrice, testArrivalDate)).resolves.toBe(undefined); //poichè la promise restituisce void in caso di successo
    });

    it("Error 404- ProductAlreadyExistsError", async () => {
        const testModel = 'iPhone13';
        const testCategory = Category.SMARTPHONE;
        const testQuantity = 10;
        const testDetails = 'Latest model';
        const testSellingPrice = 999.99;
        const testArrivalDate = '2024-05-31';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("UNIQUE constraint failed: products.model"));
            return {} as Database;
        });

        await expect(productDAO.registerProducts(testModel, testCategory, testQuantity, testDetails, testSellingPrice, testArrivalDate)).rejects.toThrowError(ProductAlreadyExistsError);
    });

    it("Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';
        const testCategory = Category.SMARTPHONE;
        const testQuantity = 10;
        const testDetails = 'Latest model';
        const testSellingPrice = 999.99;
        const testArrivalDate = '2024-05-31';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(productDAO.registerProducts(testModel, testCategory, testQuantity, testDetails, testSellingPrice, testArrivalDate)).rejects.toThrowError(Error);
    });
});

describe("getArrivalDate", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - returns date", async () => {
        const testModel = 'iPhone13';
        const testDate = '2024-05-31';

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { arrivalDate: testDate });
            return {} as Database;
        });

        await expect(productDAO.getArrivalDate(testModel)).resolves.toBe(testDate);
    });

    it("Error 404- ProductNotFoundError", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null); //occhio qui lasciare null come primo parametro poichè se non trova il prodotto non è un errore del db!
            return {} as Database;
        });

        await expect(productDAO.getArrivalDate(testModel)).rejects.toThrowError(ProductNotFoundError);
    });

    it("Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error(), null);
            return {} as Database;
        });

        await expect(productDAO.getArrivalDate(testModel)).rejects.toThrowError(Error);
    });
});


describe("changeProductQuantity", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - returns new quantity", async () => {
        const testModel = 'iPhone13';
        const newQuantity = 20;

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 1 }, null);
            return {} as Database;
        });

        await expect(productDAO.changeProductQuantity(testModel, newQuantity, null)).resolves.toBe(newQuantity);
    });

    it("Error 404- ProductNotFoundError", async () => {
        const testModel = 'iPhone13';
        const newQuantity = 20;

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 0 }, null); //se changes==0 ovvero non viene aggiornata nessuna riga del db significa che non ha trovato il prodotto 
            return {} as Database;
        });

        await expect(productDAO.changeProductQuantity(testModel, newQuantity, null)).rejects.toThrowError(ProductNotFoundError);
    });

    it("Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';
        const newQuantity = 20;

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(productDAO.changeProductQuantity(testModel, newQuantity, null)).rejects.toThrowError(Error);
    });
});


describe("getProductQuantity", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - returns quantity", async () => {
        const testModel = 'iPhone13';
        const testQuantity = 10;

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { quantity: testQuantity });
            return {} as Database;
        });

        await expect(productDAO.getProductQuantity(testModel)).resolves.toBe(testQuantity);
    });

    it("Error 404- ProductNotFoundError", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null);
            return {} as Database;
        });

        await expect(productDAO.getProductQuantity(testModel)).rejects.toThrowError(ProductNotFoundError);
    });

    it("Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error(), null);
            return {} as Database;
        });

        await expect(productDAO.getProductQuantity(testModel)).rejects.toThrowError(Error);
    });
});



describe("getFilteredProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - returns products by category", async () => {
        const filterType = 'category';
        const filterValue = Category.SMARTPHONE;
        const testProducts = [
            new Product(999.99, 'iPhone13', Category.SMARTPHONE, '2024-05-31', 'Latest model', 10)
        ];

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{
                sellingPrice: 999.99,
                model: 'iPhone13',
                category: Category.SMARTPHONE,
                arrivalDate: '2024-05-31',
                details: 'Latest model',
                quantity: 10
            }]);
            return {} as Database;
        });

        await expect(productDAO.getFilteredProducts(filterType, filterValue)).resolves.toStrictEqual(testProducts);
    });

    it("Success - returns product by model", async () => {
        const filterType = 'model';
        const filterValue = 'iPhone13';
        const testProducts = [
            new Product(999.99, 'iPhone13', Category.SMARTPHONE, '2024-05-31', 'Latest model', 10)
        ];

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{
                sellingPrice: 999.99,
                model: 'iPhone13',
                category: Category.SMARTPHONE,
                arrivalDate: '2024-05-31',
                details: 'Latest model',
                quantity: 10
            }]);
            return {} as Database;
        });

        await expect(productDAO.getFilteredProducts(filterType, filterValue)).resolves.toStrictEqual(testProducts);
    });

    it("Error 404- ProductNotFoundError", async () => {
        const filterType = 'model';
        const filterValue = 'iPhone13';
    
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            if (filterType === 'model') {
                callback(null, []); //non sono così sicuro del secondo parametro della callback e il test da problemi
            }
            return {} as Database;
        });
    
        await expect(productDAO.getFilteredProducts(filterType, filterValue)).rejects.toThrowError(ProductNotFoundError);
    });

    it("Error - Generic DB Error", async () => {
        const filterType = 'category';
        const filterValue = Category.SMARTPHONE;

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new Error(), []);
            return {} as Database;
        });

        await expect(productDAO.getFilteredProducts(filterType, filterValue)).rejects.toThrowError(Error);
    });
});


describe("getAllProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - returns all products", async () => {
        const testProducts = [
            new Product(999.99, 'iPhone13', Category.SMARTPHONE, '2024-05-31', 'Latest model', 10)
        ];

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{
                sellingPrice: 999.99,
                model: 'iPhone13',
                category: Category.SMARTPHONE,
                arrivalDate: '2024-05-31',
                details: 'Latest model',
                quantity: 10
            }]);
            return {} as Database;
        });

        await expect(productDAO.getAllProducts()).resolves.toStrictEqual(testProducts);
    });

    it("Error - Generic DB Error", async () => {
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new Error(), []);
            return {} as Database;
        });

        await expect(productDAO.getAllProducts()).rejects.toThrowError(Error);
    });
});



describe("deleteAllProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - returns true", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        await expect(productDAO.deleteAllProducts()).resolves.toBe(true);
    });

    it("Error - Generic DB Error", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(productDAO.deleteAllProducts()).rejects.toThrowError(Error);
    });
});


describe("deleteProduct", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - returns true", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 1 }, null);
            return {} as Database;
        });

        await expect(productDAO.deleteProduct(testModel)).resolves.toBe(true);
    });

    it("Error - ProductNotFoundError", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 0 }, null);
            return {} as Database;
        });

        await expect(productDAO.deleteProduct(testModel)).rejects.toThrowError(ProductNotFoundError);
    });

    it("Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(productDAO.deleteProduct(testModel)).rejects.toThrowError(Error);
    });
});
