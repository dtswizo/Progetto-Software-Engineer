import { test, expect, jest } from "@jest/globals"
import CartController from "../../src/controllers/cartController"
import CartDAO from "../../src/dao/cartDAO"
import { Role, User } from "../../src/components/user";
import {Cart, ProductInCart} from "../../src/components/cart";
import { Category, Product } from "../../src/components/product";

jest.mock("../../src/dao/cartDAO")

/* *************************** FUNZIONE addToCart ****************************** */
/*
test("Test correct addToCart controller", async () => {
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(true);
    //eventuali altri mock da chiamare
    
    const controller = new CartController(); 
    
    const response = await controller.getCart(testUser);

    
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledWith(testUser,"test");
    expect(response).toBe(true);
});
*/
/* ****************************** FUNZIONE getCart ****************************** */
/*
test("Test correct getCart controller", async () => {
    const testUser = new User("test","test","test",Role.CUSTOMER,"","")
    jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",10,[new ProductInCart("test",1,Category.APPLIANCE,10)]));
    //eventuali altri mock da chiamare
    
    const controller = new CartController(); 
    
    const response = await controller.getCart(testUser);


    expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testUser);
    expect(response).toBe(new Cart("test",false,"",10,[new ProductInCart("test",1,Category.APPLIANCE,10)]));
});

test("Test carrello vuoto o carello non pagato non esistente getCart controller", async () => {
    const testUser = new User("test","test","test",Role.CUSTOMER,"","")
    jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",0,[]));
    //eventuali altri mock da chiamare
    
    const controller = new CartController(); 
    
    const response = await controller.getCart(testUser);


    expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testUser);
    expect(response).toBe(new Cart("test",false,"",0,[]));
});
*/


