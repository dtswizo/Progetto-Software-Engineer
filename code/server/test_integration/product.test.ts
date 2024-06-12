import { expect, jest, test } from '@jest/globals';
import { cleanupDB } from '../src/db/cleanup';
import ProductDAO from '../src/dao/productDAO';
import { ProductAlreadyExistsError, ProductNotFoundError } from '../src/errors/productError';
import { Category, Product } from '../src/components/product';
import db from "../src/db/db"
import ProductController from '../src/controllers/productController';
import { EmptyProductStockError, FilteringError, LowProductStockError} from "../src/errors/productError";
import { DateError } from '../src/utilities';


const testModel = 'iPhone13';
const testCategory = Category.SMARTPHONE;
const testDetails = 'Latest iPhone model';
const testSellingPrice = 999;
const testArrivalDate = '2024-06-01';
const testQuantity = 10;

const addProduct = async (model: string, sellingPrice: number, category: Category, arrivalDate: string, details: string, quantity: number) => {
    const sqlProduct = "INSERT INTO products(model, sellingPrice, category, arrivalDate, details, quantity) VALUES(?, ?, ?, ?, ?, ?)";
    await new Promise<void>((resolve, reject) => {
        db.run(sqlProduct, [model, sellingPrice, category, arrivalDate, details, quantity], (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

const removeProduct = async () => {
    const sql = "DELETE FROM products";
    await new Promise<void>((resolve, reject) => {
        db.run(sql, [], (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

describe('Integration DAO - DB', () => {

    beforeAll(async () => {
        await cleanupDB();
    });

    describe('IPD1: registerProducts', () => {
        test('IPD1.1: Success - registers a new product', async () => {
            const productDAO = new ProductDAO();
            await expect(productDAO.registerProducts(testModel, testCategory, testQuantity, testDetails, testSellingPrice, testArrivalDate)).resolves.toBeUndefined();
        });

        test('IPD1.2: Error - product already exists', async () => {
            const productDAO = new ProductDAO();
            await expect(productDAO.registerProducts(testModel, testCategory, testQuantity, testDetails, testSellingPrice, testArrivalDate)).rejects.toThrow(ProductAlreadyExistsError);
        });
    });

    describe('IPD2: getArrivalDate', () => {
        test('IPD2.1: Success - retrieves the arrival date of the product', async () => {
            const productDAO = new ProductDAO();
            await expect(productDAO.getArrivalDate(testModel)).resolves.toBe(testArrivalDate);
        });

        test('IPD2.2: Error - product not found', async () => {
            await removeProduct();
            const productDAO = new ProductDAO();
            await expect(productDAO.getArrivalDate(testModel)).rejects.toThrow(ProductNotFoundError);
        });
    });

    describe('IPD3: changeProductQuantity', () => {
        test('IPD3.1: Success - changes the product quantity', async () => {
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const newQuantity = 20;
            const productDAO = new ProductDAO();
            await expect(productDAO.changeProductQuantity(testModel, newQuantity, null)).resolves.toBe(newQuantity);
        });

        test('IPD3.2: Error - product not found', async () => {
            await removeProduct();
            const productDAO = new ProductDAO();
            await expect(productDAO.changeProductQuantity(testModel, 10, null)).rejects.toThrow(ProductNotFoundError);
        });
    });

    describe('IPD4: getProductQuantity', () => {
        test('IPD4.1: Success - retrieves the product quantity', async () => {
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const productDAO = new ProductDAO();
            await expect(productDAO.getProductQuantity(testModel)).resolves.toBe(testQuantity);
        });

        test('IPD4.2: Error - product not found', async () => {
            await removeProduct();
            const productDAO = new ProductDAO();
            await expect(productDAO.getProductQuantity(testModel)).rejects.toThrow(ProductNotFoundError);
        });
    });

    describe('IPD5: getFilteredProducts', () => {
        test('IPD5.1: Success - retrieves products by category', async () => {
            await removeProduct();
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const productDAO = new ProductDAO();
            await expect(productDAO.getFilteredProducts('category', testCategory)).resolves.toEqual([
                new Product(testSellingPrice, testModel, testCategory, testArrivalDate, testDetails, testQuantity)
            ]);
        });

        test('IPD5.2: Success - retrieves products by model', async () => {
            await removeProduct();
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const productDAO = new ProductDAO();
            await expect(productDAO.getFilteredProducts('model', testModel)).resolves.toEqual([
                new Product(testSellingPrice, testModel, testCategory, testArrivalDate, testDetails, testQuantity)
            ]);
        });

        test('IPD5.3: Error - product not found by model', async () => {
            await removeProduct();
            const productDAO = new ProductDAO();
            await expect(productDAO.getFilteredProducts('model', testModel)).rejects.toThrow(ProductNotFoundError);
        });
    });

    describe('IPD6: getAllProducts', () => {
        test('IPD6.1: Success - retrieves all products', async () => {
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const productDAO = new ProductDAO();
            await expect(productDAO.getAllProducts()).resolves.toEqual([
                new Product(testSellingPrice, testModel, testCategory, testArrivalDate, testDetails, testQuantity)
            ]);
        });
    });

    describe('IPD7: deleteAllProducts', () => {
        test('IPD7.1: Success - deletes all products', async () => {
            await removeProduct();
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const productDAO = new ProductDAO();
            await expect(productDAO.deleteAllProducts()).resolves.toBe(true);
        });
    });

    describe('IPD8: deleteProduct', () => {
        test('IPD8.1: Success - deletes a product', async () => {
            await removeProduct(); //se non lo faccio da errore perchè il prodotto è già stato aggiunto prima
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const productDAO = new ProductDAO();
            await expect(productDAO.deleteProduct(testModel)).resolves.toBe(true);
        });

        test('IPD8.2: Error - product not found', async () => {
            await removeProduct();
            const productDAO = new ProductDAO();
            await expect(productDAO.deleteProduct(testModel)).rejects.toThrow(ProductNotFoundError);
        });
    });
});

describe('Integration CONTROLLER - DAO - DB', () => {

    beforeAll(async () => {
        await cleanupDB();
    });

    describe('IPC1: registerProducts', () => {
        test('IPC1.1: Success - registers a new product', async () => {
            const productController = new ProductController();
            await expect(productController.registerProducts(testModel, testCategory, testQuantity, testDetails, testSellingPrice, testArrivalDate)).resolves.toBeUndefined();
        });

        test('IPC1.2: Error - product already exists', async () => {
            const productController = new ProductController();
            await expect(productController.registerProducts(testModel, testCategory, testQuantity, testDetails, testSellingPrice, testArrivalDate)).rejects.toThrow(Error);
        });
    });

    describe('IPC2: changeProductQuantity', () => {
        test('IPC2.1: Success - changes the product quantity', async () => {
            const productController = new ProductController();
            const newQuantity = 20;
            await expect(productController.changeProductQuantity(testModel, newQuantity, null)).resolves.toBe(newQuantity);
        });

        test('IPC2.2: Error - product not found', async () => {
            await removeProduct();
            const productController = new ProductController();
            await expect(productController.changeProductQuantity(testModel, 10, null)).rejects.toThrow(ProductNotFoundError);
        });
    });

    describe('IPC3: sellProduct', () => {
        test('IPC3.1: Success - sells the product', async () => {
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const productController = new ProductController();
            const quantityToSell = 5;
            await expect(productController.sellProduct(testModel, quantityToSell, null)).resolves.toBe(testQuantity - quantityToSell);
        });

        test('IPC3.2: Error - low product stock', async () => {
            const productController = new ProductController();
            await expect(productController.sellProduct(testModel, testQuantity + 1, null)).rejects.toThrow(LowProductStockError);
        });

        test('IPC3.3: Error - empty product stock', async () => {
            await removeProduct();
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, 0);
            const productController = new ProductController();
            await expect(productController.sellProduct(testModel, testQuantity, null)).rejects.toThrow(EmptyProductStockError);
        });
    });

    describe('IPC4: getProducts', () => {
        test('IPC4.1: Success - retrieves all products', async () => {
            await removeProduct();
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const productController = new ProductController();
            await expect(productController.getProducts(null, null, null)).resolves.toEqual([
                new Product(testSellingPrice, testModel, testCategory, testArrivalDate, testDetails, testQuantity)
            ]);
        });

        test('IPC4.2: Success - retrieves products by category', async () => {
            const productController = new ProductController();
            await expect(productController.getProducts('category', testCategory, null)).resolves.toEqual([
                new Product(testSellingPrice, testModel, testCategory, testArrivalDate, testDetails, testQuantity)
            ]);
        });

        test('IPC4.3: Error - invalid category', async () => {
            const productController = new ProductController();
            await expect(productController.getProducts('category', 'InvalidCategory', null)).rejects.toThrow(Error);
        });

        test('IPC4.4: Error - product not found by model', async () => {
            await removeProduct();
            const productController = new ProductController();
            await expect(productController.getProducts('model', null, testModel)).rejects.toThrow(ProductNotFoundError);
        });
    });

    describe('IPC5: getAvailableProducts', () => {
        test('IPC5.1: Success - retrieves all available products', async () => {
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const productController = new ProductController();
            await expect(productController.getAvailableProducts(null, null, null)).resolves.toEqual([
                new Product(testSellingPrice, testModel, testCategory, testArrivalDate, testDetails, testQuantity)
            ]);
        });

        test('IPC5.2: Success - retrieves available products by category', async () => {
            const productController = new ProductController();
            await expect(productController.getAvailableProducts('category', testCategory, null)).resolves.toEqual([
                new Product(testSellingPrice, testModel, testCategory, testArrivalDate, testDetails, testQuantity)
            ]);
        });

        test('IPC5.3: Error - product not found by model', async () => {
            await removeProduct();
            const productController = new ProductController();
            await expect(productController.getAvailableProducts('model', null, testModel)).rejects.toThrow(ProductNotFoundError);
        });
    });

    describe('IPC6: deleteAllProducts', () => {
        test('IPC6.1: Success - deletes all products', async () => {
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const productController = new ProductController();
            await expect(productController.deleteAllProducts()).resolves.toBe(true);
        });
    });

    describe('IPC7: deleteProduct', () => {
        test('IPC7.1: Success - deletes a product', async () => {
            await addProduct(testModel, testSellingPrice, testCategory, testArrivalDate, testDetails, testQuantity);
            const productController = new ProductController();
            await expect(productController.deleteProduct(testModel)).resolves.toBe(true);
        });

        test('IPC7.2: Error - product not found', async () => {
            await removeProduct();
            const productController = new ProductController();
            await expect(productController.deleteProduct(testModel)).rejects.toThrow(ProductNotFoundError);
        });
    });
});
