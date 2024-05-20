import { ExistingReviewError, NoReviewProductError } from "../errors/reviewError";
import db from "../db/db";
import { User } from "../components/user";
import { ProductReview } from "../components/review";


/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ReviewDAO {

    async addReview(model: string, user: User, score: number, comment: string) /**:Promise<void> */ { 
        return new Promise<void>((resolve, reject) => {
            try {
                if (score < 1 || score > 5) {
                    throw new Error("Score must be in the range from 0 to 5.");
                }
                const sql = "INSERT INTO reviews(user,model,score,date,comment) VALUES( ?,?, ?, ?, ?)"   //La data non è passata come parametro,bisogna gestirla, per ora ho messo una data temporanea
                const date = new Date().toISOString().slice(0,10); // Ottieni la data nel formato YYYY-MM-DD
                db.run(sql, [user, model, score, date, comment], (err: Error | null) => {  
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed: reviews.user, reviews.model")) reject(new ExistingReviewError())
                        reject(err)
                    }
                    resolve()
                })
            } catch (error) {
                reject(error)
            }
        })        
    }

    async getProductReviews(model: string): Promise<ProductReview[]> {
        return new Promise<ProductReview[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM reviews WHERE reviews.model = ?";
                db.all(sql, [model], (err: Error | null, rows: any[]) => {
                    if (err) { // Errore generico
                        throw err;
                    }
                    if (rows.length === 0) {
                        throw new NoReviewProductError();
                    }
    
                    const reviews: ProductReview[] = rows.map(row => {
                        return new ProductReview(row.model, row.user, row.score, row.date, row.comment);
                    });
    
                    resolve(reviews);
                });
            } catch (error) {
                reject(error);
            }
        });
    }


    async deleteReview(model: string, user: User): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "DELETE FROM reviews WHERE model = ? AND user = ?";
                db.run(sql, [model, user.username], function(err: Error | null) {
                    if (err) {
                        reject(err);
                        return;
                    }
    
                    // Verifica se la query ha cancellato qualcosa
                    if (this.changes === 0) {
                        reject(new NoReviewProductError());
                        return;
                    }
    
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    

    async deleteReviewsOfProduct(model: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "DELETE FROM reviews WHERE model = ?";
            try {
                db.run(sql, [model], function(err: Error | null) {
                    if (err) {
                        throw err;
                    }
                    // Verifica se la query ha cancellato qualcosa
                    if (this.changes === 0) {
                        reject(new NoReviewProductError()); // Nessuna recensione trovata per il modello specificato
                        return;
                    }
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }


    //Da sistemare per capire se anche qua va lanciato NoReviewProductError
    async deleteAllReviews(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "DELETE FROM reviews";
                db.run(sql, function(err: Error | null) {
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
            } catch (error) {
                reject(error);
            }
        });
    }

   

}

export default ReviewDAO;