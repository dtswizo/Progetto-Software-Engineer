import { expect, jest, test } from '@jest/globals';
import { cleanupDB } from '../src/db/cleanup';
import ProductDAO from '../src/dao/productDAO';
import { ProductAlreadyExistsError, ProductNotFoundError } from '../src/errors/productError';
import { Category, Product } from '../src/components/product';
import db from "../src/db/db"

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
