import { expect, jest } from '@jest/globals';
import request from 'supertest'
import ReviewController from '../src/controllers/reviewController';
import ReviewDAO from '../src/dao/reviewDAO';
import { User, Role } from '../src/components/user';
import { ProductNotFoundError } from '../src/errors/productError';
import { ExistingReviewError, NoReviewProductError } from '../src/errors/reviewError';
import { cleanup, cleanupDB } from '../src/db/cleanup';
import db from "../src/db/db"
import { app } from "../index"

let reviewDAO: ReviewDAO;
let reviewController: ReviewController;

const testScore = 5;
const testComment = 'A very cool smartphone!';
const testUser = new User('MarioRossi',
    'Mario',
    'Rossi',
    Role.CUSTOMER,
    '',
    ''
);
const testModel = 'iPhone13';

const addProduct = async (model: String) => {
    const sqlProduct = "INSERT INTO products(model) VALUES(?)"
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sqlProduct, [model], (err) => {
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

const removeProduct = async () => {
    const sql = "DELETE FROM products";
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sql, [], (err) => {
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

const setupDB = async () => {
    const sqlUser = "INSERT INTO users(username, name, surname, role) VALUES(?, ?, ?, ?)"
    const sqlProduct = "INSERT INTO products(model) VALUES(?)"

    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sqlUser, [testUser.username, testUser.name, testUser.surname, testUser.role], (err) => {
                if (err) {
                    return reject(err);
                }
                db.run(sqlProduct, [testModel], (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        } catch (error) {
            reject(error);
        }

    });
}

describe('Integration DAO - DB', () => {

    beforeAll(async () => {
        cleanup();
        await setupDB();
    });

    describe('IRD1 - addReview', () => {

        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
        });

        it("IRD1.1 -Success - void", async () => {

            await expect(reviewDAO.addReview(testModel, testUser, testScore, testComment)).resolves.toBe(undefined);
        });

        it("IRD1.2 - Error - ExistingReviewError", async () => {

            await expect(reviewDAO.addReview(testModel, testUser, testScore, testComment)).rejects.toThrowError(ExistingReviewError);
        });

    });

    describe("IRD2 - getProductReviews", () => {

        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
        });

        it("IRD2.1 - Success - ProductReview[] not empty", async () => {
            const result = await reviewDAO.getProductReviews(testModel);
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            expect(result[0].model).toBe(testModel);
            expect(result[0].user).toBe(testUser.username);
            expect(result[0].score).toBe(testScore);
            expect(dateRegex.test(result[0].date)).toBe(true);
            expect(result[0].comment).toBe(testComment);
        });

    });

    describe("IRD3 - deleteReview", () => {
        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
        });

        it("IRD3.1 - Success - void", async () => {
            await expect(reviewDAO.deleteReview(testModel, testUser)).resolves.toBe(undefined);
        });

        it("IRD3.2 - Error - NoReviewProductError", async () => {
            await expect(reviewDAO.deleteReview(testModel, testUser)).rejects.toThrowError(NoReviewProductError);
        });

    });

    describe("IRD4 - deleteReviewsOfProduct", () => {

        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
        });

        it("IRD4.1 - Success - Product has reviews -  void", async () => {
            await expect(reviewDAO.deleteReviewsOfProduct(testModel)).resolves.toBe(undefined);
        });

    });

    describe("IRD5 - deleteAllReviews", () => {

        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
        });

        it("IRD5.1 - Success - Reviews present in db - void", async () => {
            await expect(reviewDAO.deleteAllReviews()).resolves.toBe(undefined);
        });

    });

    describe("IRD6 - productCheck", () => {

        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
        });

        it("IRD6.1 - Success - true", async () => {
            await expect(reviewDAO.productCheck(testModel)).resolves.toBe(true);
        });

        it("IRD6.2 - Error - ProductNotFoundError", async () => {
            await removeProduct();
            await expect(reviewDAO.productCheck(testModel)).rejects.toThrowError(ProductNotFoundError);
        });
    });

});

describe('Integration CONTROLLER - DAO - DB', () => {

    beforeAll(async () => {
        await cleanupDB();
        await setupDB();
    });

    describe("IRC1 - addReview", () => {

        beforeEach(async () => {
            reviewController = new ReviewController();
            reviewDAO = reviewController.reviewDAO;
        });

        it("IRC1.1 - 404 KO ProductNotFoundError - model does not represent an existing product in the database", async () => {

            const spyAddReview = jest.spyOn(reviewDAO, "addReview");
            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");

            await removeProduct();

            await expect(reviewController.addReview(testModel, testUser, testScore, testComment)).rejects.toThrowError(ProductNotFoundError);
            expect(reviewDAO.productCheck).toHaveBeenCalledTimes(1);
            expect(reviewDAO.productCheck).toHaveBeenCalledWith(
                testModel
            );
            expect(reviewDAO.addReview).toHaveBeenCalledTimes(0);

            spyAddReview.mockRestore();
            spyProductCheck.mockRestore();
        });

        it("IRC1.2 - 200 OK - model not empty", async () => {

            const spyAddReview = jest.spyOn(reviewController.reviewDAO, "addReview");
            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");

            await addProduct(testModel);
            await expect(reviewController.addReview(testModel, testUser, testScore, testComment)).resolves.toBe(undefined);

            expect(spyProductCheck).toHaveBeenCalledTimes(1);
            expect(spyProductCheck).toHaveBeenCalledWith(
                testModel
            );
            expect(spyAddReview).toHaveBeenCalledTimes(1);
            expect(spyAddReview).toHaveBeenCalledWith(
                testModel,
                testUser,
                testScore,
                testComment
            );

            spyAddReview.mockRestore();
            spyProductCheck.mockRestore();
        });

        it("IRC1.3 - 409 KO ExistingReviewError - Already existing review for the product made by the customer", async () => {

            const spyAddReview = jest.spyOn(reviewDAO, "addReview");
            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");

            await expect(reviewController.addReview(testModel, testUser, testScore, testComment)).rejects.toThrowError(ExistingReviewError);
            expect(reviewDAO.productCheck).toHaveBeenCalledTimes(1);
            expect(reviewDAO.productCheck).toHaveBeenCalledWith(
                testModel
            );
            expect(reviewDAO.addReview).toHaveBeenCalledTimes(1);
            expect(reviewDAO.addReview).toHaveBeenCalledWith(
                testModel, testUser, testScore, testComment
            );

            spyAddReview.mockRestore();
            spyProductCheck.mockRestore();
        });
    });

    describe("IRC2 - getProductReviews", () => {

        beforeEach(async () => {
            reviewController = new ReviewController();
            reviewDAO = reviewController.reviewDAO;
        });

        it("IRC2.1 - 200 OK - model not empty", async () => {

            const spyGetProductReviews = jest.spyOn(reviewDAO, "getProductReviews");


            const result = await reviewController.getProductReviews(testModel);
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            expect(result[0].model).toBe(testModel);
            expect(result[0].user).toBe(testUser.username);
            expect(result[0].score).toBe(testScore);
            expect(dateRegex.test(result[0].date)).toBe(true);
            expect(result[0].comment).toBe(testComment);

            expect(reviewDAO.getProductReviews).toHaveBeenCalledTimes(1);
            expect(reviewDAO.getProductReviews).toHaveBeenCalledWith(
                testModel
            );

            spyGetProductReviews.mockRestore();
        });

    });

    describe("IRC3 - deleteReview", () => {
        beforeEach(async () => {
            reviewController = new ReviewController();
            reviewDAO = reviewController.reviewDAO;
        });

        it("IRC3.1 - 200 OK - model not empty", async () => {

            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");
            const spyDeleteReview = jest.spyOn(reviewDAO, "deleteReview");

            await expect(reviewController.deleteReview(testModel, testUser)).resolves.toBe(undefined);
            expect(reviewDAO.productCheck).toBeCalledTimes(1);
            expect(reviewDAO.productCheck).toBeCalledWith(
                testModel
            );
            expect(reviewDAO.deleteReview).toBeCalledTimes(1);
            expect(reviewDAO.deleteReview).toBeCalledWith(
                testModel,
                testUser
            )

            spyProductCheck.mockRestore();
            spyDeleteReview.mockRestore();
        });

        it("IRC3.2 - 404 KO NoReviewProductError - current user does not have a review for the product identified by model", async () => {

            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");
            const spyDeleteReview = jest.spyOn(reviewDAO, "deleteReview");

            await expect(reviewController.deleteReview(testModel, testUser)).rejects.toThrowError(NoReviewProductError);
            expect(reviewDAO.productCheck).toBeCalledTimes(1);
            expect(reviewDAO.productCheck).toBeCalledWith(
                testModel
            );
            expect(reviewDAO.deleteReview).toBeCalledTimes(1);
            expect(reviewDAO.deleteReview).toBeCalledWith(
                testModel,
                testUser
            );

            spyProductCheck.mockRestore();
            spyDeleteReview.mockRestore();
        });


        it("IRC3.3 - 404 KO ProductNotFoundError - model does not represent an existing product in the database", async () => {

            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");
            const spyDeleteReview = jest.spyOn(reviewDAO, "deleteReview");

            await removeProduct();
            await expect(reviewController.deleteReview(testModel, testUser)).rejects.toThrowError(ProductNotFoundError);
            expect(reviewDAO.productCheck).toBeCalledTimes(1);
            expect(reviewDAO.productCheck).toBeCalledWith(
                testModel
            );
            expect(reviewDAO.deleteReview).toBeCalledTimes(0);

            spyProductCheck.mockRestore();
            spyDeleteReview.mockRestore();
        });

    });

    describe("IRC4 - deleteReviewsOfProduct", () => {
        beforeEach(async () => {
            reviewController = new ReviewController();
            reviewDAO = reviewController.reviewDAO;
        });

        it("IRC4.1 - 404 KO ProductNotFoundError - model does not represent an existing product in the database", async () => {
            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");
            const spyDeleteReviewsOfProduct = jest.spyOn(reviewDAO, "deleteReviewsOfProduct");

            await expect(reviewController.deleteReviewsOfProduct(testModel)).rejects.toThrowError(ProductNotFoundError);

            expect(reviewDAO.productCheck).toBeCalledTimes(1);
            expect(reviewDAO.productCheck).toBeCalledWith(
                testModel
            );
            expect(reviewDAO.deleteReviewsOfProduct).toBeCalledTimes(0);

            spyProductCheck.mockRestore();
            spyDeleteReviewsOfProduct.mockRestore();
        });

        it("IRC4.2 - 200 OK - model not empty", async () => {

            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");
            const spyDeleteReviewsOfProduct = jest.spyOn(reviewDAO, "deleteReviewsOfProduct");

            await addProduct(testModel);

            await expect(reviewController.deleteReviewsOfProduct(testModel)).resolves.toBe(undefined);

            expect(reviewDAO.productCheck).toBeCalledTimes(1);
            expect(reviewDAO.productCheck).toBeCalledWith(
                testModel
            );
            expect(reviewDAO.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);
            expect(reviewDAO.deleteReviewsOfProduct).toHaveBeenCalledWith(
                testModel
            );

            spyProductCheck.mockRestore();
            spyDeleteReviewsOfProduct.mockRestore();

        });

    });

    describe("IRC5 - deleteAllReviews", () => {
        beforeEach(async () => {
            reviewController = new ReviewController();
            reviewDAO = reviewController.reviewDAO;
        });

        it("IRC5.1 - 200 OK", async () => {

            const spyDeleteAllReviews = jest.spyOn(reviewDAO, "deleteAllReviews");

            await expect(reviewController.deleteAllReviews()).resolves.toBe(undefined);

            expect(reviewDAO.deleteAllReviews).toHaveBeenCalledTimes(1);
            expect(reviewDAO.deleteAllReviews).toHaveBeenCalledWith();
        });

    });


});

describe('Integration ROUTE - CONTROLLER - DAO - DB', () => {
    const baseURL = "/ezelectronics"
    //Default user information. We use them to create users and evaluate the returned values
    const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
    const customer2 = { username: "customer2", name: "customer2", surname: "customer2", password: "customer2", role: "Customer" }
    const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" }
    //Cookies for the users. We use them to keep users logged in. Creating them once and saving them in a variables outside of the tests will make cookies reusable
    let customerCookie: string
    let adminCookie: string

    //Helper function that creates a new user in the database.
    //Can be used to create a user before the tests or in the tests
    //Is an implicit test because it checks if the return code is successful
    const postUser = async (userInfo: any) => {
        await request(app)
            .post(`${baseURL}/users`)
            .send(userInfo)
            .expect(200)
    }

    //Helper function that logs in a user and returns the cookie
    //Can be used to log in a user before the tests or in the tests
    const login = async (userInfo: any) => {
        return new Promise<string>((resolve, reject) => {
            request(app)
                .post(`${baseURL}/sessions`)
                .send(userInfo)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res.header["set-cookie"][0])
                })
        })
    }



    beforeAll(async () => {
        await cleanupDB();
        await setupDB();
    });

    afterAll(async () => {
        await cleanup();
    })

    describe("IRR1 - Unhoutorized errors", () => {
        it("IRR1.1 - POST /ezelectronics/reviews/:model - Not Logged - 401 error code", async () => {

            const testReview = {
                score: testScore,
                comment: testComment
            }

            const response = await request(app)
                .post(`${baseURL}/reviews/${testModel}`)
                .send(testReview)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(401);
        });

        it("IRR1.2 - GET /ezelectronics/reviews/:model - Not Logged - 401 error code", async () => {

            const response = await request(app)
                .get(`${baseURL}/reviews/${testModel}`)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(401);
        });

        it("IRR1.3 - DELETE /ezelectronics/reviews/:model - Not Logged - 401 error code", async () => {

            const response = await request(app)
                .delete(`${baseURL}/reviews/${testModel}`)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(401);
        });

        it("IRR1.4 - DELETE /ezelectronics/reviews/:model/all - Not Logged - 401 error code", async () => {

            const response = await request(app)
                .delete(`${baseURL}/reviews/${testModel}/all`)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(401);

        });

        it("IRR1.5 - DELETE /ezelectronics/reviews - Not Logged - 401 error code", async () => {

            const response = await request(app)
                .delete(`${baseURL}/reviews`)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(401);

        });

    });

    describe("IRR2 - POST /ezelectronics/reviews/:model", () => {

        it("IRR2.1 - Customer - 200 success code", async () => {
            await postUser(customer)
            customerCookie = await login(customer)

            const testReview = {
                score: testScore,
                comment: testComment
            }
            const response = await request(app)
                .post(`${baseURL}/reviews/${testModel}`)
                .set("Cookie", customerCookie)
                .send(testReview)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
        });

        it("IRR2.2 - Customer - score < 1 - 422 error code", async () => {

            const testReview = {
                score: 0,
                comment: "A very cool smartphone!"
            }
            const response = await request(app)
                .post(`${baseURL}/reviews/${testModel}`)
                .set("Cookie", customerCookie)
                .send(testReview)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(422);
        });

        it("IRR2.3 - Customer - score > 5 - 422 error code", async () => {
            const testReview = {
                score: 6,
                comment: "A very cool smartphone!"
            }
            const response = await request(app)
                .post(`${baseURL}/reviews/${testModel}`)
                .set("Cookie", customerCookie)
                .send(testReview)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(422);
        });

        it("IRR2.4 - Customer - empty comment - 422 error code", async () => {

            const testReview = {
                score: 1,
                comment: ""
            }
            const response = await request(app)
                .post(`${baseURL}/reviews/${testModel}`)
                .set("Cookie", customerCookie)
                .send(testReview)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(422);
        });

        it("IRR2.5 - Customer - Already existing review for the product made by the customer - 409 error code", async () => {
            const testReview = {
                score: 5,
                comment: "A very cool smartphone!"
            }
            const response = await request(app)
                .post(`${baseURL}/reviews/${testModel}`)
                .set("Cookie", customerCookie)
                .send(testReview)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(409);
        });

        it("IRR2.6 - Customer - model does not represent an existing product in the database - 404 error code", async () => {
            const testReview = {
                score: 5,
                comment: "A very cool smartphone!"
            }
            const model = "iPhone12"
            const response = await request(app)
                .post(`${baseURL}/reviews/${model}`)
                .set("Cookie", customerCookie)
                .send(testReview)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);
        });
    });

    describe("IRR3 - GET /ezelectronics/reviews/:model", () => {
        it("IRR3.1 - Customer - 200 success code", async () => {

            const response = await request(app)
                .get(`${baseURL}/reviews/${testModel}`)
                .set("Cookie", customerCookie)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
        });

        it("IRR3.2 - Customer - model does not represent an existing product in the database - 200", async () => {

            const model = 'iPhone12';
            const response = await request(app)
                .get(`${baseURL}/reviews/${model}`)
                .set("Cookie", customerCookie)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual([]);
        });
    });

    describe("IRR4 - DELETE /ezelectronics/reviews/:model", () => {
        it("IRR4.1 - Customer - 200 success code", async () => {
            const response = await request(app)
                .delete(`${baseURL}/reviews/${testModel}`)
                .set("Cookie", customerCookie)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
        });

        it("IRR4.2 - Customer - user does not have review for the product identified by model - 404 error code", async () => {
            await postUser(customer2);
            const customerCookie2 = await login(customer2);
            const response = await request(app)
                .delete(`${baseURL}/reviews/${testModel}`)
                .set("Cookie", customerCookie2)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);

        });

        it("IRR4.3 - Customer - model does not represent an existing product in the database - 404 error code", async () => {
            const response = await request(app)
                .delete(`${baseURL}/reviews/${testModel}`)
                .set("Cookie", customerCookie)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);
        });

    });

    describe("IRR5 - DELETE /ezelectronics/reviews/:model/all", () => {
        it("IRR5.1 - Admin - 200 success code", async () => {
            await postUser(admin);
            adminCookie = await login(admin);

            const response = await request(app)
                .delete(`${baseURL}/reviews/${testModel}/all`)
                .set("Cookie", adminCookie)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
        });

        it("IRR5.2 - Admin - model does not represent an existing product in the database - 404 error code", async () => {

            const model = 'iPhone12';
            const response = await request(app)
                .delete(`${baseURL}/reviews/${model}/all`)
                .set("Cookie", adminCookie)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);
        });
    });

    describe("IRR6 - DELETE /ezelectronics/reviews", () => {
        it("IRR6.1 - Admin - 200 success code", async () => {
            const response = await request(app)
                .delete(`${baseURL}/reviews`)
                .set("Cookie", adminCookie)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
        });
    });
});