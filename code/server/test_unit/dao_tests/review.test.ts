import { expect, jest } from '@jest/globals';

import ReviewDAO from '../../src/dao/reviewDAO'
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { User, Role } from '../../src/components/user';
import { Product, Category } from '../../src/components/product';
import { ExistingReviewError, NoReviewProductError } from "../../src/errors/reviewError";
import { ProductNotFoundError } from "../../src/errors/productError";
import { ProductReview } from '../../src/components/review';


jest.mock("../../src/db/db.ts");

let reviewDAO = new ReviewDAO();

describe("addReview", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - void", async () => {
        const testUser = new User('MarioRossi',
            'Mario',
            'Rossi',
            Role.CUSTOMER,
            '',
            ''
        );
        const testModel = 'iPhone13';
        const testScore = 5;
        const testComment = 'A very cool smartphone!';
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        await expect(reviewDAO.addReview(testModel, testUser, testScore, testComment)).resolves.toBe(undefined);
    });

    it("Error - ExistingReviewError", async () => {
        const testUser = new User('MarioRossi',
            'Mario',
            'Rossi',
            Role.CUSTOMER,
            '',
            ''
        );
        const testModel = 'iPhone13';
        const testScore = 5;
        const testComment = 'A very cool smartphone!';
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("UNIQUE constraint failed: reviews.user, reviews.model"));
            return {} as Database;
        });

        await expect(reviewDAO.addReview(testModel, testUser, testScore, testComment)).rejects.toThrowError(ExistingReviewError);
    });

    it("Error - Generic DB Error", async () => {
        const testUser = new User('MarioRossi',
            'Mario',
            'Rossi',
            Role.CUSTOMER,
            '',
            ''
        );
        const testModel = 'iPhone13';
        const testScore = 5;
        const testComment = 'A very cool smartphone!';
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(reviewDAO.addReview(testModel, testUser, testScore, testComment)).rejects.toThrowError(Error);
    });

});



describe("getProductReviews", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - ProductReview[] not empty", async () => {
        const testModel = 'iPhone13';
        const testUser = 'MarioRossi';
        const testScore = 5;
        const testDate = '2024-05-31';
        const testComment = 'A very cool smartphone!';
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{
                model: testModel,
                user: testUser,
                score: testScore,
                date: testDate,
                comment: testComment
            }]);
            return {} as Database;
        })

        await expect(reviewDAO.getProductReviews(testModel)).resolves.toStrictEqual([new ProductReview(
            testModel,
            testUser,
            testScore,
            testDate,
            testComment
        )]);
    });

    it("Success - ProductReview[] empty", async () => {
        const testModel = 'iPhone13';
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, []);
            return {} as Database;
        })

        await expect(reviewDAO.getProductReviews(testModel)).resolves.toStrictEqual([]);
    });

    it("Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        })

        await expect(reviewDAO.getProductReviews(testModel)).rejects.toThrowError(Error);
    });

});


describe("deleteReview", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - void", async () => {
        const testUser = new User('MarioRossi',
            'Mario',
            'Rossi',
            Role.CUSTOMER,
            '',
            ''
        );
        const testModel = 'iPhone13';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 1 }, null);
            return ({} as Database);
        });

        await expect(reviewDAO.deleteReview(testModel, testUser)).resolves.toBe(undefined);
    });

    it("Error - Generic DB Error", async () => {
        const testUser = new User('MarioRossi',
            'Mario',
            'Rossi',
            Role.CUSTOMER,
            '',
            ''
        );
        const testModel = 'iPhone13';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            let database = {} as Database;

            return ({} as Database);
        });

        await expect(reviewDAO.deleteReview(testModel, testUser)).rejects.toThrowError(Error);
    });
    it("Error - NoReviewProductError", async () => {
        const testUser = new User('MarioRossi',
            'Mario',
            'Rossi',
            Role.CUSTOMER,
            '',
            ''
        );
        const testModel = 'iPhone13';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 0 }, null);
            return ({} as Database);
        });

        await expect(reviewDAO.deleteReview(testModel, testUser)).rejects.toThrowError(NoReviewProductError);
    });

});


describe("deleteReviewsOfProduct", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - void", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });

        await expect(reviewDAO.deleteReviewsOfProduct(testModel)).resolves.toBe(undefined);
    });

    it("Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return ({} as Database);
        });

        await expect(reviewDAO.deleteReviewsOfProduct(testModel)).rejects.toThrowError(Error);
    });

});

describe("deleteAllReviews", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - void", async () => {

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return ({} as Database);
        });

        await expect(reviewDAO.deleteAllReviews()).resolves.toBe(undefined);
    });

    it("Error - Generic DB Error", async () => {

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return ({} as Database);
        });

        await expect(reviewDAO.deleteAllReviews()).rejects.toThrowError(Error);
    });

});


describe("productCheck", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Success - true", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [new Product(
                1,
                'test',
                Category.SMARTPHONE,
                null,
                null,
                3
            )]);
            return ({} as Database);
        });

        await expect(reviewDAO.productCheck(testModel)).resolves.toBe(true);
    });

    it("Error - ProductNotFoundError", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, []);
            return ({} as Database);
        });

        await expect(reviewDAO.productCheck(testModel)).rejects.toThrowError(ProductNotFoundError);
    });

    it("Error - Generic DB Error", async () => {
        const testModel = 'iPhone13';

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return ({} as Database);
        });

        await expect(reviewDAO.productCheck(testModel)).rejects.toThrowError(Error);
    });
});