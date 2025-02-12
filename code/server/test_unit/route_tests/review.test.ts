import { expect, jest } from "@jest/globals"
import request from 'supertest'
import express from 'express';
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from '../../src/testUtilities'
import { ExistingReviewError, NoReviewProductError } from "../../src/errors/reviewError";
import { ProductNotFoundError } from "../../src/errors/productError"
import ReviewController from "../../src/controllers/reviewController";
import Authenticator from "../../src/routers/auth";
import { ProductReview } from "../../src/components/review";
jest.mock('../../src/controllers/reviewController');


const baseURL = "/ezelectronics"
let app: express.Application;

describe("URR1 - POST /ezelectronics/reviews/:model", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    it("URR1.1 - Not Logged - 401 error code", async () => {
        spyNotLogged();
        enableMockedAuth(app)
        jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValue();

        const testReview = {
            score: 5,
            comment: "A very cool smartphone!"
        }
        const model = 'iPhone13';
        const response = await request(app)
            .post(`${baseURL}/reviews/${model}`)
            .send(testReview)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(0);

    });

    it("URR1.2 - Customer - 200 success code", async () => {
        const testLoggedUser = spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValue();

        const testReview = {
            score: 5,
            comment: "A very cool smartphone!"
        }
        const model = 'iPhone13';
        const response = await request(app)
            .post(`${baseURL}/reviews/${model}`)
            .send(testReview)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledWith(
            model,
            testLoggedUser,
            testReview.score,
            testReview.comment
        );

    });

    it("URR1.3 - Manager - 401 error code", async () => {
        spyManager();
        enableMockedAuth(app)
        jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValue();

        const testReview = {
            score: 5,
            comment: "A very cool smartphone!"
        }
        const model = 'iPhone13';
        const response = await request(app)
            .post(`${baseURL}/reviews/${model}`)
            .send(testReview)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(0);

    });
    it("URR1.4 - Admin - 401 error code", async () => {
        spyAdmin();
        enableMockedAuth(app)
        jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValue();

        const testReview = {
            score: 5,
            comment: "A very cool smartphone!"
        }
        const model = 'iPhone13';
        const response = await request(app)
            .post(`${baseURL}/reviews/${model}`)
            .send(testReview)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(0);

    });
    it("URR1.5 - Customer - score < 1 - 422 error code", async () => {
        const testLoggedUser = spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValue();

        const testReview = {
            score: 0,
            comment: "A very cool smartphone!"
        }
        const model = 'iPhone13';
        const response = await request(app)
            .post(`${baseURL}/reviews/${model}`)
            .send(testReview)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(422);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(0);
    });
    it("URR1.6 - Customer - score > 5 - 422 error code", async () => {
        const testLoggedUser = spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValue();

        const testReview = {
            score: 6,
            comment: "A very cool smartphone!"
        }
        const model = 'iPhone13';
        const response = await request(app)
            .post(`${baseURL}/reviews/${model}`)
            .send(testReview)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(422);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(0);
    });
    it("URR1.7 - Customer - empty comment - 422 error code", async () => {
        const testLoggedUser = spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValue();

        const testReview = {
            score: 1,
            comment: ""
        }
        const model = 'iPhone13';
        const response = await request(app)
            .post(`${baseURL}/reviews/${model}`)
            .send(testReview)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(422);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(0);
    });
    it("URR1.8 - Customer - Already existing review for the product made by the customer - 409 error code", async () => {
        const testLoggedUser = spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "addReview").mockImplementation(() => {
            return Promise.reject(new ExistingReviewError());
        });

        const testReview = {
            score: 5,
            comment: "A very cool smartphone!"
        }
        const model = 'iPhone13';
        const response = await request(app)
            .post(`${baseURL}/reviews/${model}`)
            .send(testReview)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(409);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledWith(
            model,
            testLoggedUser,
            testReview.score,
            testReview.comment
        );
    });
    it("URR1.9 - Customer - model does not represent an existing product in the database - 404 error code", async () => {
        const testLoggedUser = spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "addReview").mockImplementation(() => {
            return Promise.reject(new ProductNotFoundError());
        });

        const testReview = {
            score: 5,
            comment: "A very cool smartphone!"
        }
        const model = 'iPhone12';
        const response = await request(app)
            .post(`${baseURL}/reviews/${model}`)
            .send(testReview)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(404);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledWith(
            model,
            testLoggedUser,
            testReview.score,
            testReview.comment
        );
    });
});

describe("URR2 - GET /ezelectronics/reviews/:model", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    it("URR2.1 - Not Logged - 401 error code", async () => {
        spyNotLogged();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValue([new ProductReview("test", "test", 1, "test", "test")]);

        const model = 'iPhone13';
        const response = await request(app)
            .get(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledTimes(0);

    });
    it("URR2.2 - Customer - 200 success code", async () => {
        spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValue([new ProductReview("test", "test", 1, "test", "test")]);

        const model = 'iPhone13';
        const response = await request(app)
            .get(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledWith(
            model
        );
    });
    it("URR2.3 - Manager - 200 success code", async () => {
        spyManager();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValue([new ProductReview("test", "test", 1, "test", "test")]);

        const model = 'iPhone13';
        const response = await request(app)
            .get(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledWith(
            model
        );
    });
    it("URR2.4 - Admin - 200 success code", async () => {
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValue([new ProductReview("test", "test", 1, "test", "test")]);

        const model = 'iPhone13';
        const response = await request(app)
            .get(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledWith(
            model
        );
    });
    it("URR2.5 - Admin - model does not represent an existing product in the database - 404 error code", async () => {
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValue([]);

        const model = 'iPhone13';
        const response = await request(app)
            .get(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledWith(
            model
        );
    });

});

describe("URR3 - DELETE /ezelectronics/reviews/:model", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });


    it("URR3.1 - Not Logged - 401 error code", async () => {
        spyNotLogged();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReview").mockResolvedValue();

        const model = 'iPhone13';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledTimes(0);

    });
    it("URR3.2 - Customer - 200 success code", async () => {
        const testLoggedUser = spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReview").mockResolvedValue();

        const model = 'iPhone13';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledWith(
            model,
            testLoggedUser
        );

    });
    it("URR3.3 - Manager - 401 error code", async () => {
        spyManager();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReview").mockResolvedValue();

        const model = 'iPhone13';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledTimes(0);

    });
    it("URR3.4 - Admin - 401 error code", async () => {
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReview").mockResolvedValue();

        const model = 'iPhone13';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledTimes(0);

    });
    it("URR3.5 - Customer - model does not represent an existing product in the database - 404 error code", async () => {
        const testLoggedUser = spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReview").mockImplementation((model, user) => {
            return Promise.reject(new ProductNotFoundError());
        });

        const model = 'iPhone13';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(404);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledWith(
            model,
            testLoggedUser
        );

    });
    it("URR3.6 - Customer - user does not have review for the product identified by model - 404 error code", async () => {
        const testLoggedUser = spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReview").mockImplementation((model, user) => {
            return Promise.reject(new NoReviewProductError());
        });

        const model = 'iPhone13';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isCustomer).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(404);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledWith(
            model,
            testLoggedUser
        );

    });

});


describe("URR4 - DELETE /ezelectronics/reviews/:model/all", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });


    it("URR4.1 - Not Logged - 401 error code", async () => {
        spyNotLogged();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValue();

        const model = 'iPhone13';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}/all`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
        expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(0);

    });
    it("URR4.2 - Customer - 401 error code", async () => {
        spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValue();

        const model = 'iPhone13';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}/all`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
        expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(0);

    });
    it("URR4.3 - Manager - 200 success code", async () => {
        spyManager();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValue();

        const model = 'iPhone13';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}/all`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith(
            model
        );

    });
    it("URR4.4 - Admin - 200 success code", async () => {
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValue();

        const model = 'iPhone13';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}/all`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith(
            model
        );

    });
    it("URR4.5 - Admin - model does not represent an existing product in the database - 404 error code", async () => {
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockImplementation((model) => {
            return Promise.reject(new ProductNotFoundError());
        });

        const model = 'iPhone13';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}/all`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(404);
        expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith(
            model
        );
    });

});

describe("URR5 - DELETE /ezelectronics/reviews", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    it("URR5.1 - Not Logged - 401 error code", async () => {
        spyNotLogged();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValue();

        const response = await request(app)
            .delete(`${baseURL}/reviews`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
        expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledTimes(0);

    });
    it("URR5.2 - Customer - 401 error code", async () => {
        spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValue();

        const response = await request(app)
            .delete(`${baseURL}/reviews`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
        expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledTimes(0);
    });
    it("URR5.3 - Manager - 200 success code", async () => {
        spyManager();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValue();

        const response = await request(app)
            .delete(`${baseURL}/reviews`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledWith();
    });
    it("URR5.4 - Admin - 200 success code", async () => {
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValue();

        const response = await request(app)
            .delete(`${baseURL}/reviews`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledWith();
    });
    it("URR5.5 - Admin - db error", async () => {
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockRejectedValue(new Error());

        const response = await request(app)
            .delete(`${baseURL}/reviews`)
            .set('Content-Type', 'application/json');

        expect(Authenticator.prototype.isAdminOrManager).toHaveBeenCalledTimes(1);
        expect(response.status).not.toBe(200);
        expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledWith();
    });
});


