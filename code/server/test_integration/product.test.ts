import { expect, jest, test } from '@jest/globals';
import { cleanupDB } from '../src/db/cleanup';
import ProductDAO from '../src/dao/productDAO';
import { ProductAlreadyExistsError, ProductNotFoundError } from '../src/errors/productError';
import { Category, Product } from '../src/components/product';
import db from "../src/db/db"
import ProductController from '../src/controllers/productController';
import { EmptyProductStockError, FilteringError, LowProductStockError} from "../src/errors/productError";
import { DateError } from '../src/utilities';
import { app } from "../index"
import request from 'supertest'
import ProductRoutes from '../src/routers/productRoutes';
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from '../src/testUtilities'
import { User } from '../src/components/user';


const baseURL = "/ezelectronics/products";
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

const addUser = async (user: User) => {
    const sqlUser = "INSERT INTO users(username, name, surname, role) VALUES(?, ?, ?, ?)"
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sqlUser, [user.username, user.name, user.surname, user.role], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

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
            await expect(productDAO.changeProductQuantity(testModel, newQuantity, null)).resolves.toBe(testQuantity+newQuantity);
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
            await expect(productController.changeProductQuantity(testModel, newQuantity, null)).resolves.toBe(testQuantity+newQuantity);
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

describe('Integration ROUTE - CONTROLLER - DAO - DB for Products', () => {
    const baseURL = "/ezelectronics/products";
    const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" };
    let adminCookie: string;

    const testProduct = { model: "iPhone13", category: "Smartphone", quantity: 10, details: "Latest model", sellingPrice: 999, arrivalDate: "2023-05-01" };
    const testProductUpdated = { quantity: 5, changeDate: "2023-06-01" };
    const testProductSell = { quantity: 3, sellingDate: "2023-07-01" };

    const postUser = async (userInfo: any) => {
        await request(app)
            .post("/ezelectronics/users")
            .send(userInfo)
            .expect(200);
    };

    const login = async (userInfo: any): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            request(app)
                .post("/ezelectronics/sessions")
                .send(userInfo)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.header["set-cookie"][0]);
                    }
                });
        });
    };

    beforeAll(async () => {
        await cleanupDB();
        await postUser(admin);
        adminCookie = await login(admin);
    });

    describe("IPR1 POST /ezelectronics/products", () => {
        test("IPR1.1 Correct product registration", async () => {
            const response = await request(app).post(baseURL).send(testProduct).set("Cookie", adminCookie);
            expect(response.status).toBe(200);
        });

        test("IPR1.2 Error on missing required fields", async () => {
            const response = await request(app).post(baseURL).send({ model: "iPhone13" }).set("Cookie", adminCookie);
            expect(response.status).toBe(422); //parametri errati perchè ho passato solo modello => mi aspetto 422
        });
        
        test("IPR1.3 Error on duplicate product model", async () => {
            await request(app).post(baseURL).send(testProduct).set("Cookie", adminCookie);
            const response = await request(app).post(baseURL).send(testProduct).set("Cookie", adminCookie);
            expect(response.status).toBe(409); 
        });
    
        test("IPR1.4 Error on invalid arrival date", async () => {
            const invalidProduct = { ...testProduct, arrivalDate: "3024-06-01" }; 
            const response = await request(app).post(baseURL).send(invalidProduct).set("Cookie", adminCookie);
            expect(response.status).toBe(400); 
        });
    });

    describe("IPR2 PATCH /ezelectronics/products/:model", () => {
        test("IPR2.1 Correct quantity update", async () => {
            await request(app).post(baseURL).send(testProduct).set("Cookie", adminCookie); 
            const response = await request(app).patch(`${baseURL}/${testProduct.model}`).send(testProductUpdated).set("Cookie", adminCookie);
            expect(response.status).toBe(200);
            expect(response.body.quantity).toBe(testProduct.quantity + testProductUpdated.quantity);
        });

        test("IPR2.2 Error on updating non-existing product", async () => {
            const response = await request(app).patch(`${baseURL}/nonExistingModel`).send(testProductUpdated).set("Cookie", adminCookie);
            expect(response.status).toBe(404);
        });

        test("IPR2.3 Error if model does not represent a product in the database", async () => {
            const response = await request(app).patch(`${baseURL}/nonExistingModel`).send(testProductUpdated).set("Cookie", adminCookie);
            expect(response.status).toBe(404); 
        });
    
        test("IPR2.4 Error if changeDate is after the current date", async () => {
            const futureDateUpdate = { ...testProductUpdated, changeDate: "3024-06-01" }; // Future change date
            const response = await request(app).patch(`${baseURL}/${testProduct.model}`).send(futureDateUpdate).set("Cookie", adminCookie);
            expect(response.status).toBe(400); 
        });
    
        test("IPR2.5 Error if changeDate is before the product's arrivalDate", async () => {
            const pastDateUpdate = { ...testProductUpdated, changeDate: "2023-04-01" }; // Before arrival date
            const response = await request(app).patch(`${baseURL}/${testProduct.model}`).send(pastDateUpdate).set("Cookie", adminCookie);
            expect(response.status).toBe(400); 
        });
    });

    describe("IPR3 PATCH /ezelectronics/products/:model/sell", () => {
        test("IPR3.1 Correct product selling", async () => {
            await request(app).post(baseURL).send(testProduct).set("Cookie", adminCookie); // Make sure the product exists
            const response = await request(app).patch(`${baseURL}/${testProduct.model}/sell`).send(testProductSell).set("Cookie", adminCookie);
            expect(response.status).toBe(200);
        });

        test("IPR3.2 Error on selling more than available stock", async () => {
            const response = await request(app).patch(`${baseURL}/${testProduct.model}/sell`).send({ quantity: 100 }).set("Cookie", adminCookie);
            expect(response.status).toBe(409);
        });

        test("IPR3.3 Error if model does not represent a product in the database", async () => {
            const response = await request(app).patch(`${baseURL}/nonExistingModel/sell`).send(testProductSell).set("Cookie", adminCookie);
            expect(response.status).toBe(404); 
        });
    
        test("IPR3.4 Error if sellingDate is after the current date", async () => {
            const futureDateSell = { ...testProductSell, sellingDate: "3024-07-01" }; 
            const response = await request(app).patch(`${baseURL}/${testProduct.model}/sell`).send(futureDateSell).set("Cookie", adminCookie);
            expect(response.status).toBe(400); 
        });
    
        test("IPR3.5 Error if sellingDate is before the product's arrivalDate", async () => {
            const pastDateSell = { ...testProductSell, sellingDate: "2023-04-01" }; 
            const response = await request(app).patch(`${baseURL}/${testProduct.model}/sell`).send(pastDateSell).set("Cookie", adminCookie);
            expect(response.status).toBe(400);
        });
    
    
    });

    describe("IPR4 GET /ezelectronics/products", () => {
        test("IPR4.1 Retrieve all products", async () => {
            const response = await request(app).get(baseURL).set("Cookie", adminCookie);
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.length).toBeGreaterThan(0);
        });

        test("IPR4.2 Retrieve available products filtered by category", async () => {
            const response = await request(app).get(`${baseURL}/?grouping=category&category=Smartphone&`).set("Cookie", adminCookie);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });

        test("IPR4.3 Return 422 if grouping is null and any of category or model is not null", async () => {
            const response1 = await request(app).get(`${baseURL}/?category=Smartphone`).set("Cookie", adminCookie);
            expect(response1.status).toBe(422);
            const response2 = await request(app).get(`${baseURL}/?model=iPhone13`).set("Cookie", adminCookie);
            expect(response2.status).toBe(422);
            const response3 = await request(app).get(`${baseURL}/?category=Smartphone&model=iPhone13`).set("Cookie", adminCookie);
            expect(response3.status).toBe(422);
        });
    
        test("IPR4.4 Return 422 if grouping is category and category is null or model is not null", async () => {
            const response1 = await request(app).get(`${baseURL}/?grouping=category`).set("Cookie", adminCookie);
            expect(response1.status).toBe(422);
            const response2 = await request(app).get(`${baseURL}/?grouping=category&model=iPhone13`).set("Cookie", adminCookie);
            expect(response2.status).toBe(422);
            const response3 = await request(app).get(`${baseURL}/?grouping=category&category=null`).set("Cookie", adminCookie);
            expect(response3.status).toBe(422);
        });

        test("IPR4.5 Return 422 if grouping is model and model is null or category is not null", async () => {
            const response1 = await request(app).get(`${baseURL}/?grouping=model`).set("Cookie", adminCookie);
            expect(response1.status).toBe(422);
            const response2 = await request(app).get(`${baseURL}/?grouping=model&category=Smartphone`).set("Cookie", adminCookie);
            expect(response2.status).toBe(422);
            const response3 = await request(app).get(`${baseURL}/?grouping=model`).set("Cookie", adminCookie);
            expect(response3.status).toBe(422);
        });
    
    
    });

    describe("IPR5 GET /ezelectronics/products/available", () => {
        test("IPR5.1 Retrieve all available products", async () => {
            const response = await request(app).get(`${baseURL}/available`).set("Cookie", adminCookie);
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.length).toBeGreaterThan(0);
        });

        test("IPR5.2 Retrieve available products by model", async () => {
            const response = await request(app).get(baseURL).send(Category.SMARTPHONE).set("Cookie", adminCookie);
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

        test("IPR5.3 Return 422 if grouping is null and any of category or model is not null", async () => {
            const response1 = await request(app).get(`${baseURL}/available?category=Smartphone`).set("Cookie", adminCookie);
            expect(response1.status).toBe(422);
            const response2 = await request(app).get(`${baseURL}/available?model=iPhone13`).set("Cookie", adminCookie);
            expect(response2.status).toBe(422);
            const response3 = await request(app).get(`${baseURL}/available?category=Smartphone&model=iPhone13`).set("Cookie", adminCookie);
            expect(response3.status).toBe(422);
        });
    
        test("IPR5.4 Return 422 if grouping is category and category is null or model is not null", async () => {
            const response1 = await request(app).get(`${baseURL}/available?grouping=category`).set("Cookie", adminCookie);
            expect(response1.status).toBe(422);
            const response2 = await request(app).get(`${baseURL}/available?grouping=category&model=iPhone13`).set("Cookie", adminCookie);
            expect(response2.status).toBe(422);
            const response3 = await request(app).get(`${baseURL}/available?grouping=category&category=null`).set("Cookie", adminCookie);
            expect(response3.status).toBe(422);
        });
     
        test("IPR5.5 Return 404 if model does not represent a product in the database (only when grouping is model)", async () => {
            const response = await request(app).get(`${baseURL}/available?grouping=model&model=NonExistentModel`).set("Cookie", adminCookie);
            expect(response.status).toBe(404);
        });

        test("IPR5.6 Return 422 if grouping is model and model is null or category is not null", async () => {
            const response1 = await request(app).get(`${baseURL}/available?grouping=model`).set("Cookie", adminCookie);
            expect(response1.status).toBe(422);
            const response2 = await request(app).get(`${baseURL}/available?grouping=model&category=Smartphone`).set("Cookie", adminCookie);
            expect(response2.status).toBe(422);
            const response3 = await request(app).get(`${baseURL}/available?grouping=model`).set("Cookie", adminCookie);
            expect(response3.status).toBe(422);
        });
    });

  
    describe("IPR6 DELETE /ezelectronics/products/:model", () => {
        test("IPR6.1 Success - delete an existing product", async () => {
            const response = await request(app)
                .delete(`${baseURL}/${testModel}`)
                .set("Cookie", adminCookie);
            
            expect(response.status).toBe(200);
    
            // Verifica che il prodotto sia effettivamente stato cancellato
            const checkResponse = await request(app)
                .get(`${baseURL}/${testModel}`)
                .set("Cookie", adminCookie);
            
            expect(checkResponse.status).toBe(404);
        });
    
        test("IPR6.2 Error - try to delete a non-existing product", async () => {
            const nonExistentModel = 'nonExistentModel';
            const response = await request(app)
                .delete(`${baseURL}/${nonExistentModel}`)
                .set("Cookie", adminCookie);
            
            expect(response.status).toBe(404);
        });

        test("IPR6.3 Error - try to delete a model that does not represent a product in the database", async () => {
            const response = await request(app)
                .delete(`${baseURL}/nonExistingModel`)
                .set("Cookie", adminCookie);
            
            expect(response.status).toBe(404);
        });
    });
     
    describe("IPR7 DELETE /ezelectronics/products", () => {
        test('IPR7.1 - should delete all products when user is admin or manager', async () => {
            const response = await request(app)
                .delete('/ezelectronics/products')
                .set('Cookie', adminCookie);
    
            expect(response.status).toBe(200);
        });

        test('IPR7.2 - should return 403 Forbidden if user is not authenticated as admin or manager', async () => {
            const response = await request(app)
                .delete('/ezelectronics/products');
    
            expect(response.status).toBe(401);
        });
    });
   
});