import { expect, jest } from "@jest/globals"
import request from 'supertest';
import express from 'express';
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from '../../src/testUtilities';
import ProductController from "../../src/controllers/productController";
import Authenticator from "../../src/routers/auth";
import { Product,Category } from "../../src/components/product";

jest.mock('../../src/controllers/productController');

const baseURL = "/ezelectronics";
let app: express.Application;

describe("ProductRoutes", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    describe("POST /ezelectronics/products", () => {

        it("Admin/Manager - 200 success code", async () => {
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

        it("Not Logged - 401 error code", async () => {
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

    });

    describe("PATCH /ezelectronics/products/:model", () => {

        it("Admin/Manager - 200 success code", async () => {
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

        it("Not Logged - 401 error code", async () => {
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

    });

    describe("PATCH /ezelectronics/products/:model/sell", () => {

        it("Admin/Manager - 200 success code", async () => {
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
            expect(response.body.quantity).toBe(7);
        });

        it("Not Logged - 401 error code", async () => {
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

    });

   describe("GET /ezelectronics/products", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Pulisce tutti i mock prima di ciascun test
        app = initMockedApp(); // Inizializza l'applicazione mockata
    });

    it("should return products for Admin/Manager with 200 success code", async () => {
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

    it("should return 401 error code when user is not logged in", async () => {
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

    describe("GET /ezelectronics/products/available", () => {

        it("Logged User - 200 success code", async () => {
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

        it("Not Logged - 401 error code", async () => {
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
/*
    describe("DELETE /ezelectronics/products", () => {

        it("Admin/Manager - 200 success code", async () => {
            spyAdmin();
            enableMockedAuth(app);

            jest.spyOn(ProductController.prototype, "deleteAllProducts").mockResolvedValue();

            const response = await request(app)
                .delete(`${baseURL}/products`)
                .set('Content-Type', 'application/json');

            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalledTimes(1);
        });

        it("Not Logged - 401 error code", async () => {
            spyNotLogged();
            enableMockedAuth(app);

            const response = await request(app)
                .delete(`${baseURL}/products`)
                .set('Content-Type', 'application/json');

            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(401);
            expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalledTimes(0);
        });

    });

    describe("DELETE /ezelectronics/products/:model", () => {

        it("Admin/Manager - 200 success code", async () => {
            spyManager();
            enableMockedAuth(app);

            const model = "GalaxyS21";

            jest.spyOn(ProductController.prototype, "deleteProduct").mockResolvedValue();

            const response = await request(app)
                .delete(`${baseURL}/products/${model}`)
                .set('Content-Type', 'application/json');

            expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(ProductController.prototype.deleteProduct).toHaveBeenCalledTimes(1);
            expect(ProductController.prototype.deleteProduct).toHaveBeenCalledWith(model);
        });

        it("Not Logged - 401 error code", async () => {
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

    });
  */
});
