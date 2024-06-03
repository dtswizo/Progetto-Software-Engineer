import { test, expect, jest } from "@jest/globals"
import CartDAO from "../../src/dao/cartDAO"
import { Role, User } from "../../src/components/user";
import {Cart, ProductInCart} from "../../src/components/cart";
import { Category, Product } from "../../src/components/product";
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../../src/errors/productError";
import { CartNotFoundError, EmptyCartError, ProductNotInCartError } from "../../src/errors/cartError";
import db from "../../src/db/db"
import { Database } from "sqlite3"

jest.mock("../../src/dao/cartDAO")


/* *************************** FUNZIONE checkIfCartExists ****************************** */

describe("checkIfCartExists", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test("correct checkIfCartExists DAO", async () => {
        jest.clearAllMocks();
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "27/05/2024"
        }
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(true);
            return {} as Database;
        });
        
        let cartDAO = new CartDAO();
        const response = await cartDAO.checkIfCartExists(testUser);
        
        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.get).toHaveBeenCalledWith(testUser.username);
        expect(response).toBe(true);
    });

});