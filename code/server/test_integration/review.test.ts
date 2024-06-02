import { expect, jest } from '@jest/globals';

import ReviewController from '../src/controllers/reviewController';
import ReviewDAO from '../src/dao/reviewDAO';
import { User, Role } from '../src/components/user';
import { Category } from '../src/components/product';
import { ProductNotFoundError } from '../src/errors/productError';
import { ExistingReviewError, NoReviewProductError } from '../src/errors/reviewError';
import { ProductReview } from '../src/components/review';
import { cleanup, cleanupDB } from '../src/db/cleanup';
import db from "../src/db/db"

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
const testDate = new Date('2024-05-21').toISOString().split('T')[0];

const addReview = async () => {
    const sql = "INSERT INTO reviews(user, model, score, date, comment) VALUES(?, ?, ?, ?, ?)";
    await new Promise<void>((resolve, reject) => {
        db.run(sql, [testUser.username, testModel, testScore, testDate, testComment], (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

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
}

const setupDB = async () => {
    await cleanupDB();
    const sqlUser = "INSERT INTO users(username, name, surname, role) VALUES(?, ?, ?, ?)"
    const sqlProduct = "INSERT INTO products(model) VALUES(?)"

    await new Promise<void>((resolve, reject) => {
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
    });
}

describe('Integration DAO - DB', () => {

    afterAll(async () => {
        await cleanupDB();
    });

    describe('addReview', () => {

        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
            await setupDB();
        });

        it("Success - void", async () => {

            await expect(reviewDAO.addReview(testModel, testUser, testScore, testComment)).resolves.toBe(undefined);
        });

        it("Error - ExistingReviewError", async () => {

            await expect(reviewDAO.addReview(testModel, testUser, testScore, testComment)).resolves.toBe(undefined);
            await expect(reviewDAO.addReview(testModel, testUser, testScore, testComment)).rejects.toThrowError(ExistingReviewError);
        });

    });

    describe("getProductReviews", () => {

        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
            await setupDB();
        });

        it("Success - ProductReview[] not empty", async () => {
            await addReview();
            await expect(reviewDAO.getProductReviews(testModel)).resolves.toStrictEqual([new ProductReview(
                testModel,
                testUser.username,
                testScore,
                testDate,
                testComment
            )]);
        });

        it("Success - ProductReview[] empty", async () => {
            await expect(reviewDAO.getProductReviews(testModel)).resolves.toStrictEqual([]);
        });

    });

    describe("deleteReview", () => {

        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
            await setupDB();
        });

        it("Success - void", async () => {
            await addReview();
            await expect(reviewDAO.deleteReview(testModel, testUser)).resolves.toBe(undefined);
        });

        it("Error - NoReviewProductError", async () => {
            await expect(reviewDAO.deleteReview(testModel, testUser)).rejects.toThrowError(NoReviewProductError);
        });

    });

    describe("deleteReviewsOfProduct", () => {

        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
            await setupDB();
        });

        it("Success - Product has reviews -  void", async () => {
            await addReview();
            await expect(reviewDAO.deleteReviewsOfProduct(testModel)).resolves.toBe(undefined);
        });

        it("Success - Product does not have reviews -  void", async () => {
            await expect(reviewDAO.deleteReviewsOfProduct(testModel)).resolves.toBe(undefined);
        });

    });

    describe("deleteAllReviews", () => {

        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
            await setupDB();
        });

        it("Success - Reviews present in db - void", async () => {
            await addReview();
            await expect(reviewDAO.deleteAllReviews()).resolves.toBe(undefined);
        });

        it("Success - Reviews not present in db - void", async () => {
            await expect(reviewDAO.deleteAllReviews()).resolves.toBe(undefined);
        });

    });

    describe("productCheck", () => {

        beforeEach(async () => {
            reviewDAO = new ReviewDAO;
            await setupDB();
        });

        it("Success - true", async () => {
            await expect(reviewDAO.productCheck(testModel)).resolves.toBe(true);
        });

        it("Error - ProductNotFoundError", async () => {
            await removeProduct();
            await expect(reviewDAO.productCheck(testModel)).rejects.toThrowError(ProductNotFoundError);
        });
    });

});

describe('Integration CONTROLLER - DAO - DB', () => {
    afterAll(async () => {
        await cleanupDB();
    });

    describe("addReview", () => {

        beforeEach(async () => {
            reviewController = new ReviewController();
            reviewDAO = reviewController.reviewDAO;
            await setupDB();
        });

        it("200 OK - model not empty", async () => {

            const spyAddReview = jest.spyOn(reviewController.reviewDAO, "addReview");
            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");

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



        it("404 KO ProductNotFoundError - model does not represent an existing product in the database", async () => {

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

        it("409 KO ExistingReviewError - Already existing review for the product made by the customer", async () => {

            const spyAddReview = jest.spyOn(reviewDAO, "addReview");
            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");

            await addReview()

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

    describe("getProductReviews", () => {

        beforeEach(async () => {
            reviewController = new ReviewController();
            reviewDAO = reviewController.reviewDAO;
            await setupDB();
        });

        it("200 OK - model not empty", async () => {

            const spyGetProductReviews = jest.spyOn(reviewDAO, "getProductReviews");

            await addReview();
            await expect(reviewController.getProductReviews(testModel)).resolves.toStrictEqual([new ProductReview(
                testModel,
                testUser.username,
                testScore,
                testDate,
                testComment
            )]);
            expect(reviewDAO.getProductReviews).toHaveBeenCalledTimes(1);
            expect(reviewDAO.getProductReviews).toHaveBeenCalledWith(
                testModel
            );

            spyGetProductReviews.mockRestore();
        });

    });

    describe("deleteReview", () => {
        beforeEach(async () => {
            reviewController = new ReviewController();
            reviewDAO = reviewController.reviewDAO;
            await setupDB();
        });

        it("200 OK - model not empty", async () => {

            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");
            const spyDeleteReview = jest.spyOn(reviewDAO, "deleteReview");

            await addReview();
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


        it("404 KO ProductNotFoundError - model does not represent an existing product in the database", async () => {

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

        it("404 KO NoReviewProductError - current user does not have a review for the product identified by model", async () => {

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

    });

    describe("deleteReviewsOfProduct", () => {
        beforeEach(async () => {
            reviewController = new ReviewController();
            reviewDAO = reviewController.reviewDAO;
            await setupDB();
        });

        it("200 OK - model not empty", async () => {

            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");
            const spyDeleteReviewsOfProduct = jest.spyOn(reviewDAO, "deleteReviewsOfProduct");

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


        it("404 KO ProductNotFoundError - model does not represent an existing product in the database", async () => {
            const spyProductCheck = jest.spyOn(reviewDAO, "productCheck");
            const spyDeleteReviewsOfProduct = jest.spyOn(reviewDAO, "deleteReviewsOfProduct");

            await removeProduct();
            await expect(reviewController.deleteReviewsOfProduct(testModel)).rejects.toThrowError(ProductNotFoundError);

            expect(reviewDAO.productCheck).toBeCalledTimes(1);
            expect(reviewDAO.productCheck).toBeCalledWith(
                testModel
            );
            expect(reviewDAO.deleteReviewsOfProduct).toBeCalledTimes(0);

            spyProductCheck.mockRestore();
            spyDeleteReviewsOfProduct.mockRestore();
        });

    });

    describe("deleteAllReviews", () => {
        beforeEach(async () => {
            reviewController = new ReviewController();
            reviewDAO = reviewController.reviewDAO;
            await setupDB();
        });

        it("200 OK", async () => {

            const spyDeleteAllReviews = jest.spyOn(reviewDAO, "deleteAllReviews");

            await expect(reviewController.deleteAllReviews()).resolves.toBe(undefined);

            expect(reviewDAO.deleteAllReviews).toHaveBeenCalledTimes(1);
            expect(reviewDAO.deleteAllReviews).toHaveBeenCalledWith();
        });

    });
});

