import { ExistingReviewError, NoReviewProductError } from "../errors/reviewError";
import db from "../db/db";
import { User } from "../components/user";
import { ProductReview } from "../components/review";
import { ProductNotFoundError } from "../errors/productError";

class ReviewDAO {
    async addReview(model: string, user: User, score: number, comment: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "INSERT INTO reviews(user, model, score, date, comment) VALUES(?, ?, ?, ?, ?)";
            const date = new Date().toISOString().slice(0, 10);

            db.run(sql, [user, model, score, date, comment], (err: Error | null) => {
                if (err) {
                    if (err.message.includes("UNIQUE constraint failed: reviews.user, reviews.model")) {
                        reject(new ExistingReviewError());
                    } else {
                        reject(err);
                    }
                    return;
                }
                resolve();
            });
        });
    }

    async getProductReviews(model: string): Promise<ProductReview[]> {
        return new Promise<ProductReview[]>((resolve, reject) => {
            const sql = "SELECT * FROM reviews WHERE reviews.model = ?";
            db.all(sql, [model], (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(err);
                    return;
                }

                //TODO: Questo errore va veramente ritornato?
                if (rows.length === 0) {
                    reject(new NoReviewProductError());
                    return;
                }

                const reviews: ProductReview[] = rows.map(row => {
                    return new ProductReview(row.model, row.user, row.score, row.date, row.comment);
                });

                resolve(reviews);
            });
        });
    }

    async deleteReview(model: string, user: User): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "DELETE FROM reviews WHERE model = ? AND user = ?";
            db.run(sql, [model, user], function (err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }

                if (this.changes === 0) {
                    reject(new NoReviewProductError());
                    return;
                }

                resolve();
            });
        });
    }

    async deleteReviewsOfProduct(model: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "DELETE FROM reviews WHERE model = ?";
            db.run(sql, [model], function (err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }

                //TODO: Questo errore va veramente ritornato?
                if (this.changes === 0) {
                    reject(new NoReviewProductError());
                    return;
                }

                resolve();
            });
        });
    }

    async deleteAllReviews(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "DELETE FROM reviews";
            db.run(sql, function (err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

    async productCheck(model: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const sql = "SELECT * FROM products WHERE model = ?";
            db.all(sql, [model], (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows.length === 0) {
                    reject(new ProductNotFoundError()); // Nessun prodotto trovato
                } else {
                    resolve(true);  // Almeno un prodotto trovato
                }
            });
        });
    }
}

export default ReviewDAO;
