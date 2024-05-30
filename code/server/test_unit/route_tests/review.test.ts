import { test, expect, jest } from "@jest/globals"
import request from 'supertest'
import express from 'express';
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from './testUtilities'
import { ExistingReviewError, NoReviewProductError } from "../../src/errors/reviewError";
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
    it("Customer - model null - 404 error code", async () => {
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

        expect(response.status).toBe(404);
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
    it("Customer - null comment - 422 error code", async () => {
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
    it("Customer - Review already present - 409 error code", async () => {
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
});


