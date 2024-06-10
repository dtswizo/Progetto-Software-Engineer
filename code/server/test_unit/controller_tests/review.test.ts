import { expect, jest } from '@jest/globals';
import ReviewController from '../../src/controllers/reviewController';
import ReviewDAO from '../../src/dao/reviewDAO'
import { User, Role } from '../../src/components/user';
import { ProductNotFoundError } from '../../src/errors/productError';
import { ExistingReviewError, NoReviewProductError } from '../../src/errors/reviewError';
import { ProductReview } from '../../src/components/review';

jest.mock("../../src/dao/reviewDAO");

let reviewController = new ReviewController();

describe("URC1 - addReview", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("URC1.1 -200 OK - model not empty", async () => {
        expect.assertions(5);
        const testModel = 'iPhone13';
        const testUser = new User(
            "test",
            "test",
            "test",
            Role.CUSTOMER,
            "",
            ""
        );
        const testScore = 5;
        const testComment = 'A very cool smartphone!'

        jest.spyOn(ReviewDAO.prototype, "addReview").mockResolvedValue();
        jest.spyOn(ReviewDAO.prototype, "productCheck").mockResolvedValue(true);

        const response = await reviewController.addReview(testModel, testUser, testScore, testComment);

        expect(ReviewDAO.prototype.productCheck).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.productCheck).toHaveBeenCalledWith(
            testModel
        );
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledWith(
            testModel,
            testUser,
            testScore,
            testComment
        );
        expect(response).toBe(undefined);

    });



    it("URC1.2 - 404 KO ProductNotFoundError - model does not represent an existing product in the database", async () => {
        expect.assertions(4);

        const testModel = 'iPhone13';
        const testUser = new User(
            "test",
            "test",
            "test",
            Role.CUSTOMER,
            "",
            ""
        );
        const testScore = 5;
        const testComment = 'A very cool smartphone!'

        jest.spyOn(ReviewDAO.prototype, "addReview").mockResolvedValue();
        jest.spyOn(ReviewDAO.prototype, "productCheck").mockRejectedValue(new ProductNotFoundError());


        await expect(reviewController.addReview(testModel, testUser, testScore, testComment)).rejects.toThrowError(ProductNotFoundError);
        expect(ReviewDAO.prototype.productCheck).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.productCheck).toHaveBeenCalledWith(
            testModel
        );
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(0);

    });

    it("URC1.3 - 409 KO ExistingReviewError - Already existing review for the product made by the customer", async () => {
        expect.assertions(5);

        const testModel = 'iPhone13';
        const testUser = new User(
            "test",
            "test",
            "test",
            Role.CUSTOMER,
            "",
            ""
        );
        const testScore = 5;
        const testComment = 'A very cool smartphone!'

        jest.spyOn(ReviewDAO.prototype, "addReview").mockRejectedValue(new ExistingReviewError());
        jest.spyOn(ReviewDAO.prototype, "productCheck").mockResolvedValue(true);


        await expect(reviewController.addReview(testModel, testUser, testScore, testComment)).rejects.toThrowError(ExistingReviewError);
        expect(ReviewDAO.prototype.productCheck).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.productCheck).toHaveBeenCalledWith(
            testModel
        );
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledWith(
            testModel, testUser, testScore, testComment
        );

    });
});

describe("URC2 - getProductReviews", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("URC2.1 - 200 OK - model not empty", async () => {
        expect.assertions(3);
        const testModel = 'iPhone13';
        const testProductReview = new ProductReview(
            testModel,
            'Mario Rossi',
            5,
            '2024-05-02',
            'A very cool smartphone!'
        )

        jest.spyOn(ReviewDAO.prototype, "getProductReviews").mockResolvedValue([testProductReview]);

        await expect(reviewController.getProductReviews(testModel)).resolves.toStrictEqual([testProductReview]);
        expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledWith(
            testModel
        );

    });

});


describe("URC3 - deleteReview", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("URC3.1 - 200 OK - model not empty", async () => {
        expect.assertions(5);
        const testModel = 'iPhone13';
        const testUser = new User(
            "test",
            "test",
            "test",
            Role.CUSTOMER,
            "",
            ""
        );

        jest.spyOn(ReviewDAO.prototype, "productCheck").mockResolvedValue(true);
        jest.spyOn(ReviewDAO.prototype, "deleteReview").mockResolvedValue();

        await expect(reviewController.deleteReview(testModel, testUser)).resolves.toBe(undefined);
        expect(ReviewDAO.prototype.productCheck).toBeCalledTimes(1);
        expect(ReviewDAO.prototype.productCheck).toBeCalledWith(
            testModel
        );
        expect(ReviewDAO.prototype.deleteReview).toBeCalledTimes(1);
        expect(ReviewDAO.prototype.deleteReview).toBeCalledWith(
            testModel,
            testUser
        )
        

    });

    it("URC3.2 - 404 KO ProductNotFoundError - model does not represent an existing product in the database", async () => {
        expect.assertions(4);
        const testModel = 'iPhone13';
        const testUser = new User(
            "test",
            "test",
            "test",
            Role.CUSTOMER,
            "",
            ""
        );

        jest.spyOn(ReviewDAO.prototype, "productCheck").mockRejectedValue(new ProductNotFoundError());
        jest.spyOn(ReviewDAO.prototype, "deleteReview").mockResolvedValue();

        await expect(reviewController.deleteReview(testModel, testUser)).rejects.toThrowError(ProductNotFoundError);
        expect(ReviewDAO.prototype.productCheck).toBeCalledTimes(1);
        expect(ReviewDAO.prototype.productCheck).toBeCalledWith(
            testModel
        );
        expect(ReviewDAO.prototype.deleteReview).toBeCalledTimes(0);
        

    });

    it("URC3.2 - 404 KO NoReviewProductError - current user does not have a review for the product identified by model", async () => {
        expect.assertions(5);
        const testModel = 'iPhone13';
        const testUser = new User(
            "test",
            "test",
            "test",
            Role.CUSTOMER,
            "",
            ""
        );

        jest.spyOn(ReviewDAO.prototype, "productCheck").mockResolvedValue(true);
        jest.spyOn(ReviewDAO.prototype, "deleteReview").mockRejectedValue(new NoReviewProductError());

        await expect(reviewController.deleteReview(testModel, testUser)).rejects.toThrowError(NoReviewProductError);
        expect(ReviewDAO.prototype.productCheck).toBeCalledTimes(1);
        expect(ReviewDAO.prototype.productCheck).toBeCalledWith(
            testModel
        );
        expect(ReviewDAO.prototype.deleteReview).toBeCalledTimes(1);
        expect(ReviewDAO.prototype.deleteReview).toBeCalledWith(
            testModel,
            testUser
        );
    });

});


describe("URC4 - deleteReviewsOfProduct", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("URC4.1 - 200 OK - model not empty", async () => {
        expect.assertions(5);
        const testModel = 'iPhone13';

        jest.spyOn(ReviewDAO.prototype, "deleteReviewsOfProduct").mockResolvedValue();
        jest.spyOn(ReviewDAO.prototype, "productCheck").mockResolvedValue(true);

        await expect(reviewController.deleteReviewsOfProduct(testModel)).resolves.toBe(undefined);

        expect(ReviewDAO.prototype.productCheck).toBeCalledTimes(1);
        expect(ReviewDAO.prototype.productCheck).toBeCalledWith(
            testModel
        );
        expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith(
            testModel
        );

    });

    it("URC4.2 - 404 KO ProductNotFoundError - model does not represent an existing product in the database", async () => {
        expect.assertions(4);
        const testModel = 'iPhone13';

        jest.spyOn(ReviewDAO.prototype, "deleteReviewsOfProduct").mockResolvedValue();
        jest.spyOn(ReviewDAO.prototype, "productCheck").mockRejectedValue(new ProductNotFoundError());

        await expect(reviewController.deleteReviewsOfProduct(testModel)).rejects.toThrowError(ProductNotFoundError);
        
        expect(ReviewDAO.prototype.productCheck).toBeCalledTimes(1);
        expect(ReviewDAO.prototype.productCheck).toBeCalledWith(
            testModel
        );
        expect(ReviewDAO.prototype.deleteReviewsOfProduct).toBeCalledTimes(0);
        

    });

});


describe("URC5 - deleteAllReviews", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("URC5.1 - 200 OK", async () => {
        expect.assertions(3);
        
        jest.spyOn(ReviewDAO.prototype, "deleteAllReviews").mockResolvedValue();

        await expect(reviewController.deleteAllReviews()).resolves.toBe(undefined);

        expect(ReviewDAO.prototype.deleteAllReviews).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.deleteAllReviews).toHaveBeenCalledWith();        
    });

});