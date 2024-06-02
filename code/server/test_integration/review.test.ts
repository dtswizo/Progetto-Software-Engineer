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


describe('Integration DAO - DB', () => {
    let reviewDAO: ReviewDAO;

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

