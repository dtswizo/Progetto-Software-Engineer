import { expect, jest ,test} from '@jest/globals';
import request from 'supertest'
import express from 'express';
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from '../src/testUtilities'

import cartController from '../src/controllers/cartController';
import { User, Role } from '../src/components/user';
import { Category } from '../src/components/product';
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from '../src/errors/productError';
import { ExistingReviewError, NoReviewProductError } from '../src/errors/reviewError';
import { ProductReview } from '../src/components/review';
import { cleanup, cleanupDB } from '../src/db/cleanup';
import db from "../src/db/db"
import CartDAO from '../src/dao/cartDAO';
import { CartNotFoundError, EmptyCartError, ProductNotInCartError } from '../src/errors/cartError';
import { Cart } from '../src/components/cart';
import { ProductInCart } from '../src/components/cart';
import CartController from '../src/controllers/cartController';
import { AuthRoutes } from '../src/routers/userRoutes';
import Authenticator from '../src/routers/auth';

import { app } from "../index"

const testUser = new User('MarioRossi',
    'Mario',
    'Rossi',
    Role.CUSTOMER,
    "via",
    "20-10-2020"
);
const testModel = 'iPhone13';
const testDate = new Date('2024-05-21').toISOString().split('T')[0];

const addUser = async (user: User) => {
    const sqlUser = "INSERT INTO users(username, name, surname, role,password,salt,address,birthdate) VALUES(?, ?, ?, ?,?,?,?,?)"
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sqlUser, [user.username, user.name, user.surname, user.role, "1234","a",user.address,user.birthdate], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

const removeUser = async () => {
    const sql = "DELETE FROM users";
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sql, [], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        } catch (error) {
            reject(error);
        }

    });
}

const addProduct = async (model: String, sellingPrice:number, category: Category, arrivalDate:string, details:string, quantity:number) => {
    const sqlProduct = "INSERT INTO products(model,sellingPrice,category,arrivalDate,details,quantity) VALUES(?,?,?,?,?,?)"
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sqlProduct, [model,sellingPrice,category,arrivalDate,details,quantity], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

const removeProduct = async () => {
    //console.log("RemoveProduct");
    const sql = "DELETE FROM products";
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sql, [], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        } catch (error) {
            reject(error);
        }

    });
}

const addCart = async (idCart:number,customer:string,paid:boolean,paymentDate:string,total:number) => {
    const sqlProduct = "INSERT INTO carts(idCart,customer,paid,paymentDate,total) VALUES(?,?,?,?,?)"
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sqlProduct, [idCart,customer,paid,paymentDate,total], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

const addProductInCart = async (idCart:number,model:string,quantity:number,category:Category,price:number) => {
    const sqlProduct = "INSERT INTO prod_in_cart(idCart,model,quantity,category,price) VALUES(?,?,?,?,?)"
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sqlProduct, [idCart,model,quantity,category,price], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

const removeProductsFromCart = async () => {
    //console.log("RemoveProduct");
    const sql = "DELETE FROM prod_in_cart";
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sql, [], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        } catch (error) {
            reject(error);
        }

    });
}

const removeCarts = async () => {
    //console.log("RemoveProduct");
    const sql = "DELETE FROM carts";
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sql, [], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        } catch (error) {
            reject(error);
        }

    });
}



describe('Integration DAO - DB', () => {

    beforeAll(async () => {
        await cleanupDB();
        await addUser(testUser);
    });

    describe('ICD 1 addToCart', () => {

        test("ICD 1.1 Success - cart not already exist and product not already in the cart", async () => {
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartDAO = new CartDAO;
            await expect(cartDAO.addToCart(testUser, testModel)).resolves.toBe(true);
        });

        test("ICD 1.2 Success - product already in the cart and cart exist", async () => {
            let cartDAO = new CartDAO;

            await expect(cartDAO.addToCart(testUser, testModel)).resolves.toBe(true);
        });

    });

    describe('ICD 2 checkIfCartExists', () => {

        test("ICD 2.1 Error - cart not exist", async () => {
            await removeProductsFromCart();
            await removeCarts();
            let cartDAO = new CartDAO;

            await expect(cartDAO.checkIfCartExists(testUser)).resolves.toBe(false);
        });
        
        test("ICD 2.2 Success - cart already exist", async () => {
            await addCart(1,testUser.username,false,"",20)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkIfCartExists(testUser)).resolves.toBe(true);
        });

    });

    describe('ICD 3 checkIfProductExists', () => {

        test("ICD 3.1 Error - product not exist", async () => {
            await removeProduct()
            let cartDAO = new CartDAO;

            await expect(cartDAO.checkIfProductExists(testModel)).resolves.toBe(false);
        });
        
        test("ICD 3.2 Success - product exist", async () => {
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkIfProductExists(testModel)).resolves.toBe(true);
        });
    });

    describe('ICD 4 checkIfProductExistsInCart', () => {

        test("ICD 4.1 Error - product not exist in cart", async () => {
            let cartDAO = new CartDAO;

            await expect(cartDAO.checkIfProductExistsInCart(testUser,testModel)).resolves.toBe(false);
        });
        
        test("ICD 4.2 Success - product exist", async () => {
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkIfProductExistsInCart(testUser,testModel)).resolves.toBe(true);
        });
    });

    describe('ICD 5 checkProductAvailability', () => {

        test("ICD 5.1 Error - product not exist", async () => {
            let cartDAO = new CartDAO;
            await removeProductsFromCart()
            await removeProduct()
            await expect(cartDAO.checkProductAvailability(testModel)).resolves.toBe(-1);
        });
        
        test("ICD 5.2 Success - product exist", async () => {
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkProductAvailability(testModel)).resolves.toBe(2);
        });
    });

    describe('ICD 6 checkProductQuantityInCart', () => {

        test("ICD 6.1 Error - product not exist in cart", async () => {
            //await addCart(1,testUser.username,false,"",20)
            let cartDAO = new CartDAO;

            await expect(cartDAO.checkProductQuantityInCart(testUser,testModel)).resolves.toBe(-1);
        });
        
        test("ICD 6.2 Success - product exist", async () => {
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkProductQuantityInCart(testUser,testModel)).resolves.toBe(1);
        });
    });

    describe('ICD 7 getCartId', () => {

        test("ICD 7.1 Success - cart exist", async () => {

            let cartDAO = new CartDAO;
            await expect(cartDAO.getCartId(testUser)).resolves.toBe(1);
        });

        test("ICD 7.2 Error - cart not exist", async () => {
            let cartDAO = new CartDAO;
            await removeProductsFromCart()
            await removeCarts()
            await expect(cartDAO.getCartId(testUser)).rejects.toStrictEqual(new CartNotFoundError());
        });
        
    });

    describe('ICD 8 updateCartTotal', () => {

        test("ICD 8.1 Error -cart not exist", async () => {
            let cartDAO = new CartDAO;

            await expect(cartDAO.updateCartTotal(testUser,10)).rejects.toBe(false);
        });
        
        test("ICD 8.2 Success - total updated correctly", async () => {
            await addCart(1,testUser.username,false,"",20)

            let cartDAO = new CartDAO;
            await expect(cartDAO.updateCartTotal(testUser,10)).resolves.toBe(true);
        });
    });

    describe('ICD 9 resetCartTotal', () => {
        
        test("ICD 9.1 Success - total reset correctly", async () => {
            //await addCart(1,testUser.username,false,"",20)

            let cartDAO = new CartDAO;
            await expect(cartDAO.resetCartTotal(testUser)).resolves.toBe(true);
        });

        test("ICD 9.2 Error -cart not exist", async () => {
            await removeProductsFromCart()
            await removeCarts()
            let cartDAO = new CartDAO;

            await expect(cartDAO.resetCartTotal(testUser)).rejects.toBe(false);
        });
    });

    describe('ICD 10 getCart', () => {

        test("ICD 10.1 Success - cart not already exist", async () => {

            let cartDAO = new CartDAO;
            await expect(cartDAO.getCart(testUser)).resolves.toStrictEqual(new Cart(testUser.username,false,null,0,[]));
        });

        test("ICD 10.1 Success - cart already exist", async () => {
            await addCart(1,testUser.username,false,"",500)
            //await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)

            let cartDAO = new CartDAO;

            await expect(cartDAO.getCart(testUser)).resolves
                .toStrictEqual(new Cart(testUser.username,false,null,500,[new ProductInCart(testModel,1,Category.SMARTPHONE,500)]));
        });

    });

    describe('ICD 11 removeProductFromCart', () => {

        test("ICD 11.1 Success - product in cart with only 1 unit", async () => {
            let cartDAO = new CartDAO;

            await expect(cartDAO.removeProductFromCart(testUser,testModel)).resolves.toBe(true)
        });
        
        test("ICD 11.2 Success - product in cart with more than 1 unit", async () => {
            await removeProductsFromCart()
            await removeProduct()
            await removeCarts()
            await addCart(1,testUser.username,false,"",500)
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)
            await addProductInCart(1,testModel,2,Category.SMARTPHONE,500)

            let cartDAO = new CartDAO;

            await expect(cartDAO.removeProductFromCart(testUser,testModel)).resolves.toBe(true)
        });

        test("ICD 11.3 Error - product not in cart", async () => {
            await removeProductsFromCart()

            let cartDAO = new CartDAO;

            await expect(cartDAO.removeProductFromCart(testUser,testModel)).rejects.toStrictEqual(new ProductNotInCartError())
        });

    });

    describe('ICD 12 checkoutCart', () => {

        test("ICD 12.1 Error - cart not exist", async () => {
            await removeProductsFromCart()
            await removeCarts()
            let cartDAO = new CartDAO;

            await expect(cartDAO.checkoutCart(testUser)).rejects.toStrictEqual(new CartNotFoundError());
        });
        
        test("ICD 12.2 Success ", async () => {
            await removeProduct()
            await addCart(1,testUser.username,false,"",20)
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkoutCart(testUser)).resolves.toBe(true);
        });
    });

    describe('ICD 13 getCustomerCarts', () => {

        test("ICD 13.1 Error - customer doesn't have carts", async () => {
            await removeProductsFromCart()
            await removeProduct()
            await removeCarts()
            //await addCart(1,testUser.username,false,"",20)
            //await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",1)
            //await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)
            let cartDAO = new CartDAO;
            await expect(cartDAO.getCustomerCarts(testUser)).resolves.toStrictEqual([]);
        });

        test("ICD 13.1 Error - customer doesn't have PAIED carts", async () => {
            await addCart(1,testUser.username,false,"",20)
            let cartDAO = new CartDAO;

            await expect(cartDAO.getCustomerCarts(testUser)).resolves.toStrictEqual([]);
        });

        test("ICD 13.1 Succes - customer have once or more paied carts", async () => {
            await addCart(2,testUser.username,true,testDate,100)
            await addCart(3,testUser.username,true,testDate,300)
            await addProduct(testModel,100,Category.SMARTPHONE,"2024-06-20","",1)
            await addProduct("prova",300,Category.SMARTPHONE,"2024-04-18","",1)
            await addProductInCart(2,testModel,1,Category.SMARTPHONE,100)
            await addProductInCart(3,"prova",1,Category.SMARTPHONE,300)

            let cartDAO = new CartDAO;

            await expect(cartDAO.getCustomerCarts(testUser)).resolves.toStrictEqual([
                new Cart(testUser.username,true,testDate,100,[new ProductInCart(testModel,1,Category.SMARTPHONE,100)]),
                new Cart(testUser.username,true,testDate,300,[new ProductInCart("prova",1,Category.SMARTPHONE,300)])
            ])
        });
        
    });

    describe('ICD 14 deleteAllCarts', () => {

        test("ICD 14.1 Succes - all carts deleted", async () => {

            let cartDAO = new CartDAO;

            await expect(cartDAO.deleteAllCarts()).resolves.toBe(true)
        });

        test("ICD 14.2 Succes - no carts to delete", async () => {

            let cartDAO = new CartDAO;

            await expect(cartDAO.deleteAllCarts()).resolves.toBe(true)
        });
    });

    describe('ICD 15 getAllCarts', () => {

        test("ICD 15.1 Error - no carts in db", async () => {
            await removeProductsFromCart()
            await removeCarts()
            let cartDAO = new CartDAO;

            await expect(cartDAO.getAllCarts()).resolves.toStrictEqual([])
        });

        test("ICD 15.2 Error - no PAIED carts in db", async () => {
            await addCart(1,testUser.username,false,null,20)
            await addProduct("modello",20,Category.APPLIANCE,"10-10-2023","",2)
            await addProductInCart(1,"modello",1,Category.APPLIANCE,20)
            let cartDAO = new CartDAO;

            await expect(cartDAO.getAllCarts()).resolves.toStrictEqual([new Cart(testUser.username,false,null,20,
                [new ProductInCart("modello",1,Category.APPLIANCE,20)]
            )])
        });

        test("ICD 15.3 Succes - all carts", async () => {
            addUser(new User("poli","TEST","TEST",Role.CUSTOMER,"",""))
            await addCart(2,testUser.username,true,testDate,100)
            await addCart(3,"poli",true,testDate,300)
            await addProductInCart(2,testModel,1,Category.SMARTPHONE,100)
            await addProductInCart(3,"prova",1,Category.SMARTPHONE,300)
            let cartDAO = new CartDAO;

            await expect(cartDAO.getAllCarts()).resolves.toStrictEqual([
                new Cart(testUser.username,false,null,20,[new ProductInCart("modello",1,Category.APPLIANCE,20)]),
                new Cart(testUser.username,true,testDate,100,[new ProductInCart(testModel,1,Category.SMARTPHONE,100)]),
                new Cart("poli",true,testDate,300,[new ProductInCart("prova",1,Category.SMARTPHONE,300)])
            ])
        });
    });

});

describe('Integration CONTROLLER- DAO - DB', () => {

    beforeAll(async () => {
        await cleanupDB();
        await addUser(testUser);
    });

    describe('ICC 1 addToCart', () => {

        test("ICC 1.1 Success - cart not already exist and product not already in the cart", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartController = new CartController();
            await expect(cartController.addToCart(testUser, testModel)).resolves.toBe(true);
        });

        test("ICC 1.2 Success - product already in the cart and cart exist", async () => {
            let cartController = new CartController();

            await expect(cartController.addToCart(testUser, testModel)).resolves.toBe(true);
        });

        test("ICC 1.3 Error - product  doesn't exist", async () => {
            let cartController = new CartController();

            await expect(cartController.addToCart(testUser, "samsung")).rejects.toStrictEqual(new ProductNotFoundError());
        });

        test("ICC 1.4 Error- product stock not enough", async () => {
            await removeProductsFromCart()
            //await removeCarts()
            await removeProduct()
            await addProduct(testModel,100,Category.SMARTPHONE,"2024-06-20","",0)
            let cartController = new CartController();

            await expect(cartController.addToCart(testUser, testModel)).rejects.toStrictEqual(new EmptyProductStockError());
        });
    });

    describe('ICC 2 getCart', () => {

        test("ICC 2.1 Success - cart already exist", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await addCart(1,testUser.username,false,"",100)
            await addCart(2,testUser.username,true,testDate,100)
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,100)

            //await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartController = new CartController();
            await expect(cartController.getCart(testUser)).resolves.toStrictEqual(new Cart(testUser.username,false,null,100,[
                new ProductInCart(testModel,1,Category.SMARTPHONE,100)
            ]));
        });

        test("ICC 2.2 Error- cart not exist", async () => {
            await removeProductsFromCart()
            await removeCarts()
            //await removeProduct()
            //await addProduct(testModel,100,Category.SMARTPHONE,"2024-06-20","",0)
            let cartController = new CartController();

            await expect(cartController.getCart(testUser)).resolves.toStrictEqual(new Cart(testUser.username,false,null,0,[]));
        });
    });

    describe('ICC 3 checkoutCart', () => {

        test("ICC 3.1 Error- cart not exist", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            let cartController = new CartController();

            await expect(cartController.checkoutCart(testUser)).rejects.toStrictEqual(new CartNotFoundError());
        });

        test("ICC 3.2 Error- cart exist but is empty", async () => {
            await addCart(1,testUser.username,false,"",100)
            await addCart(2,testUser.username,true,testDate,100)
            let cartController = new CartController();

            await expect(cartController.checkoutCart(testUser)).rejects.toStrictEqual(new EmptyCartError());
        });

        test("ICC 3.3 Error- empty product stock", async () => {
            await addProduct(testModel,100,Category.SMARTPHONE,testDate,"",0)
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,100)
            let cartController = new CartController();

            await expect(cartController.checkoutCart(testUser)).rejects.toStrictEqual(new EmptyProductStockError());
        });

        test("ICC 3.4 Error- product stock not enough", async () => {
            await removeProductsFromCart()
            await removeProduct()
            await addProduct(testModel,100,Category.SMARTPHONE,testDate,"",1)
            await addProductInCart(1,testModel,2,Category.SMARTPHONE,100)
            let cartController = new CartController();

            await expect(cartController.checkoutCart(testUser)).rejects.toStrictEqual(new LowProductStockError());
        });

        test("ICC 3.5 Success checkout", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            await addCart(1,testUser.username,false,"",100)
            await addCart(2,testUser.username,true,testDate,300)
            await addProduct(testModel,100,Category.SMARTPHONE,"20/01/2024","",1)
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,100)

            //await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartController = new CartController();
            await expect(cartController.checkoutCart(testUser)).resolves.toBe(true);
        });        
    });


    describe('ICC 4 getCustomerCarts', () => {

        test("ICC 4.1 Error- not exist PAID carts", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            let cartController = new CartController();

            await expect(cartController.getCustomerCarts(testUser)).resolves.toStrictEqual([]);
        });

        test("ICC 4.2 Success", async () => {
            
            await addCart(1,testUser.username,false,"",100)
            await addCart(2,testUser.username,true,testDate,300)
            await addProduct(testModel,100,Category.SMARTPHONE,"20/01/2024","",1)
            await addProductInCart(2,testModel,1,Category.SMARTPHONE,300)

            //await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartController = new CartController();
            await expect(cartController.getCustomerCarts(testUser)).resolves.toStrictEqual([new Cart(testUser.username,true,testDate,300,
                [new ProductInCart(testModel,1,Category.SMARTPHONE,300)])]);
        });        
    });

    describe('ICC 5 removeProductFromCart', () => {

        test("ICC 5.1 Error- product not exist", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            let cartController = new CartController();

            await expect(cartController.removeProductFromCart(testUser,testModel)).rejects.toStrictEqual(new ProductNotFoundError());
        });

        test("ICC 5.2 Error- cart not exist", async () => {
            await addProduct(testModel,100,Category.SMARTPHONE,"20/01/2024","",1)
            await addProduct("prova",50,Category.SMARTPHONE,"20/01/2024","",1)

            let cartController = new CartController();
            await expect(cartController.removeProductFromCart(testUser,testModel)).rejects.toStrictEqual(new CartNotFoundError());
        });  
        
        test("ICC 5.3 Error- product not in cart", async () => {
            
            await addCart(1,testUser.username,false,"",100)
            await addProductInCart(1,"prova",1,Category.SMARTPHONE,50)
            //await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)

            let cartController = new CartController();
            await expect(cartController.removeProductFromCart(testUser,testModel)).rejects.toStrictEqual(new ProductNotInCartError());
        }); 

        test("ICC 5.4 Succes", async () => {
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,50)

            let cartController = new CartController();
            await expect(cartController.removeProductFromCart(testUser,testModel)).resolves.toBe(true);
        }); 
    });

    describe('ICC 6 clearCart', () => {

        test("ICC 6.1 Succes", async () => {
            let cartController = new CartController();
            await expect(cartController.clearCart(testUser)).resolves.toBe(true);
        });

        test("ICC 6.2 Error- no cart to clear", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            let cartController = new CartController();

            await expect(cartController.clearCart(testUser)).rejects.toStrictEqual(new CartNotFoundError());
        });  
    });

    describe('ICC 7 deleteAllCarts', () => {

        test("ICC 7.1 Error- no cart to delete", async () => {
            let cartController = new CartController();
            await expect(cartController.deleteAllCarts()).resolves.toBe(true);
        });  

        test("ICC 7.2 Succes", async () => {
            //await removeCarts()
            await addUser(new User("altro","","",Role.CUSTOMER,"",""))
            await addCart(1,testUser.username,false,"",100)
            await addCart(2,"altro",true,testDate,300)
            
            let cartController = new CartController();
            await expect(cartController.deleteAllCarts()).resolves.toBe(true);
        });
    });

    describe('ICC 8 getAllCarts', () => {

        test("ICC 8.1 Error- not exist PAID carts", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            let cartController = new CartController();

            await expect(cartController.getAllCarts()).resolves.toStrictEqual([]);
        });

        test("ICC 8.2 Success", async () => {
            
            await addCart(1,testUser.username,false,null,100)
            await addCart(2,testUser.username,true,testDate,200)
            await addCart(3,"altro",true,testDate,300)
            await addProduct(testModel,200,Category.SMARTPHONE,"20/01/2024","",1)
            await addProduct("pc",300,Category.LAPTOP,"20/05/2024","",1)
            await addProduct("samsung",100,Category.SMARTPHONE,"27/02/2024","",2)
            await addProductInCart(2,testModel,1,Category.SMARTPHONE,200)
            await addProductInCart(3,"pc",1,Category.LAPTOP,300)
            await addProductInCart(1,"samsung",1,Category.SMARTPHONE,100)

            //await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartController = new CartController();
            await expect(cartController.getAllCarts()).resolves.toStrictEqual([
                new Cart(testUser.username,false,null,100,
                    [new ProductInCart("samsung",1,Category.SMARTPHONE,100)]),
                new Cart(testUser.username,true,testDate,200,
                    [new ProductInCart(testModel,1,Category.SMARTPHONE,200)]),
                new Cart("altro",true,testDate,300,
                    [new ProductInCart("pc",1,Category.LAPTOP,300)])
                ]);
        });        
    });
});

describe('Integration ROUTE - CONTROLLER - DAO - DB', () => {
    const baseURL = "/ezelectronics"
    //let app: express.Application;

    //Default user information. We use them to create users and evaluate the returned values
    const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer"}
    const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" }
    //Cookies for the users. We use them to keep users logged in. Creating them once and saving them in a variables outside of the tests will make cookies reusable
    let customerCookie: string
    let adminCookie: string

    //Helper function that creates a new user in the database.
    //Can be used to create a user before the tests or in the tests
    //Is an implicit test because it checks if the return code is successful
    const postUser = async (userInfo: any) => {
        await request(app)
            .post(`${baseURL}/users`)
            .send(userInfo)
            .expect(200)
    }

    //Helper function that logs in a user and returns the cookie
    //Can be used to log in a user before the tests or in the tests
    const login = async (userInfo: any) => {
        return new Promise<string>((resolve, reject) => {
            request(app)
                .post(`${baseURL}/sessions`)
                .send(userInfo)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res.header["set-cookie"][0])
                })
        })
    }

    describe("ICR 1 GET /ezelectronics/carts/", () => {
        test("ICR 1.1 Correct unexisting cart", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            await removeUser()
            await postUser(customer)
            customerCookie = await login(customer)

            const response = await request(app).get(`${baseURL}/carts/`).set("Cookie", customerCookie)
            expect(response.status).toBe(200);
            
            let cart = response.body
            expect(cart).toBeDefined()
            expect(cart.customer).toBe(customer.name)
            expect(cart.paid).toBe(false)
            expect(cart.products).toStrictEqual([])

        });

        test("ICR 1.2 Correct get carts", async () => {
            await removeProductsFromCart()
            await removeCarts()
            //await removeProduct()
            //await removeUser()
            //await addUser(new User(customer.username,customer.name,customer.surname,Role.CUSTOMER,"",""))
            
            //await postUser(customer)
            customerCookie = await login(customer)

            await addCart(1,customer.username,false,null,20)
            await addProduct(testModel,20,Category.APPLIANCE,"10-04-2022","",2)
            await addProductInCart(1,testModel,1,Category.APPLIANCE,20)

            const response = await request(app).get(`${baseURL}/carts/`).set("Cookie", customerCookie)
            expect(response.status).toBe(200);
            
            let cart = response.body
            expect(cart).toBeDefined()
            expect(cart.customer).toBe(customer.name)
            expect(cart.paid).toBe(false)
            //expect(cart.products).toStrictEqual([new ProductInCart(testModel,1,Category.APPLIANCE,20).])
            expect(cart.products).toStrictEqual([{model:testModel, quantity:1, category:Category.APPLIANCE, price:20}])
        });
    });
    
    describe("ICR 2 POST /ezelectronics/carts/", () => {
        test("ICR 2.1 Correct added product to cart", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            //await addCart(1,customer.username,false,null,20)
            customerCookie = await login(customer)

            const response = await request(app).post(`${baseURL}/carts/`).send({model:testModel}).set("Cookie", customerCookie)
            expect(response.status).toBe(200);

        });

        test("ICR 2.2 error product doesn't exist", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            customerCookie = await login(customer)

            const response = await request(app).post(`${baseURL}/carts/`).send({model:testModel}).set("Cookie", customerCookie)
            expect(response.status).toBe(404);
            expect(response.body.error).toStrictEqual(new ProductNotFoundError().customMessage)
        });

        test("ICR 2.3 error product stock==0", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            await addProduct(testModel,20,Category.APPLIANCE,"10-02-2023","",0)
            customerCookie = await login(customer)

            const response = await request(app).post(`${baseURL}/carts/`).send({model:testModel}).set("Cookie", customerCookie)
            expect(response.status).toBe(409);
            expect(response.body.error).toStrictEqual(new EmptyProductStockError().customMessage)
        });

    });

    describe("ICR 3 PATCH /ezelectronics/carts/", () => {
        test("ICR 3.1 Correct checkout cart", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            await addCart(1,customer.username,false,null,20)
            await removeProduct()
            await addProduct(testModel,20,Category.APPLIANCE,"10-02-2023","",1)
            await addProductInCart(1,testModel,1,Category.APPLIANCE,20)
            customerCookie = await login(customer)

            const response = await request(app).patch(`${baseURL}/carts/`).set("Cookie", customerCookie)
            expect(response.status).toBe(200);
        });

        test("ICR 3.2 cart to checkout doesn't exist", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            //await removeProduct()
            //await addProduct(testModel,20,Category.APPLIANCE,"10-02-2023","",1)
            //await addProductInCart(1,testModel,1,Category.APPLIANCE,20)
            customerCookie = await login(customer)

            const response = await request(app).patch(`${baseURL}/carts/`).set("Cookie", customerCookie)
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(new CartNotFoundError().customMessage)
        });

        test("ICR 3.3 cart contains no product", async ()=>{
            //await removeProductsFromCart()
            //await removeCarts()
            await addCart(1,customer.username,false,null,0)
            //await removeProduct()
            //await addProduct(testModel,20,Category.APPLIANCE,"10-02-2023","",1)
            //await addProductInCart(1,testModel,1,Category.APPLIANCE,20)
            customerCookie = await login(customer)

            const response = await request(app).patch(`${baseURL}/carts/`).set("Cookie", customerCookie)
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(new EmptyCartError().customMessage)
        });

        test("ICR 3.4 at least one product in cart has stock=0", async ()=>{
            //await removeProductsFromCart()
            //await removeCarts()
            //await addCart(1,customer.username,false,null,0)
            await removeProduct()
            await addProduct(testModel,20,Category.APPLIANCE,"10-02-2023","",0)
            await addProductInCart(1,testModel,1,Category.APPLIANCE,20)
            customerCookie = await login(customer)

            const response = await request(app).patch(`${baseURL}/carts/`).set("Cookie", customerCookie)
            expect(response.status).toBe(409);
            expect(response.body.error).toBe(new EmptyProductStockError().customMessage)
        });

        test("ICR 3.5 at least one product in cart has stock<quantity in cart", async ()=>{
            await removeProductsFromCart()
            //await removeCarts()
            //await addCart(1,customer.username,false,null,0)
            await removeProduct()
            await addProduct(testModel,20,Category.APPLIANCE,"10-02-2023","",1)
            await addProductInCart(1,testModel,2,Category.APPLIANCE,20)
            customerCookie = await login(customer)

            const response = await request(app).patch(`${baseURL}/carts/`).set("Cookie", customerCookie)
            expect(response.status).toBe(409);
            expect(response.body.error).toBe(new LowProductStockError().customMessage)
        });
    });

    describe("ICR 4 GET /ezelectronics/carts/history", () => {
        test("ICR 4.1 Correct history get", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            await addCart(1,customer.username,false,null,0)
            await addCart(2,customer.username,true,"20-03-2024",100)
            await addProduct(testModel,50,Category.SMARTPHONE,"10-01-2024","",3)
            await addProductInCart(2,testModel,2,Category.SMARTPHONE,50)
            customerCookie = await login(customer)

            const response = await request(app).get(`${baseURL}/carts/history`).set("Cookie", customerCookie)
            expect(response.status).toBe(200);
            
            let carts = response.body
            expect(carts).toBeDefined()
            expect(carts[0].customer).toBe(customer.name)
            expect(carts[0].paid).toBe(true)
            expect(carts[0].products).toStrictEqual([{model:testModel, quantity:2, category:Category.SMARTPHONE, price:50}])

        });
    });

    describe("ICR 5 DELETE /ezelectronics/carts/products/:model", () => {
        test("ICR 5.1 Correct delete with quantity>1", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            await addCart(1,customer.username,false,null,0)
            //await addCart(2,customer.username,true,"20-03-2024",100)
            await addProduct(testModel,50,Category.SMARTPHONE,"10-01-2024","",3)
            await addProductInCart(1,testModel,2,Category.SMARTPHONE,50)
            customerCookie = await login(customer)

            const response = await request(app).delete(`${baseURL}/carts/products/${testModel}`).set("Cookie", customerCookie)
            expect(response.status).toBe(200);

        });

        test("ICR 5.2 Correct delete with quantity==1", async ()=>{
            /*await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            await addCart(1,customer.username,false,null,0)
            //await addCart(2,customer.username,true,"20-03-2024",100)
            await addProduct(testModel,50,Category.SMARTPHONE,"10-01-2024","",3)
            await addProductInCart(2,testModel,2,Category.SMARTPHONE,50)*/
            customerCookie = await login(customer)

            const response = await request(app).delete(`${baseURL}/carts/products/${testModel}`).set("Cookie", customerCookie)
            expect(response.status).toBe(200);

        });

        test("ICR 5.3 Error product not in cart", async ()=>{
            /*await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            await addCart(1,customer.username,false,null,0)
            //await addCart(2,customer.username,true,"20-03-2024",100)
            await addProduct(testModel,50,Category.SMARTPHONE,"10-01-2024","",3)
            await addProductInCart(2,testModel,2,Category.SMARTPHONE,50)*/
            customerCookie = await login(customer)

            const response = await request(app).delete(`${baseURL}/carts/products/${testModel}`).set("Cookie", customerCookie)
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(new ProductNotInCartError().customMessage)
        });

        test("ICR 5.4 Error cart not exist", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            //await removeProduct()
            //await addCart(1,customer.username,false,null,0)
            //await addCart(2,customer.username,true,"20-03-2024",100)
            //await addProduct(testModel,50,Category.SMARTPHONE,"10-01-2024","",3)
            //await addProductInCart(2,testModel,2,Category.SMARTPHONE,50)*/
            customerCookie = await login(customer)

            const response = await request(app).delete(`${baseURL}/carts/products/${testModel}`).set("Cookie", customerCookie)
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(new CartNotFoundError().customMessage)
        });

        test("ICR 5.5 Error cart is empty", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            //await removeProduct()
            await addCart(1,customer.username,false,null,0)
            //await addCart(2,customer.username,true,"20-03-2024",100)
            //await addProduct(testModel,50,Category.SMARTPHONE,"10-01-2024","",3)
            //await addProductInCart(2,testModel,2,Category.SMARTPHONE,50)*/
            customerCookie = await login(customer)

            const response = await request(app).delete(`${baseURL}/carts/products/${testModel}`).set("Cookie", customerCookie)
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(new ProductNotInCartError().customMessage)
        });

        test("ICR 5.6 Error cart is empty", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            await addCart(1,customer.username,false,null,0)
            //await addCart(2,customer.username,true,"20-03-2024",100)
            //await addProduct(testModel,50,Category.SMARTPHONE,"10-01-2024","",3)
            //await addProductInCart(2,testModel,2,Category.SMARTPHONE,50)*/
            customerCookie = await login(customer)

            const response = await request(app).delete(`${baseURL}/carts/products/${testModel}`).set("Cookie", customerCookie)
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(new ProductNotFoundError().customMessage)
        });
    });

    describe("ICR 6 DELETE /ezelectronics/carts/current", () => {

        test("ICR 6.1 Correct delete cart", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            await addCart(1,customer.username,false,null,100)
            //await addCart(2,customer.username,true,"20-03-2024",100)
            await addProduct(testModel,50,Category.SMARTPHONE,"10-01-2024","",3)
            await addProductInCart(1,testModel,2,Category.SMARTPHONE,50)
            customerCookie = await login(customer)

            const response = await request(app).delete(`${baseURL}/carts/current`).set("Cookie", customerCookie)
            expect(response.status).toBe(200);

        });

        test("ICR 6.2 Error don't exist any unpaid cart", async ()=>{
            await removeCarts()
            customerCookie = await login(customer)

            const response = await request(app).delete(`${baseURL}/carts/current`).set("Cookie", customerCookie)
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(new CartNotFoundError().customMessage)

        });

    });

    describe("ICR 7 DELETE /ezelectronics/carts", () => {

        test("ICR 7.1 Error user is not an admin", async ()=>{
            await addUser(testUser)
            await addCart(1,customer.username,false,null,100)
            await addCart(2,testUser.username,true,"20-03-2024",100)
            //await addProduct(testModel,50,Category.SMARTPHONE,"10-01-2024","",3)
            await addProductInCart(1,testModel,2,Category.SMARTPHONE,50)
            await addProductInCart(2,testModel,2,Category.SMARTPHONE,50)
            customerCookie = await login(customer)

            const response = await request(app).delete(`${baseURL}/carts`).set("Cookie", customerCookie)
            expect(response.status).toBe(401);

        });

        test("ICR 7.2 Correct delete of all carts", async ()=>{
            await removeProductsFromCart()
            await removeProduct()
            await removeCarts()
            await removeUser()
            await postUser(admin)
            await postUser(customer)
            adminCookie = await login(admin)
            await addUser(testUser)
            await addCart(1,customer.username,false,null,100)
            await addCart(2,testUser.username,true,"20-03-2024",100)
            await addProduct(testModel,50,Category.SMARTPHONE,"10-01-2024","",3)
            await addProductInCart(1,testModel,2,Category.SMARTPHONE,50)
            await addProductInCart(2,testModel,2,Category.SMARTPHONE,50)

            const response = await request(app).delete(`${baseURL}/carts`).set("Cookie", adminCookie)
            expect(response.status).toBe(200);

        });
    });

    describe("ICR 8 GET /ezelectronics/carts", () => {

        test("ICR 8.1 Error user is not an admin", async ()=>{
            //await addUser(testUser)
            await addCart(1,customer.username,false,null,100)
            await addCart(2,testUser.username,true,"20-03-2024",100)
            //await addProduct(testModel,50,Category.SMARTPHONE,"10-01-2024","",3)
            await addProductInCart(1,testModel,2,Category.SMARTPHONE,50)
            await addProductInCart(2,testModel,2,Category.SMARTPHONE,50)
            customerCookie = await login(customer)

            const response = await request(app).get(`${baseURL}/carts/all`).set("Cookie", customerCookie)
            expect(response.status).toBe(401);

        });

        test("ICR 8.2 Correct return all carts", async ()=>{
            adminCookie = await login(admin)

            const response = await request(app).get(`${baseURL}/carts/all`).set("Cookie", adminCookie)
            expect(response.status).toBe(200);
            let carts = response.body
            expect(carts).toBeDefined()

        });
    });

});