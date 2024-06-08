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
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from '../../src/testUtilities'
jest.mock('../../src/controllers/cartController');  /////


const baseURL = "/ezelectronics"
let app: express.Application;

describe("Cart route tests", () => {

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    app = initMockedApp();
});

/* ************************ get ezelectronics/carts -->getCart ************************* */

test("getCart: It should return a 200 success code", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",10,[new ProductInCart("test",1,Category.APPLIANCE,10)]))
    const response = await request(app).get(baseURL + "/carts")
    expect(response.status).toBe(200)
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getCart).toHaveBeenCalledWith(testUser)
});


test("getCart: 200 doesn't exist an unpaid cart or is empty", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",0,[]))
    const response = await request(app).get(baseURL + "/carts")
    expect(response.status).toBe(200)
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getCart).toHaveBeenCalledWith(testUser)
});

test("getCart: 200 doesn't exist an unpaid cart or is empty", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",0,[]))
    const response = await request(app).get(baseURL + "/carts")
    expect(response.status).toBe(200)
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getCart).toHaveBeenCalledWith(testUser)
});

test("getCart:401 wrong account type logged", async () => {
    const testUser = spyManager();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",0,[]))
    const response = await request(app).get(baseURL + "/carts")
    expect(response.status).toBe(401)
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0)
});

test("getCart:401 user not logged", async () => {
    const testUser = spyNotLogged();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",0,[]))
    const response = await request(app).get(baseURL + "/carts")
    expect(response.status).toBe(401)
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0)
});

test("getCart:error from getCart", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCart").mockRejectedValue(new Error())
    const response = await request(app).get(baseURL + "/carts")
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getCart).toHaveBeenCalledWith(testUser)
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
    //jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new ProductNotFoundError())
    jest.spyOn(CartController.prototype, "addToCart").mockImplementation(() => {throw new ProductNotFoundError();})
    const response = await request(app).post(baseURL + "/carts").send({model:"test"}).set('Content-Type', 'application/json')
    expect(response.status).toBe(404)
    expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testUser,"test")
    expect(CartController.prototype.addToCart).toThrowError(ProductNotFoundError)
});

test("addToCart: 409 model with avaible quantity 0", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    //jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new EmptyProductStockError())
    jest.spyOn(CartController.prototype, "addToCart").mockImplementation(() => {throw new EmptyProductStockError();})
    const response = await request(app).post(baseURL + "/carts").send({model:"test"}).set('Content-Type', 'application/json')
    expect(response.status).toBe(409) 
    expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testUser,"test")
    expect(CartController.prototype.addToCart).toThrow(EmptyProductStockError)
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

test("addToCart: error from controller", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new Error())
    const response = await request(app).post(baseURL + "/carts").send({model:"iphone13"}).set('Content-Type', 'application/json')
    //expect(response.status).toBe(200)
    expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testUser, "iphone13")
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
    //jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new CartNotFoundError())
    jest.spyOn(CartController.prototype, "checkoutCart").mockImplementation(() => {throw new CartNotFoundError();})
    const response = await request(app).patch(baseURL + "/carts")
    expect(response.status).toBe(404)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
    expect(CartController.prototype.checkoutCart).toThrow(CartNotFoundError)
});

test("checkoutCart:400 the unpaid cart is empty", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    //jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyCartError())
    jest.spyOn(CartController.prototype, "checkoutCart").mockImplementation(() => {throw new EmptyCartError();})
    const response = await request(app).patch(baseURL + "/carts")
    expect(response.status).toBe(400)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
    expect(CartController.prototype.checkoutCart).toThrow(EmptyCartError)
});

test("checkoutCart:409 at least one product in the cart is not avaible", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    //jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyProductStockError())
    jest.spyOn(CartController.prototype, "checkoutCart").mockImplementation(() => {throw new EmptyProductStockError();})
    const response = await request(app).patch(baseURL + "/carts")
    expect(response.status).toBe(409)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
    expect(CartController.prototype.checkoutCart).toThrow(EmptyProductStockError)
});

test("checkoutCart:409 at least one product quantity in the cart is > than the avaible", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    //jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new LowProductStockError())
    jest.spyOn(CartController.prototype, "checkoutCart").mockImplementation(() => {throw new LowProductStockError();})
    const response = await request(app).patch(baseURL + "/carts")
    expect(response.status).toBe(409)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
    expect(CartController.prototype.checkoutCart).toThrow(LowProductStockError)
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

test("checkoutCart: error from controller", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new Error())
    const response = await request(app).patch(baseURL + "/carts")
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testUser)
    
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

test("getCustomerCarts: error from controller", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "getCustomerCarts").mockRejectedValueOnce(new Error())
    const response = await request(app).get(baseURL + "/carts/history")
    expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledWith(testUser)
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
    //jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotInCartError())
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockImplementation(() => {throw new ProductNotInCartError();})
    const model="test"  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)
    expect(response.status).toBe(404)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser,model)
    expect(CartController.prototype.removeProductFromCart).toThrow(ProductNotInCartError)
});

test("removeProductFromCart: 404 no unpaid cart or empty cart", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    //jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new CartNotFoundError())
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockImplementation(() => {throw new CartNotFoundError();})
    const model="test"  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)
    expect(response.status).toBe(404)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser,model)
    expect(CartController.prototype.removeProductFromCart).toThrow(CartNotFoundError)
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
    //expect(CartController.prototype.checkoutCart).toThrow(EmptyCartError)
    //vanno distinti i 2 casi con 2 test
});*/

test("removeProductFromCart: 404 model product not existing", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    //jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotFoundError())
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockImplementation(() => {throw new ProductNotFoundError();})
    const model="test"  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)
    expect(response.status).toBe(404)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser,model)
    expect(CartController.prototype.removeProductFromCart).toThrow(ProductNotFoundError)
});

test("checkoutCart: 401 wrong account type logged", async () => {
    const testUser = spyAdmin();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true)
    const model="test"  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)
    expect(response.status).toBe(401)
    expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0)
});

test("checkoutCart: 401 user not logged", async () => {
    const testUser = spyNotLogged();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true)
    const model="test"  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)
    expect(response.status).toBe(401)
    expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0)
});


test("checkoutCart: 422 model parameter empty", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true)
    const model=""  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)
    expect(response.status).toBe(422)
    expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0)
});

test("removeProductFromCart: error from controller", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new Error())
    const model="test"  //modello da rimuovere
    const response = await request(app).delete(baseURL + `/carts/products/${model}`)    
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser,model)
});

/* ************************ DELETE ezelectronics/carts/current -->clearCart ************************* */

test("clearCart: It should return a 200 success code", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "clearCart").mockResolvedValueOnce(true)
    const response = await request(app).delete(baseURL + "/carts/current") 
    expect(response.status).toBe(200)
    expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.clearCart).toHaveBeenCalledWith(testUser) 
});

test("clearCart: 404 not exist an unpaid cart", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    //jest.spyOn(CartController.prototype, "clearCart").mockResolvedValueOnce(true)
    jest.spyOn(CartController.prototype, "clearCart").mockImplementation(() => {throw new CartNotFoundError();})
    const response = await request(app).delete(baseURL + "/carts/current") 
    expect(response.status).toBe(404)
    expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.clearCart).toHaveBeenCalledWith(testUser)
    expect(CartController.prototype.clearCart).toThrow(CartNotFoundError)
});

test("clearCart: error from controller", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "clearCart").mockRejectedValueOnce(new Error())
    const response = await request(app).delete(baseURL + "/carts/current") 
    expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.clearCart).toHaveBeenCalledWith(testUser) 
});

/* ************************ DELETE ezelectronics/carts -->deleteAllCarts ************************* */

test("deleteAllCarts: 200 called by Admin", async () => {
    const testUser = spyAdmin();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)
    const response = await request(app).delete(baseURL + "/carts") 
    expect(response.status).toBe(200)
    expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledWith()
});

test("deleteAllCarts: 200 called by Admin", async () => {
    const testUser = spyManager();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)
    const response = await request(app).delete(baseURL + "/carts") 
    expect(response.status).toBe(200)
    expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledWith()
});

test("deleteAllCarts: 401 called by Customer", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)
    const response = await request(app).delete(baseURL + "/carts") 
    expect(response.status).toBe(401)
    expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(0)
});

test("deleteAllCarts: 401 called by non logged user", async () => {
    const testUser = spyCustomer();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)
    const response = await request(app).delete(baseURL + "/carts") 
    expect(response.status).toBe(401)
    expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(0)
});

test("deleteAllCarts:error from controller", async () => {
    const testUser = spyAdmin();
    enableMockedAuth(app)
    jest.spyOn(CartController.prototype, "deleteAllCarts").mockRejectedValueOnce(new Error())
    const response = await request(app).delete(baseURL + "/carts") 
    expect(response.status).toBe(503)
    expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledWith()
});

/* ************************ GET ezelectronics/carts/all -->getAllCarts ************************* */

test("getAllCarts: It should return a 200 success code", async () => {
    const testUser=spyAdmin()
    jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValue([
        new Cart("test",false,null,500,[new ProductInCart("test",1,Category.APPLIANCE,500)]),
        new Cart("test",true,"20/05/2024",10,[new ProductInCart("test1",1,Category.APPLIANCE,10)])
    ])
    const response = await request(app).get(baseURL + "/carts/all") 
    expect(response.status).toBe(200)
    expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getAllCarts).toHaveBeenCalledWith()
});

test("getAllCarts:401 logged not as Manager or Admin", async () => {
    const testUser=spyCustomer()
    jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValue([
        new Cart("test",false,"",500,[new ProductInCart("test",1,Category.APPLIANCE,500)]),
        new Cart("test",true,"20/05/2024",10,[new ProductInCart("test1",1,Category.APPLIANCE,10)])
    ])
    const response = await request(app).get(baseURL + "/carts/all") 
    expect(response.status).toBe(200)
    expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getAllCarts).toHaveBeenCalledWith()
});

test("getAllCarts:401 not logged", async () => {
    const testUser=spyNotLogged()
    jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValue([
        new Cart("test",false,"",500,[new ProductInCart("test",1,Category.APPLIANCE,500)]),
        new Cart("test",true,"20/05/2024",10,[new ProductInCart("test1",1,Category.APPLIANCE,10)])
    ])
    const response = await request(app).get(baseURL + "/carts/all")
    expect(response.status).toBe(200)
    expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getAllCarts).toHaveBeenCalledWith()
});

test("getAllCarts: error from controller", async () => {
    const testUser=spyAdmin()
    jest.spyOn(CartController.prototype, "getAllCarts").mockRejectedValueOnce(new Error())
    const response = await request(app).get(baseURL + "/carts/all") 
    expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1)
    expect(CartController.prototype.getAllCarts).toHaveBeenCalledWith()
});

});