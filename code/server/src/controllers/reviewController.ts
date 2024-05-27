import { User } from "../components/user";
import ReviewDAO from "../dao/reviewDAO";
import { ExistingReviewError, NoReviewProductError } from "../errors/reviewError";


class ReviewController {
    private dao: ReviewDAO

    constructor() {
        this.dao = new ReviewDAO
    }

    /**
     * Adds a new review for a product
     * @param model The model of the product to review
     * @param user The username of the user who made the review
     * @param score The score assigned to the product, in the range [1, 5]
     * @param comment The comment made by the user
     * @returns A Promise that resolves to nothing
     */
    async addReview(model: string, user: User, score: number, comment: string) /**:Promise<void> */ {
        if (!model || typeof model !== 'string') {
            throw new Error("Model cannot be empty and must be a string");
        }

        if (typeof score !== 'number' || score < 1 || score > 5) {
            throw new Error("Score must be an integer between 1 and 5");
        }

        if (comment === null || comment === undefined || typeof comment !== 'string') {
            throw new Error("Comment cannot be null or undefined and must be a string");
        }
            await this.dao.productCheck(model);
            return await this.dao.addReview(model, user, score, comment);
      
    }

    /**
     * Returns all reviews for a product
     * @param model The model of the product to get reviews from
     * @returns A Promise that resolves to an array of ProductReview objects
     */
    async getProductReviews(model: string) /**:Promise<ProductReview[]> */ {
        if (!model || typeof model !== 'string') {
            throw new Error("Model cannot be empty and must be a string");
        }
             return await this.dao.getProductReviews(model);
     }
    

    /**
     * Deletes the review made by a user for a product
     * @param model The model of the product to delete the review from
     * @param user The user who made the review to delete
     * @returns A Promise that resolves to nothing
     */
    async deleteReview(model: string, user: User) /**:Promise<void> */ {
        if (!model || typeof model !== 'string') {
            throw new Error("Model cannot be empty and must be a string");
        }
        await this.dao.productCheck(model);
        return await this.dao.deleteReview(model, user);
       
    }

    /**
     * Deletes all reviews for a product
     * @param model The model of the product to delete the reviews from
     * @returns A Promise that resolves to nothing
     */
    async deleteReviewsOfProduct(model: string) /**:Promise<void> */ {
        if (!model || typeof model !== 'string') {
            throw new Error("Model cannot be empty and must be a string");
        }    
        await this.dao.productCheck(model);
        return await this.dao.deleteReviewsOfProduct(model); 
    }

    /**
     * Deletes all reviews of all products
     * @returns A Promise that resolves to nothing
     */
    async deleteAllReviews() /**:Promise<void> */ {    
        return await this.dao.deleteAllReviews();     
    }
}

export default ReviewController;