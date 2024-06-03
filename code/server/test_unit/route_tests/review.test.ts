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

describe("POST /ezelectronics/reviews/:model", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    it("Not Logged - 401 error code", async () => {
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

    it("Customer - 200 success code", async () => {
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

    it("Manager - 401 error code", async () => {
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
    it("Admin - 401 error code", async () => {
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
    it("Customer - model empty - 422 error code", async () => {
        spyAdmin();
        enableMockedAuth(app)
        jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValue();

        const testReview = {
            score: 5,
            comment: "A very cool smartphone!"
        }
        const model = '';
        const response = await request(app)
            .post(`${baseURL}/reviews/${model}`)
            .send(testReview)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(422);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(0);
    });
    it("Customer - score < 1 - 422 error code", async () => {
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
    it("Customer - score > 5 - 422 error code", async () => {
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
    it("Customer - empty comment - 422 error code", async () => {
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
    it("Customer - Already existing review for the product made by the customer - 409 error code", async () => {
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
    it("Customer - model does not represent an existing product in the database - 404 error code", async () => {
        const testLoggedUser = spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "addReview").mockImplementation(() => {
            return Promise.reject(new ProductNotFoundError());
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

describe("GET /ezelectronics/reviews/:model", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    it("Not Logged - 401 error code", async () => {
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
    it("Customer - 200 success code", async () => {
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
    it("Manager - 200 success code", async () => {
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
    it("Admin - 200 success code", async () => {
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
    it("Admin - model does not represent an existing product in the database - 404 error code", async () => {
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "getProductReviews").mockRejectedValue(new NoReviewProductError());

        const model = 'iPhone13';
        const response = await request(app)
            .get(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(404);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledTimes(1);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledWith(
            model
        );
    });
    it("Customer - model empty - 422 error code", async () => {
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "getProductReviews").mockRejectedValue(new NoReviewProductError());

        const model = '';
        const response = await request(app)
            .get(`${baseURL}/reviews/${model}`)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(422);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledTimes(0);
    });

});

describe("DELETE /ezelectronics/reviews/:model", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });


    it("Not Logged - 401 error code", async () => {
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
    it("Customer - 200 success code", async () => {
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
    it("Manager - 401 error code", async () => {
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
    it("Admin - 401 error code", async () => {
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
    it("Customer - model does not represent an existing product in the database - 404 error code", async () => {
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
    it("Customer - user does not have review for the product identified by model - 404 error code", async () => {
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


describe("DELETE /ezelectronics/reviews/:model/all", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });


    it("Not Logged - 401 error code", async () => {
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
    it("Customer - 401 error code", async () => {
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
    it("Manager - 200 success code", async () => {
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
    it("Admin - 200 success code", async () => {
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
    it("Admin - model does not represent an existing product in the database - 404 error code", async () => {
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
    it("Admin - model empty - 422 error code", async () => {
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValue();

        const model = '';
        const response = await request(app)
            .delete(`${baseURL}/reviews/${model}/all`)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(422);
        expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(0);
    });

});

describe("DELETE /ezelectronics/reviews", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    it("Not Logged - 401 error code", async () => {
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
    it("Customer - 401 error code", async () => {
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
    it("Manager - 200 success code", async () => {
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
    it("Admin - 200 success code", async () => {
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
    it("Admin - db error", async () => {
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


