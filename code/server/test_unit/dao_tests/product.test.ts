import { expect, jest } from '@jest/globals';
import ProductDAO from '../../src/dao/productDAO';
import db from "../../src/db/db";
import { ProductAlreadyExistsError, ProductNotFoundError } from "../../src/errors/productError";
import { Product, Category } from '../../src/components/product';
import { Database } from "sqlite3";
//import "@types/jest"

jest.mock("../../src/db/db.ts");

let productDAO = new ProductDAO();

describe("UPD1 registerProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPD1.1 Success - void", async () => {
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

        await expect(productDAO.registerProducts(testModel, testCategory, testQuantity, testDetails, testSellingPrice, testArrivalDate)).resolves.toBe(undefined);
    });

    it("UPD1.2 Error 404- ProductAlreadyExistsError", async () => {
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

    it("UPD1.3 Error - Generic DB Error", async () => {
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

describe("UPD2 getArrivalDate", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPD2.1 Success - returns date", async () => {
        const testModel = 'iPhone13';
        const testDate = '2024-05-31';

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { arrivalDate: testDate });
            return {} as Database;
        });

        await expect(productDAO.getArrivalDate(testModel)).resolves.toBe(testDate);
    });

    it("UPD2.2 Error 404- ProductNotFoundError", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null); 
            return {} as Database;
        });

        await expect(productDAO.getArrivalDate(testModel)).rejects.toThrowError(ProductNotFoundError);
    });

    it("UPD2.3 Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error(), null);
            return {} as Database;
        });

        await expect(productDAO.getArrivalDate(testModel)).rejects.toThrowError(Error);
    });
});

describe("UPD3 changeProductQuantity", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPD3.1 - Success - Updated Quantity", async () => {
        const testModel = 'iPhone13';
        const initialQuantity = 10;
        const newQuantity = 5;
        const expectedQuantity = initialQuantity + newQuantity;

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { quantity: initialQuantity });
            return {} as Database;
        });

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 1 }, null);
            return {} as Database;
        });

        await expect(productDAO.changeProductQuantity(testModel, newQuantity, null)).resolves.toBe(expectedQuantity);
    });

    it("UPD3.2 Error 404- ProductNotFoundError", async () => {
        const testModel = 'iPhone13';
        const newQuantity = 20;

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 0 }, null);
            return {} as Database;
        });

        await expect(productDAO.changeProductQuantity(testModel, newQuantity, null)).rejects.toThrowError(ProductNotFoundError);
    });

    it("UPD3.3 Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';
        const newQuantity = 20;

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(productDAO.changeProductQuantity(testModel, newQuantity, null)).rejects.toThrowError(Error);
    });
});

describe("UPD4 getProductQuantity", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPD4.1 Success - returns quantity", async () => {
        const testModel = 'iPhone13';
        const testQuantity = 10;

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { quantity: testQuantity });
            return {} as Database;
        });

        await expect(productDAO.getProductQuantity(testModel)).resolves.toBe(testQuantity);
    });

    it("UPD4.2 Error 404- ProductNotFoundError", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null);
            return {} as Database;
        });

        await expect(productDAO.getProductQuantity(testModel)).rejects.toThrowError(ProductNotFoundError);
    });

    it("UPD4.3 Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error(), null);
            return {} as Database;
        });

        await expect(productDAO.getProductQuantity(testModel)).rejects.toThrowError(Error);
    });
});

describe("UPD5 getFilteredProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPD5.1 Success - returns products by category", async () => {
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

    it("UPD5.2 Success - returns product by model", async () => {
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

    it("UPD5.3 Error 404- ProductNotFoundError", async () => {
        const filterType = 'model';
        const filterValue = 'iPhone13';
    
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            if (filterType === 'model') {
                callback(null, []); 
            }
            return {} as Database;
        });
    
        await expect(productDAO.getFilteredProducts(filterType, filterValue)).rejects.toThrowError(ProductNotFoundError);
    });

    it("UPD5.4 Error - Generic DB Error", async () => {
        const filterType = 'category';
        const filterValue = Category.SMARTPHONE;

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new Error(), []);
            return {} as Database;
        });

        await expect(productDAO.getFilteredProducts(filterType, filterValue)).rejects.toThrowError(Error);
    });
});

describe("UPD6 getAllProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPD6.1 Success - returns all products", async () => {
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

    it("UPD6.2 Error - Generic DB Error", async () => {
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new Error(), []);
            return {} as Database;
        });

        await expect(productDAO.getAllProducts()).rejects.toThrowError(Error);
    });
});

describe("UPD7 deleteAllProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPD7.1 Success - returns true", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        await expect(productDAO.deleteAllProducts()).resolves.toBe(true);
    });

    it("UPD7.2 Error - Generic DB Error", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(productDAO.deleteAllProducts()).rejects.toThrowError(Error);
    });
});

describe("UPD8 deleteProduct", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPD8.1 Success - returns true", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 1 }, null);
            return {} as Database;
        });

        await expect(productDAO.deleteProduct(testModel)).resolves.toBe(true);
    });

    it("UPD8.2 Error - ProductNotFoundError", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 0 }, null);
            return {} as Database;
        });

        await expect(productDAO.deleteProduct(testModel)).rejects.toThrowError(ProductNotFoundError);
    });

    it("UPD8.3 Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(productDAO.deleteProduct(testModel)).rejects.toThrowError(Error);
    });
});
