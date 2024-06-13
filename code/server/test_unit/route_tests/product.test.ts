import { expect, jest } from "@jest/globals"
import request from 'supertest';
import express from 'express';
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from '../../src/testUtilities';
import ProductController from "../../src/controllers/productController";
import Authenticator from "../../src/routers/auth";
import { Product,Category } from "../../src/components/product";
import ErrorHandler from "../../src/helper";

jest.mock('../../src/controllers/productController');

const baseURL = "/ezelectronics";
let app: express.Application;

describe("ProductRoutes", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    describe("UPR1 - POST /ezelectronics/products", () => {

        it("UPR1.1 - Admin - 200 success code", async () => {
            spyAdmin();
            enableMockedAuth(app);
            
            const testProduct = {
                model: "GalaxyS21",
                category: "Smartphone",
                quantity: 10,
                details: "Latest model",
                sellingPrice: 999.99,
                arrivalDate: "2023-01-01"
            };
    
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValue();
    
            const response = await request(app)
                .post(`${baseURL}/products`)
                .send(testProduct)
                .set('Content-Type', 'application/json');
    
            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(1);
            expect(ProductController.prototype.registerProducts).toHaveBeenCalledWith(
                testProduct.model,
                testProduct.category,
                testProduct.quantity,
                testProduct.details,
                testProduct.sellingPrice,
                testProduct.arrivalDate
            );
        });
    
        it("UPR1.2 - Manager - 200 success code", async () => {
            spyManager();
            enableMockedAuth(app);
            
            const testProduct = {
                model: "GalaxyS21",
                category: "Smartphone",
                quantity: 10,
                details: "Latest model",
                sellingPrice: 999.99,
                arrivalDate: "2023-01-01"
            };
    
            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValue();
    
            const response = await request(app)
                .post(`${baseURL}/products`)
                .send(testProduct)
                .set('Content-Type', 'application/json');
    
            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(1);
            expect(ProductController.prototype.registerProducts).toHaveBeenCalledWith(
                testProduct.model,
                testProduct.category,
                testProduct.quantity,
                testProduct.details,
                testProduct.sellingPrice,
                testProduct.arrivalDate
            );
        });
    
        it("UPR1.3 - Not Logged - 401 error code", async () => {
            spyNotLogged();
            enableMockedAuth(app);
    
            const testProduct = {
                model: "GalaxyS21",
                category: "Smartphone",
                quantity: 10,
                details: "Latest model",
                sellingPrice: 999.99,
                arrivalDate: "2023-01-01"
            };
    
            const response = await request(app)
                .post(`${baseURL}/products`)
                .send(testProduct)
                .set('Content-Type', 'application/json');
    
            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(401);
            expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(0);
        });
    
        it("UPR1.4 - should return 422 error code for missing product details", async () => {
            spyAdmin();
            enableMockedAuth(app);
    
            const incompleteProduct = {
                model: "GalaxyS21",
                // Missing category and other details
            };
    
            const response = await request(app)
                .post(`${baseURL}/products`)
                .send(incompleteProduct)
                .set('Content-Type', 'application/json');
    
            expect(response.status).toBe(422);
            expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(0);
        });

        it("UPR1.5 should return 503 error code Generic Error", async () => {
            spyAdmin();
            enableMockedAuth(app);
        
            const validProduct = {
                model: "GalaxyS21",
                category: "Smartphone",
                quantity: 10,
                details: "Latest model",
                sellingPrice: 999.99,
                arrivalDate: "2023-01-01"
            };
        
            jest.spyOn(ProductController.prototype, "registerProducts").mockRejectedValue(new Error('Generic error'));
        
            const response = await request(app)
            .post(`${baseURL}/products`)
            .send(validProduct)
            .set('Content-Type', 'application/json');

        
            expect(response.status).toBe(503);
            expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(1);
         });

        
    });
    
    describe("UPR2 - PATCH /ezelectronics/products/:model", () => {
    
        it("UPR2.1 - Admin - 200 success code", async () => {
            spyAdmin();
            enableMockedAuth(app);
            
            const testQuantityChange = {
                quantity: 5,
                changeDate: "2023-02-01"
            };
    
            const model = "GalaxyS21";
    
            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValue(15);
    
            const response = await request(app)
                .patch(`${baseURL}/products/${model}`)
                .send(testQuantityChange)
                .set('Content-Type', 'application/json');
    
            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledWith(
                model,
                testQuantityChange.quantity,
                testQuantityChange.changeDate
            );
            expect(response.body.quantity).toBe(15);
        });
    
        it("UPR2.2 - Manager - 200 success code", async () => {
            spyManager();
            enableMockedAuth(app);
            
            const testQuantityChange = {
                quantity: 5,
                changeDate: "2023-02-01"
            };
    
            const model = "GalaxyS21";
    
            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValue(15);
    
            const response = await request(app)
                .patch(`${baseURL}/products/${model}`)
                .send(testQuantityChange)
                .set('Content-Type', 'application/json');
    
            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledWith(
                model,
                testQuantityChange.quantity,
                testQuantityChange.changeDate
            );
            expect(response.body.quantity).toBe(15);
        });
    
        it("UPR2.3 - Not Logged - 401 error code", async () => {
            spyNotLogged();
            enableMockedAuth(app);
    
            const testQuantityChange = {
                quantity: 5,
                changeDate: "2023-02-01"
            };
    
            const model = "GalaxyS21";
    
            const response = await request(app)
                .patch(`${baseURL}/products/${model}`)
                .send(testQuantityChange)
                .set('Content-Type', 'application/json');
    
            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(401);
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledTimes(0);
        });

        it("UPR2.4 - should return 422 error code for missing product details", async () => {
            spyAdmin();
            enableMockedAuth(app);
            
            const invalidProductDetails = {
                // Missing 'quantity' and 'changeDate'
            };
            const model = "GalaxyS21";
    
            const response = await request(app)
                .patch(`${baseURL}/products/${model}`)
                .send(invalidProductDetails)
                .set('Content-Type', 'application/json');
    
            expect(response.status).toBe(422);
        });

        it("UPR2.5 - should return 503 error code Generic Error", async () => {
            spyAdmin();
            enableMockedAuth(app);
    
            const testQuantityChange = {
                quantity: 5,
                changeDate: "2023-02-01"
            };
    
            const model = "GalaxyS21";
    
            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockRejectedValue(new Error('Generic Error'));
    
            const response = await request(app)
            .patch(`${baseURL}/products/${model}`)
            .send(testQuantityChange)
            .set('Content-Type', 'application/json');
    
            expect(response.status).toBe(503);
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
           });
    
    });
    
    describe("UPR3 - PATCH /ezelectronics/products/:model/sell", () => {
    
        it("UPR3.1 - Admin - 200 success code", async () => {
            spyAdmin();
            enableMockedAuth(app);
    
            const testSale = {
                quantity: 3,
                sellingDate: "2023-03-01"
            };
    
            const model = "GalaxyS21";
    
            jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValue(7);
    
            const response = await request(app)
                .patch(`${baseURL}/products/${model}/sell`)
                .send(testSale)
                .set('Content-Type', 'application/json');
    
            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1);
            expect(ProductController.prototype.sellProduct).toHaveBeenCalledWith(
                model,
                testSale.quantity,
                testSale.sellingDate
            );
            
        });
    
        it("UPR3.2 - Manager - 200 success code", async () => {
            spyManager();
            enableMockedAuth(app);
    
            const testSale = {
                quantity: 3,
                sellingDate: "2023-03-01"
            };
    
            const model = "GalaxyS21";
    
            jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValue(7);
    
            const response = await request(app)
                .patch(`${baseURL}/products/${model}/sell`)
                .send(testSale)
                .set('Content-Type', 'application/json');
    
            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1);
            expect(ProductController.prototype.sellProduct).toHaveBeenCalledWith(
                model,
                testSale.quantity,
                testSale.sellingDate
            );
        });
    
        it("UPR3.3 - Not Logged - 401 error code", async () => {
            spyNotLogged();
            enableMockedAuth(app);
    
            const testSale = {
                quantity: 3,
                sellingDate: "2023-03-01"
            };
    
            const model = "GalaxyS21";
    
            const response = await request(app)
                .patch(`${baseURL}/products/${model}/sell`)
                .send(testSale)
                .set('Content-Type', 'application/json');
    
            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(401);
            expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(0);
        });
        
        it("UPR3.4 - should return 422 error code if quantity is less than 1", async () => {
            spyAdmin();
            enableMockedAuth(app);
    
            const testSale = {
                quantity: 0, // Setting quantity less than 1
                sellingDate: "2023-03-01"
            };
    
            const model = "GalaxyS21";
    
            const response = await request(app)
                .patch(`${baseURL}/products/${model}/sell`)
                .send(testSale)
                .set('Content-Type', 'application/json');
    
            expect(response.status).toBe(422);
        });
    

         it("UPR3.5 - should return 503 error code Generic Error", async () => {
                spyAdmin();
                enableMockedAuth(app);
        
                const testSale = {
                    quantity: 3,
                    sellingDate: "2023-03-01"
                };
        
                const model = "GalaxyS21";
        
                jest.spyOn(ProductController.prototype, "sellProduct").mockRejectedValue(new Error('Generic error'));
        
                const response = await request(app)
                .patch(`${baseURL}/products/${model}/sell`)
                .send(testSale)
                .set('Content-Type', 'application/json');
        
                expect(response.status).toBe(503);
                expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1);
            });
        
    });
        
        describe("UPR4 GET /ezelectronics/products", () => {
            beforeEach(() => {
                jest.clearAllMocks(); // Pulisce tutti i mock prima di ciascun test
                app = initMockedApp(); // Inizializza l'applicazione mockata
            });
        
            it("UPR4.1 should return products for Admin with 200 success code", async () => {
                spyAdmin();
                enableMockedAuth(app); 
        
                const testQuery = {
                    grouping: "category",
                    category: "Smartphone"
                };
        
                const testProducts = [
                    new Product(999, 'Model1', Category.SMARTPHONE, '2024-05-31', 'Details1', 10),
                    new Product(899, 'Model2', Category.LAPTOP, '2024-06-01', 'Details2', 15),
                ];
        
                jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValue(testProducts);
        
                const response = await request(app)
                    .get(`${baseURL}/products`)
                    .query(testQuery)
                    .set('Content-Type', 'application/json');
        
                expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
                expect(response.status).toBe(200);
                expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1);
                expect(ProductController.prototype.getProducts).toHaveBeenCalledWith(
                    testQuery.grouping,
                    testQuery.category,
                    undefined
                );
                expect(response.body).toEqual(testProducts);
            });
        
            it("UPR4.2 should return products for Manager with 200 success code", async () => {
                spyManager();
                enableMockedAuth(app);
        
                const testQuery = {
                    grouping: "category",
                    category: "Smartphone"
                };
        
                const testProducts = [
                    new Product(999, 'Model1', Category.SMARTPHONE, '2024-05-31', 'Details1', 10),
                    new Product(899, 'Model2', Category.LAPTOP, '2024-06-01', 'Details2', 15),
                ];
        
                jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValue(testProducts);
        
                const response = await request(app)
                    .get(`${baseURL}/products`)
                    .query(testQuery)
                    .set('Content-Type', 'application/json');
        
                expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
                expect(response.status).toBe(200);
                expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1);
                expect(ProductController.prototype.getProducts).toHaveBeenCalledWith(
                    testQuery.grouping,
                    testQuery.category,
                    undefined
                );
                expect(response.body).toEqual(testProducts);
            });
        
            it("UPR4.3 should return 401 error code when user is not logged in", async () => {
                spyNotLogged();
                enableMockedAuth(app);
        
                const testQuery = {
                    grouping: "category",
                    category: "Smartphone"
                };
        
                const response = await request(app)
                    .get(`${baseURL}/products`)
                    .query(testQuery)
                    .set('Content-Type', 'application/json');
        
                expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
                expect(response.status).toBe(401);
                expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(0);
            });
        });
        
        describe("UPR5 GET /ezelectronics/products/available", () => {
            it("UPR5.1 Logged User - 200 success code", async () => {
                spyCustomer();
                enableMockedAuth(app);
        
                const testQuery = {
                    grouping: "category",
                    category: "Smartphone"
                };
        
                const testProducts = [
                    new Product(999, 'Model1', Category.SMARTPHONE, '2024-05-31', 'Details1', 10),
                    new Product(899, 'Model2', Category.LAPTOP, '2024-06-01', 'Details2', 15),
                ];
        
                jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValue(testProducts);
        
                const response = await request(app)
                    .get(`${baseURL}/products/available`)
                    .query(testQuery)
                    .set('Content-Type', 'application/json');
        
                expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
                expect(response.status).toBe(200);
                expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
                expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledWith(
                    testQuery.grouping,
                    testQuery.category,
                    undefined
                );
                expect(response.body).toEqual(testProducts);
            });
        
            it("UPR5.2 Not Logged - 401 error code", async () => {
                spyNotLogged();
                enableMockedAuth(app);
        
                const testQuery = {
                    grouping: "category",
                    category: "Smartphone"
                };
        
                const response = await request(app)
                    .get(`${baseURL}/products/available`)
                    .query(testQuery)
                    .set('Content-Type', 'application/json');
        
                expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
                expect(response.status).toBe(401);
                expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledTimes(0);
            });

        });
        
        describe("UPR6 DELETE /ezelectronics/products", () => {
            it("UPR6.1 Admin - 200 success code", async () => {
                spyAdmin();
                enableMockedAuth(app);
        
                jest.spyOn(ProductController.prototype, "deleteAllProducts").mockResolvedValue(true);
        
                const response = await request(app)
                    .delete(`${baseURL}/products`)
                    .set('Content-Type', 'application/json');
        
                expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
                expect(response.status).toBe(200);
                expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalledTimes(1);
            });
        
            it("UPR6.2 Manager - 200 success code", async () => {
                spyManager();
                enableMockedAuth(app);
        
                jest.spyOn(ProductController.prototype, "deleteAllProducts").mockResolvedValue(true);
        
                const response = await request(app)
                    .delete(`${baseURL}/products`)
                    .set('Content-Type', 'application/json');
        
                expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
                expect(response.status).toBe(200);
                expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalledTimes(1);
            });
        
            it("UPR6.3 Not Logged - 401 error code", async () => {
                spyNotLogged();
                enableMockedAuth(app);
        
                const response = await request(app)
                    .delete(`${baseURL}/products`)
                    .set('Content-Type', 'application/json');
        
                expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
                expect(response.status).toBe(401);
                expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalledTimes(0);
            });
        
            it("UPR6.4 Generic controller error should return 503 error code", async () => {
                spyAdmin();
                enableMockedAuth(app);
        
                jest.spyOn(ProductController.prototype, "deleteAllProducts").mockRejectedValue(new Error('Generic error'));
        
                const response = await request(app)
                    .delete(`${baseURL}/products`)
                    .set('Content-Type', 'application/json');
        
                expect(response.status).toBe(503);
                expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalledTimes(1);
            });
        });
        
        describe("UPR7 DELETE /ezelectronics/products/:model", () => {
            it("UPR7.1 Admin - 200 success code", async () => {
                spyAdmin();
                enableMockedAuth(app);
        
                const model = "GalaxyS21";
        
                jest.spyOn(ProductController.prototype, "deleteProduct").mockResolvedValue(true);
        
                const response = await request(app)
                    .delete(`${baseURL}/products/${model}`)
                    .set('Content-Type', 'application/json');
        
                expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
                expect(response.status).toBe(200);
                expect(ProductController.prototype.deleteProduct).toHaveBeenCalledTimes(1);
                expect(ProductController.prototype.deleteProduct).toHaveBeenCalledWith(model);
            });
        
            it("UPR7.2 Manager - 200 success code", async () => {
                spyManager();
                enableMockedAuth(app);
        
                const model = "GalaxyS21";
        
                jest.spyOn(ProductController.prototype, "deleteProduct").mockResolvedValue(true);
        
                const response = await request(app)
                    .delete(`${baseURL}/products/${model}`)
                    .set('Content-Type', 'application/json');
        
                expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
                expect(response.status).toBe(200);
                expect(ProductController.prototype.deleteProduct).toHaveBeenCalledTimes(1);
                expect(ProductController.prototype.deleteProduct).toHaveBeenCalledWith(model);
            });
        
            it("UPR7.3 Not Logged - 401 error code", async () => {
                spyNotLogged();
                enableMockedAuth(app);
        
                const model = "GalaxyS21";
        
                const response = await request(app)
                    .delete(`${baseURL}/products/${model}`)
                    .set('Content-Type', 'application/json');
        
                expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
                expect(response.status).toBe(401);
                expect(ProductController.prototype.deleteProduct).toHaveBeenCalledTimes(0);
            });   
        
            it("UPR7.4 Generic error - 404 error code", async () => {
                // Simula un errore generico nel metodo deleteAllProducts
                jest.spyOn(ProductController.prototype, "deleteAllProducts").mockRejectedValue(new Error('Generic error'));
            
                const response = await request(app)
                    .delete(`${baseURL}/products`)
                    .set('Content-Type', 'application/json');
                    expect(response.status).toBe(404);
            });

        });
    });


