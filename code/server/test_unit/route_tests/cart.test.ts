import { test, expect, jest } from "@jest/globals"
import request from 'supertest'
//import { app } from "../../index" ////
import {CartNotFoundError, EmptyCartError, ProductNotInCartError} from "../../src/errors/cartError"
import CartController from "../../src/controllers/cartController"
import { Cart, ProductInCart } from "../../src/components/cart"
import { Role, User } from "../../src/components/user"
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../../src/errors/productError"
import { Category } from "../../src/components/product"
//import { before, beforeEach, describe } from "node:test"
import express from "express"
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from './testUtilities'
jest.mock('../../src/controllers/cartController');  /////


const baseURL = "/ezelectronics"
let app: express.Application;

describe("Cart route tests", () => {

beforeEach(() => {
    jest.clearAllMocks();
    app = initMockedApp();
});

/* ************************ get ezelectronics/carts -->getCart ************************* */

test("getCart: It should return a 200 success code", async () => {
    //devo loggarmi con testUser
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",10,[new ProductInCart("test",1,Category.APPLIANCE,10)]))
    const response = await request(app).get(baseURL + "/carts")
    expect(response.status).toBe(200)
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getCart).toHaveBeenCalledWith(testUser)
});


test("getCart: doesn't exist an unpaid cart or is empty", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",0,[]))
    const response = await request(app).get(baseURL + "/carts")
    expect(response.status).toBe(200)
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getCart).toHaveBeenCalledWith(testUser)
});

test("getCart: doesn't exist an unpaid cart or is empty", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",0,[]))
    const response = await request(app).get(baseURL + "/carts")
    expect(response.status).toBe(200)
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getCart).toHaveBeenCalledWith(testUser)
});

test("getCart: wrong account type logged", async () => {
    const testUser = spyManager();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",0,[]))
    const response = await request(app).get(baseURL + "/carts")
    expect(response.status).toBe(401)
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0)
});

test("getCart: user not logged", async () => {
    const testUser = spyNotLogged();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",0,[]))
    const response = await request(app).get(baseURL + "/carts")
    expect(response.status).toBe(401)
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0)
});


/* ************************ POST ezelectronics/carts -->addToCart ************************* */

test("addToCart: It should return a 200 success code", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true)
    const response = await request(app).post(baseURL + "/carts").send({model:"iphone13"}).set('Content-Type', 'application/json')
    expect(response.status).toBe(200)
    expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testUser, "iphone13")
});

test("addToCart: 404 model does not represent an existing product", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new ProductNotFoundError())
    const response = await request(app).post(baseURL + "/carts").send({model:"test"}).set('Content-Type', 'application/json')
    expect(response.status).toBe(404)
    expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testUser,"test")
    //expect(CartController.prototype.addToCart).toThrowError(new ProductNotFoundError())
});

test("addToCart: 409 model with avaible quantity 0", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new EmptyProductStockError())
    const response = await request(app).post(baseURL + "/carts").send({model:"test"}).set('Content-Type', 'application/json')
    expect(response.status).toBe(409) 
    expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testUser,"test")
    //expect(CartController.prototype.addToCart).toThrow(new EmptyProductStockError())
});

test("addToCart: 401 wrong account type logged", async () => {
    const testUser = spyAdmin();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true)
    const response = await request(app).post(baseURL + "/carts").send({model:"iphone13"}).set('Content-Type', 'application/json')
    expect(response.status).toBe(401)
    expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0)
});

test("addToCart: 401 user not logged", async () => {
    const testUser = spyNotLogged();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true)
    const response = await request(app).post(baseURL + "/carts").send({model:"iphone13"}).set('Content-Type', 'application/json')
    expect(response.status).toBe(401)
    expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0)
});

test("addToCart: 422 empty model parameter", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true)
    const response = await request(app).post(baseURL + "/carts").send({model:""}).set('Content-Type', 'application/json')
    expect(response.status).toBe(422)
    expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0)
});

/* ************************ PATCH ezelectronics/carts -->checkoutCart ************************* */

test("checkoutCart: It should return a 200 success code", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true)
    const response = await request(app).patch(baseURL + "/carts")
    expect(response.status).toBe(200)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
    
});

test("checkoutCart:404 no unpaid cart for the user", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new CartNotFoundError())
    const response = await request(app).patch(baseURL + "/carts")
    expect(response.status).toBe(404)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
    //expect(CartController.prototype.checkoutCart).toThrow(new CartNotFoundError())
});

test("checkoutCart:400 the unpaid cart is empty", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyCartError())
    const response = await request(app).patch(baseURL + "/carts")
    expect(response.status).toBe(400)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
    //expect(CartController.prototype.checkoutCart).toThrow(new EmptyCartError())
});

test("checkoutCart:409 at least one product in the cart is not avaible", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyProductStockError())
    const response = await request(app).patch(baseURL + "/carts")
    expect(response.status).toBe(409)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser) //?? da finire con login ??
    //expect(CartController.prototype.checkoutCart).toThrow(new EmptyProductStockError())
});

test("checkoutCart:409 at least one product quantity in the cart is > than the avaible", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new LowProductStockError())
    const response = await request(app).patch(baseURL + "/carts")
    expect(response.status).toBe(409)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser) //?? da finire con login ??
    //expect(CartController.prototype.checkoutCart).toThrow(new LowProductStockError())
});


test("checkoutCart: 401 wrong account type logged", async () => {
    const testUser = spyAdmin();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true)
    const response = await request(app).patch(baseURL + "/carts")
    expect(response.status).toBe(401)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(0)
});

test("checkoutCart: 401 user not logged", async () => {
    const testUser = spyNotLogged();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true)
    const response = await request(app).patch(baseURL + "/carts")
    expect(response.status).toBe(401)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(0)
});

/* ************************ GET ezelectronics/carts/history -->getCustomerCarts ************************* */

test("getCustomerCarts: It should return a 200 success code", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce([
        new Cart("test",true,"10/04/2023",500,[new ProductInCart("test",1,Category.APPLIANCE,500)]),
        new Cart("test",true,"20/05/2024",10,[new ProductInCart("test1",1,Category.APPLIANCE,10)])
    ])
    const response = await request(app).get(baseURL + "/carts/history")
    expect(response.status).toBe(200)
    expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledWith(testUser)
});

test("checkoutCart: 401 wrong account type logged", async () => {
    const testUser = spyManager();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce([
        new Cart("test",true,"10/04/2023",500,[new ProductInCart("test",1,Category.APPLIANCE,500)]),
        new Cart("test",true,"20/05/2024",10,[new ProductInCart("test1",1,Category.APPLIANCE,10)])
    ])
    const response = await request(app).get(baseURL + "/carts/history")
    expect(response.status).toBe(401)
    expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0)
});

test("checkoutCart: 401 user not logged", async () => {
    const testUser = spyNotLogged();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce([
        new Cart("test",true,"10/04/2023",500,[new ProductInCart("test",1,Category.APPLIANCE,500)]),
        new Cart("test",true,"20/05/2024",10,[new ProductInCart("test1",1,Category.APPLIANCE,10)])
    ])
    const response = await request(app).get(baseURL + "/carts/history")
    expect(response.status).toBe(401)
    expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0)
});



/* ************************ DELETE ezelectronics/carts/products/:model -->removeProductFromCart ************************* */

test("removeProductFromCart: It should return a 200 success code", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true)
    const model="test"  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)    
    expect(response.status).toBe(200)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser,model)
});

test("removeProductFromCart: 404 model is not in the cart", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotInCartError())
    const model="test"  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)
    expect(response.status).toBe(404)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser,model)
    //expect(CartController.prototype.checkoutCart).toThrow(new ProductNotInCartError())
});

test("removeProductFromCart: 404 no unpaid cart or empty cart", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new CartNotFoundError())
    const model="test"  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)
    expect(response.status).toBe(404)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser,model)
    //vanno distinti i 2 casi con 2 test
    //expect(CartController.prototype.checkoutCart).toThrow(new CartNotFoundError())
});
/*
test("removeProductFromCart: 404 empty cart", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new EmptyCartError())
    const model="test"  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)
    expect(response.status).toBe(404)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser,model)
    //expect(CartController.prototype.checkoutCart).toThrow(new EmptyCartError())
    //vanno distinti i 2 casi con 2 test
});*/

test("removeProductFromCart: 404 model product not existing", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotFoundError())
    const model="test"  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)
    expect(response.status).toBe(404)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser,model)
    //expect(CartController.prototype.checkoutCart).toThrow(new ProductNotFoundError())
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////// aggiungere controllo parametro model e controllo tipo di utente loggato/////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ************************ DELETE ezelectronics/carts/current -->clearCart ************************* */
/*
test("removeProductFromCart: It should return a 200 success code", async () => {
    const testUser = new User("test","test","test",Role.CUSTOMER,"","")
    //devo loggarmi con testUser
    jest.spyOn(CartController.prototype, "clearCart").mockResolvedValueOnce(true)
    const response = await request(app).delete(baseURL + "/carts/current") 
    expect(response.status).toBe(200)
    expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.clearCart).toHaveBeenCalledWith(testUser) //?? da finire con login ?? 
});

test("removeProductFromCart: 404 not exist an unpaid cart", async () => {
    const testUser = new User("test","test","test",Role.CUSTOMER,"","")
    //devo loggarmi con testUser
    jest.spyOn(CartController.prototype, "clearCart").mockResolvedValueOnce(true)
    const response = await request(app).delete(baseURL + "/carts/current") 
    expect(response.status).toBe(404)
    expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.clearCart).toHaveBeenCalledWith(testUser) //?? da finire con login ?? 
    expect(CartController.prototype.checkoutCart).toThrow(new CartNotFoundError())
});
*/
/* ************************ DELETE ezelectronics/carts -->deleteAllCarts ************************* */
/*
test("deleteAllCarts: It should return a 200 success code", async () => {
    jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)
    const response = await request(app).delete(baseURL + "/carts") 
    expect(response.status).toBe(200)
    expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledWith()
});
*/
/* ************************ DELETE ezelectronics/carts/all -->getAllCarts ************************* */
/*
test("getAllCarts: It should return a 200 success code", async () => {
    jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValueOnce([
        new Cart("test",false,"",500,[new ProductInCart("test",1,Category.APPLIANCE,500)]),
        new Cart("test",true,"20/05/2024",10,[new ProductInCart("test1",1,Category.APPLIANCE,10)])
    ])
    const response = await request(app).delete(baseURL + "/carts/all") 
    expect(response.status).toBe(200)
    expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getAllCarts).toHaveBeenCalledWith()
});*/

});