import { test, expect, jest } from "@jest/globals"
import request from 'supertest'
import { CartNotFoundError, EmptyCartError, ProductNotInCartError } from "../../src/errors/cartError"
import CartController from "../../src/controllers/cartController"
import { Cart, ProductInCart } from "../../src/components/cart"
import { Role, User } from "../../src/components/user"
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../../src/errors/productError"
import { Category } from "../../src/components/product"
import express from "express"
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from '../../src/testUtilities'
jest.mock('../../src/controllers/cartController');


const baseURL = "/ezelectronics"
let app: express.Application;

describe("Cart route tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        app = initMockedApp();
    });

    /* ************************ get ezelectronics/carts -->getCart ************************* */
    describe("UCR 1 getCart", () => {
        test("getCart: It should return a 200 success code", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test", false, "", 10, [new ProductInCart("test", 1, Category.APPLIANCE, 10)]))
            const response = await request(app).get(baseURL + "/carts")
            expect(response.status).toBe(200)
            expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.getCart).toHaveBeenCalledWith(testUser)
        });


        test("UCR 1.1 getCart: 200 doesn't exist an unpaid cart or is empty", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test", false, "", 0, []))
            const response = await request(app).get(baseURL + "/carts")
            expect(response.status).toBe(200)
            expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.getCart).toHaveBeenCalledWith(testUser)
        });

        test("UCR 1.2 getCart: 200 doesn't exist an unpaid cart or is empty", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test", false, "", 0, []))
            const response = await request(app).get(baseURL + "/carts")
            expect(response.status).toBe(200)
            expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.getCart).toHaveBeenCalledWith(testUser)
        });

        test("UCR 1.3 getCart:401 wrong account type logged", async () => {
            const testUser = spyManager();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test", false, "", 0, []))
            const response = await request(app).get(baseURL + "/carts")
            expect(response.status).toBe(401)
            expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0)
        });

        test("UCR 1.4 getCart:401 user not logged", async () => {
            const testUser = spyNotLogged();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test", false, "", 0, []))
            const response = await request(app).get(baseURL + "/carts")
            expect(response.status).toBe(401)
            expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0)
        });

        test("UCR 1.5 getCart:error from getCart", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getCart").mockRejectedValue(new Error())
            const response = await request(app).get(baseURL + "/carts")
            expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.getCart).toHaveBeenCalledWith(testUser)
        });
    });


    /* ************************ POST ezelectronics/carts -->addToCart ************************* */
    describe("UCR 2 addToCart", () => {
        test("UCR 2.1 addToCart: It should return a 200 success code", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true)
            const response = await request(app).post(baseURL + "/carts").send({ model: "iphone13" }).set('Content-Type', 'application/json')
            expect(response.status).toBe(200)
            expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testUser, "iphone13")
        });

        test("UCR 2.2 addToCart: 404 model does not represent an existing product", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)

            jest.spyOn(CartController.prototype, "addToCart").mockImplementation(() => { throw new ProductNotFoundError(); })
            const response = await request(app).post(baseURL + "/carts").send({ model: "test" }).set('Content-Type', 'application/json')
            expect(response.status).toBe(404)
            expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testUser, "test")
            expect(CartController.prototype.addToCart).toThrowError(ProductNotFoundError)
        });

        test("UCR 2.3 addToCart: 409 model with avaible quantity 0", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
 
            jest.spyOn(CartController.prototype, "addToCart").mockImplementation(() => { throw new EmptyProductStockError(); })
            const response = await request(app).post(baseURL + "/carts").send({ model: "test" }).set('Content-Type', 'application/json')
            expect(response.status).toBe(409)
            expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testUser, "test")
            expect(CartController.prototype.addToCart).toThrow(EmptyProductStockError)
        });

        test("UCR 2.4 addToCart: 401 wrong account type logged", async () => {
            const testUser = spyAdmin();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true)
            const response = await request(app).post(baseURL + "/carts").send({ model: "iphone13" }).set('Content-Type', 'application/json')
            expect(response.status).toBe(401)
            expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0)
        });

        test("UCR 2.5 addToCart: 401 user not logged", async () => {
            const testUser = spyNotLogged();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true)
            const response = await request(app).post(baseURL + "/carts").send({ model: "iphone13" }).set('Content-Type', 'application/json')
            expect(response.status).toBe(401)
            expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0)
        });

        test("UCR 2.6 addToCart: 422 empty model parameter", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true)
            const response = await request(app).post(baseURL + "/carts").send({ model: "" }).set('Content-Type', 'application/json')
            expect(response.status).toBe(422)
            expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0)
        });

        test("UCR 2.7 addToCart: error from controller", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new Error())
            const response = await request(app).post(baseURL + "/carts").send({ model: "iphone13" }).set('Content-Type', 'application/json')

            expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testUser, "iphone13")
        });
    });

    /* ************************ PATCH ezelectronics/carts -->checkoutCart ************************* */
    describe("UCR 3 checkoutCart", () => {
        test("UCR 3.1 checkoutCart: It should return a 200 success code", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true)
            const response = await request(app).patch(baseURL + "/carts")
            expect(response.status).toBe(200)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)

        });

        test("UCR 3.2 checkoutCart:404 no unpaid cart for the user", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)

            jest.spyOn(CartController.prototype, "checkoutCart").mockImplementation(() => { throw new CartNotFoundError(); })
            const response = await request(app).patch(baseURL + "/carts")
            expect(response.status).toBe(404)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
            expect(CartController.prototype.checkoutCart).toThrow(CartNotFoundError)
        });

        test("UCR 3.3 checkoutCart:400 the unpaid cart is empty", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)

            jest.spyOn(CartController.prototype, "checkoutCart").mockImplementation(() => { throw new EmptyCartError(); })
            const response = await request(app).patch(baseURL + "/carts")
            expect(response.status).toBe(400)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
            expect(CartController.prototype.checkoutCart).toThrow(EmptyCartError)
        });

        test("UCR 3.4 checkoutCart:409 at least one product in the cart is not avaible", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)

            jest.spyOn(CartController.prototype, "checkoutCart").mockImplementation(() => { throw new EmptyProductStockError(); })
            const response = await request(app).patch(baseURL + "/carts")
            expect(response.status).toBe(409)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
            expect(CartController.prototype.checkoutCart).toThrow(EmptyProductStockError)
        });

        test("UCR 3.5 checkoutCart:409 at least one product quantity in the cart is > than the avaible", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)

            jest.spyOn(CartController.prototype, "checkoutCart").mockImplementation(() => { throw new LowProductStockError(); })
            const response = await request(app).patch(baseURL + "/carts")
            expect(response.status).toBe(409)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
            expect(CartController.prototype.checkoutCart).toThrow(LowProductStockError)
        });


        test("UCR 3.6 checkoutCart: 401 wrong account type logged", async () => {
            const testUser = spyAdmin();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true)
            const response = await request(app).patch(baseURL + "/carts")
            expect(response.status).toBe(401)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(0)
        });

        test("UCR 3.7 checkoutCart: 401 user not logged", async () => {
            const testUser = spyNotLogged();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true)
            const response = await request(app).patch(baseURL + "/carts")
            expect(response.status).toBe(401)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(0)
        });

        test("UCR 3.8 checkoutCart: error from controller", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new Error())
            const response = await request(app).patch(baseURL + "/carts")
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)

        });
    });


    /* ************************ GET ezelectronics/carts/history -->getCustomerCarts ************************* */
    describe("UCR 4 getCustomerCarts", () => {
        test("UCR 4.1 getCustomerCarts: It should return a 200 success code", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce([
                new Cart("test", true, "10/04/2023", 500, [new ProductInCart("test", 1, Category.APPLIANCE, 500)]),
                new Cart("test", true, "20/05/2024", 10, [new ProductInCart("test1", 1, Category.APPLIANCE, 10)])
            ])
            const response = await request(app).get(baseURL + "/carts/history")
            expect(response.status).toBe(200)
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledWith(testUser)
        });

        test("UCR 4.2 checkoutCart: 401 wrong account type logged", async () => {
            const testUser = spyManager();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce([
                new Cart("test", true, "10/04/2023", 500, [new ProductInCart("test", 1, Category.APPLIANCE, 500)]),
                new Cart("test", true, "20/05/2024", 10, [new ProductInCart("test1", 1, Category.APPLIANCE, 10)])
            ])
            const response = await request(app).get(baseURL + "/carts/history")
            expect(response.status).toBe(401)
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0)
        });

        test("UCR 4.3 checkoutCart: 401 user not logged", async () => {
            const testUser = spyNotLogged();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce([
                new Cart("test", true, "10/04/2023", 500, [new ProductInCart("test", 1, Category.APPLIANCE, 500)]),
                new Cart("test", true, "20/05/2024", 10, [new ProductInCart("test1", 1, Category.APPLIANCE, 10)])
            ])
            const response = await request(app).get(baseURL + "/carts/history")
            expect(response.status).toBe(401)
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0)
        });

        test("UCR 4.4 getCustomerCarts: error from controller", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getCustomerCarts").mockRejectedValueOnce(new Error())
            const response = await request(app).get(baseURL + "/carts/history")
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledWith(testUser)
        });
    });


    /* ************************ DELETE ezelectronics/carts/products/:model -->removeProductFromCart ************************* */
    describe("UCR 5 removeProductFromCart", () => {
        test("UCR 5.1 removeProductFromCart: It should return a 200 success code", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true)
            const model = "test"  //modello da rimuovere
            const response = await request(app).delete(baseURL + `/carts/products/${model}`)
            expect(response.status).toBe(200)
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser, model)
        });

        test("UCR 5.2 removeProductFromCart: 404 model is not in the cart", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)

            jest.spyOn(CartController.prototype, "removeProductFromCart").mockImplementation(() => { throw new ProductNotInCartError(); })
            const model = "test"  //modello da rimuovere
            const response = await request(app).delete(baseURL + `/carts/products/${model}`)
            expect(response.status).toBe(404)
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser, model)
            expect(CartController.prototype.removeProductFromCart).toThrow(ProductNotInCartError)
        });

        test("UCR 5.3 removeProductFromCart: 404 no unpaid cart or empty cart", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)

            jest.spyOn(CartController.prototype, "removeProductFromCart").mockImplementation(() => { throw new CartNotFoundError(); })
            const model = "test"  //modello da rimuovere
            const response = await request(app).delete(baseURL + `/carts/products/${model}`)
            expect(response.status).toBe(404)
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser, model)
            expect(CartController.prototype.removeProductFromCart).toThrow(CartNotFoundError)
        });

        test("UCR 5.4 removeProductFromCart: 404 model product not existing", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)

            jest.spyOn(CartController.prototype, "removeProductFromCart").mockImplementation(() => { throw new ProductNotFoundError(); })
            const model = "test"  //modello da rimuovere
            const response = await request(app).delete(baseURL + `/carts/products/${model}`)
            expect(response.status).toBe(404)
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser, model)
            expect(CartController.prototype.removeProductFromCart).toThrow(ProductNotFoundError)
        });

        test("UCR 5.5 checkoutCart: 401 wrong account type logged", async () => {
            const testUser = spyAdmin();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true)
            const model = "test"  //modello da rimuovere
            const response = await request(app).delete(baseURL + `/carts/products/${model}`)
            expect(response.status).toBe(401)
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0)
        });

        test("UCR 5.6 checkoutCart: 401 user not logged", async () => {
            const testUser = spyNotLogged();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true)
            const model = "test"  //modello da rimuovere
            const response = await request(app).delete(baseURL + `/carts/products/${model}`)
            expect(response.status).toBe(401)
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0)
        });

        test("UCR 5.7 removeProductFromCart: error from controller", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new Error())
            const model = "test"  //modello da rimuovere
            const response = await request(app).delete(baseURL + `/carts/products/${model}`)
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser, model)
        });

    });

    /* ************************ DELETE ezelectronics/carts/current -->clearCart ************************* */
    describe("UCR 6 clearCart", () => {
        test("UCR 6.1 clearCart: It should return a 200 success code", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "clearCart").mockResolvedValueOnce(true)
            const response = await request(app).delete(baseURL + "/carts/current")
            expect(response.status).toBe(200)
            expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.clearCart).toHaveBeenCalledWith(testUser)
        });

        test("UCR 6.2 clearCart: 404 not exist an unpaid cart", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)

            jest.spyOn(CartController.prototype, "clearCart").mockImplementation(() => { throw new CartNotFoundError(); })
            const response = await request(app).delete(baseURL + "/carts/current")
            expect(response.status).toBe(404)
            expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.clearCart).toHaveBeenCalledWith(testUser)
            expect(CartController.prototype.clearCart).toThrow(CartNotFoundError)
        });

        test("UCR 6.3 clearCart: error from controller", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "clearCart").mockRejectedValueOnce(new Error())
            const response = await request(app).delete(baseURL + "/carts/current")
            expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.clearCart).toHaveBeenCalledWith(testUser)
        });

    });

    /* ************************ DELETE ezelectronics/carts -->deleteAllCarts ************************* */
    describe("UCR 7 deleteAllCarts", () => {
        test("UCR 7.1 deleteAllCarts: 200 called by Admin", async () => {
            const testUser = spyAdmin();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)
            const response = await request(app).delete(baseURL + "/carts")
            expect(response.status).toBe(200)
            expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledWith()
        });

        test("UCR 7.2 deleteAllCarts: 200 called by Admin", async () => {
            const testUser = spyManager();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)
            const response = await request(app).delete(baseURL + "/carts")
            expect(response.status).toBe(200)
            expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledWith()
        });

        test("UCR 7.3 deleteAllCarts: 401 called by Customer", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)
            const response = await request(app).delete(baseURL + "/carts")
            expect(response.status).toBe(401)
            expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(0)
        });

        test("UCR 7.4 deleteAllCarts: 401 called by non logged user", async () => {
            const testUser = spyCustomer();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)
            const response = await request(app).delete(baseURL + "/carts")
            expect(response.status).toBe(401)
            expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(0)
        });

        test("UCR 7.5 deleteAllCarts:error from controller", async () => {
            const testUser = spyAdmin();
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "deleteAllCarts").mockRejectedValueOnce(new Error())
            const response = await request(app).delete(baseURL + "/carts")
            expect(response.status).toBe(503)
            expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledWith()
        });
    });

    /* ************************ GET ezelectronics/carts/all -->getAllCarts ************************* */
    describe("UCR 8 getAllCarts", () => {
        test("UCR 8.1 getAllCarts: It should return a 200 success code", async () => {
            const testUser = spyAdmin()
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValue([
                new Cart("test", false, null, 500, [new ProductInCart("test", 1, Category.APPLIANCE, 500)]),
                new Cart("test", true, "20/05/2024", 10, [new ProductInCart("test1", 1, Category.APPLIANCE, 10)])
            ])
            const response = await request(app).get(baseURL + "/carts/all")
            expect(response.status).toBe(200)
            expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.getAllCarts).toHaveBeenCalledWith()
        });

        test("UCR 8.2 getAllCarts:401 logged not as Manager or Admin", async () => {
            const testUser = spyCustomer()
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValue([
                new Cart("test", false, "", 500, [new ProductInCart("test", 1, Category.APPLIANCE, 500)]),
                new Cart("test", true, "20/05/2024", 10, [new ProductInCart("test1", 1, Category.APPLIANCE, 10)])
            ])
            const response = await request(app).get(baseURL + "/carts/all")
            expect(response.status).toBe(401)
            expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(0)

        });

        test("UCR 8.3 getAllCarts:401 not logged", async () => {
            const testUser = spyNotLogged()
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValue([
                new Cart("test", false, "", 500, [new ProductInCart("test", 1, Category.APPLIANCE, 500)]),
                new Cart("test", true, "20/05/2024", 10, [new ProductInCart("test1", 1, Category.APPLIANCE, 10)])
            ])
            const response = await request(app).get(baseURL + "/carts/all")
            expect(response.status).toBe(401)
            expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(0)

        });

        test("UCR 8.4 getAllCarts: error from controller", async () => {
            const testUser = spyAdmin()
            enableMockedAuth(app)
            jest.spyOn(CartController.prototype, "getAllCarts").mockRejectedValueOnce(new Error())
            const response = await request(app).get(baseURL + "/carts/all")
            expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.getAllCarts).toHaveBeenCalledWith()
        });
    });
});
