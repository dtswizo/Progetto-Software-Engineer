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

    describe('addToCart', () => {

        test("Success - cart not already exist and product not already in the cart", async () => {
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartDAO = new CartDAO;
            await expect(cartDAO.addToCart(testUser, testModel)).resolves.toBe(true);
        });

        test("Success - product already in the cart and cart exist", async () => {
            let cartDAO = new CartDAO;

            await expect(cartDAO.addToCart(testUser, testModel)).resolves.toBe(true);
        });

    });

    describe('checkIfCartExists', () => {

        test("Error - cart not exist", async () => {
            await removeProductsFromCart();
            await removeCarts();
            let cartDAO = new CartDAO;

            await expect(cartDAO.checkIfCartExists(testUser)).resolves.toBe(false);
        });
        
        test("Success - cart already exist", async () => {
            await addCart(1,testUser.username,false,"",20)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkIfCartExists(testUser)).resolves.toBe(true);
        });

    });

    describe('checkIfProductExists', () => {

        test("Error - product not exist", async () => {
            await removeProduct()
            let cartDAO = new CartDAO;

            await expect(cartDAO.checkIfProductExists(testModel)).resolves.toBe(false);
        });
        
        test("Success - product exist", async () => {
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkIfProductExists(testModel)).resolves.toBe(true);
        });
    });

    describe('checkIfProductExistsInCart', () => {

        test("Error - product not exist in cart", async () => {
            let cartDAO = new CartDAO;

            await expect(cartDAO.checkIfProductExistsInCart(testUser,testModel)).resolves.toBe(false);
        });
        
        test("Success - product exist", async () => {
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkIfProductExistsInCart(testUser,testModel)).resolves.toBe(true);
        });
    });

    describe('checkProductAvailability', () => {

        test("Error - product not exist", async () => {
            let cartDAO = new CartDAO;
            await removeProductsFromCart()
            await removeProduct()
            await expect(cartDAO.checkProductAvailability(testModel)).resolves.toBe(-1);
        });
        
        test("Success - product exist", async () => {
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkProductAvailability(testModel)).resolves.toBe(2);
        });
    });

    describe('checkProductQuantityInCart', () => {

        test("Error - product not exist in cart", async () => {
            //await addCart(1,testUser.username,false,"",20)
            let cartDAO = new CartDAO;

            await expect(cartDAO.checkProductQuantityInCart(testUser,testModel)).resolves.toBe(-1);
        });
        
        test("Success - product exist", async () => {
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkProductQuantityInCart(testUser,testModel)).resolves.toBe(1);
        });
    });

    describe('getCartId', () => {

        test("Success - cart exist", async () => {

            let cartDAO = new CartDAO;
            await expect(cartDAO.getCartId(testUser)).resolves.toBe(1);
        });

        test("Error - cart not exist", async () => {
            let cartDAO = new CartDAO;
            await removeProductsFromCart()
            await removeCarts()
            await expect(cartDAO.getCartId(testUser)).rejects.toStrictEqual(new CartNotFoundError());
        });
        
    });

    describe('updateCartTotal', () => {

        test("Error -cart not exist", async () => {
            let cartDAO = new CartDAO;

            await expect(cartDAO.updateCartTotal(testUser,10)).rejects.toBe(false);
        });
        
        test("Success - total updated correctly", async () => {
            await addCart(1,testUser.username,false,"",20)

            let cartDAO = new CartDAO;
            await expect(cartDAO.updateCartTotal(testUser,10)).resolves.toBe(true);
        });
    });

    describe('resetCartTotal', () => {
        
        test("Success - total reset correctly", async () => {
            //await addCart(1,testUser.username,false,"",20)

            let cartDAO = new CartDAO;
            await expect(cartDAO.resetCartTotal(testUser)).resolves.toBe(true);
        });

        test("Error -cart not exist", async () => {
            await removeProductsFromCart()
            await removeCarts()
            let cartDAO = new CartDAO;

            await expect(cartDAO.resetCartTotal(testUser)).rejects.toBe(false);
        });
    });

    describe('getCart', () => {

        test("Success - cart not already exist", async () => {

            let cartDAO = new CartDAO;
            await expect(cartDAO.getCart(testUser)).resolves.toStrictEqual(new Cart(testUser.username,false,null,0,[]));
        });

        test("Success - cart already exist", async () => {
            await addCart(1,testUser.username,false,"",500)
            //await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)

            let cartDAO = new CartDAO;

            await expect(cartDAO.getCart(testUser)).resolves
                .toStrictEqual(new Cart(testUser.username,false,null,500,[new ProductInCart(testModel,1,Category.SMARTPHONE,500)]));
        });

    });

    describe('removeProductFromCart', () => {

        test("Success - product in cart with only 1 unit", async () => {
            let cartDAO = new CartDAO;

            await expect(cartDAO.removeProductFromCart(testUser,testModel)).resolves.toBe(true)
        });
        
        test("Success - product in cart with more than 1 unit", async () => {
            await removeProductsFromCart()
            await removeProduct()
            await removeCarts()
            await addCart(1,testUser.username,false,"",500)
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)
            await addProductInCart(1,testModel,2,Category.SMARTPHONE,500)

            let cartDAO = new CartDAO;

            await expect(cartDAO.removeProductFromCart(testUser,testModel)).resolves.toBe(true)
        });

        test("Error - product not in cart", async () => {
            await removeProductsFromCart()

            let cartDAO = new CartDAO;

            await expect(cartDAO.removeProductFromCart(testUser,testModel)).rejects.toStrictEqual(new ProductNotInCartError())
        });

    });

    describe('checkoutCart', () => {
        /* controllo fatto nel controller e non nel dao
        test("Error - product stock not enough", async () => {
            await removeProductsFromCart()
            await removeProduct()
            await removeCarts()
            await addCart(1,testUser.username,false,"",20)
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",1)
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)
            let cartDAO = new CartDAO;
            await expect(cartDAO.checkoutCart(testUser)).rejects.toBe(Error);
        });*/

        /* impossibile a causa dei constraints del db
        test("Error - product in cart not exist", async () => {
            await removeProductsFromCart()
            let cartDAO = new CartDAO;

            await expect(cartDAO.checkoutCart(testUser)).rejects.toStrictEqual(new ProductNotFoundError());
        });
        */

        test("Error - cart not exist", async () => {
            await removeProductsFromCart()
            await removeCarts()
            let cartDAO = new CartDAO;

            await expect(cartDAO.checkoutCart(testUser)).rejects.toStrictEqual(new CartNotFoundError());
        });
        
        test("Success ", async () => {
            await removeProduct()
            await addCart(1,testUser.username,false,"",20)
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)

            let cartDAO = new CartDAO;
            await expect(cartDAO.checkoutCart(testUser)).resolves.toBe(true);
        });
    });

    describe('getCustomerCarts', () => {

        test("Error - customer doesn't have carts", async () => {
            await removeProductsFromCart()
            await removeProduct()
            await removeCarts()
            //await addCart(1,testUser.username,false,"",20)
            //await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",1)
            //await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)
            let cartDAO = new CartDAO;
            await expect(cartDAO.getCustomerCarts(testUser)).resolves.toStrictEqual([]);
        });

        test("Error - customer doesn't have PAIED carts", async () => {
            await addCart(1,testUser.username,false,"",20)
            let cartDAO = new CartDAO;

            await expect(cartDAO.getCustomerCarts(testUser)).resolves.toStrictEqual([]);
        });

        test("Succes - customer have once or more paied carts", async () => {
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

    describe('deleteAllCarts', () => {

        test("Succes - all carts deleted", async () => {

            let cartDAO = new CartDAO;

            await expect(cartDAO.deleteAllCarts()).resolves.toBe(true)
        });

        test("Succes - no carts to delete", async () => {

            let cartDAO = new CartDAO;

            await expect(cartDAO.deleteAllCarts()).resolves.toBe(true)
        });
    });

    describe('getAllCarts', () => {

        test("Error - no carts in db", async () => {
            await removeProductsFromCart()
            await removeCarts()
            let cartDAO = new CartDAO;

            await expect(cartDAO.getAllCarts()).resolves.toStrictEqual([])
        });

        test("Error - no PAIED carts in db", async () => {
            await addCart(1,testUser.username,false,null,20)
            await addProduct("modello",20,Category.APPLIANCE,"10-10-2023","",2)
            await addProductInCart(1,"modello",1,Category.APPLIANCE,20)
            let cartDAO = new CartDAO;

            await expect(cartDAO.getAllCarts()).resolves.toStrictEqual([new Cart(testUser.username,false,null,20,
                [new ProductInCart("modello",1,Category.APPLIANCE,20)]
            )])
        });

        test("Succes - all carts", async () => {
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

    describe('addToCart', () => {

        test("Success - cart not already exist and product not already in the cart", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartController = new CartController();
            await expect(cartController.addToCart(testUser, testModel)).resolves.toBe(true);
        });

        test("Success - product already in the cart and cart exist", async () => {
            let cartController = new CartController();

            await expect(cartController.addToCart(testUser, testModel)).resolves.toBe(true);
        });

        test("Error - product  doesn't exist", async () => {
            let cartController = new CartController();

            await expect(cartController.addToCart(testUser, "samsung")).rejects.toStrictEqual(new ProductNotFoundError());
        });

        test("Error- product stock not enough", async () => {
            await removeProductsFromCart()
            //await removeCarts()
            await removeProduct()
            await addProduct(testModel,100,Category.SMARTPHONE,"2024-06-20","",0)
            let cartController = new CartController();

            await expect(cartController.addToCart(testUser, testModel)).rejects.toStrictEqual(new EmptyProductStockError());
        });
    });

    describe('getCart', () => {

        test("Success - cart already exist", async () => {
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

        test("Error- cart not exist", async () => {
            await removeProductsFromCart()
            await removeCarts()
            //await removeProduct()
            //await addProduct(testModel,100,Category.SMARTPHONE,"2024-06-20","",0)
            let cartController = new CartController();

            await expect(cartController.getCart(testUser)).resolves.toStrictEqual(new Cart(testUser.username,false,null,0,[]));
        });
    });

    describe('checkoutCart', () => {

        test("Error- cart not exist", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            let cartController = new CartController();

            await expect(cartController.checkoutCart(testUser)).rejects.toStrictEqual(new CartNotFoundError());
        });

        test("Error- cart exist but is empty", async () => {
            await addCart(1,testUser.username,false,"",100)
            await addCart(2,testUser.username,true,testDate,100)
            let cartController = new CartController();

            await expect(cartController.checkoutCart(testUser)).rejects.toStrictEqual(new EmptyCartError());
        });

        test("Error- empty product stock", async () => {
            await addProduct(testModel,100,Category.SMARTPHONE,testDate,"",0)
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,100)
            let cartController = new CartController();

            await expect(cartController.checkoutCart(testUser)).rejects.toStrictEqual(new EmptyProductStockError());
        });

        test("Error- product stock not enough", async () => {
            await removeProductsFromCart()
            await removeProduct()
            await addProduct(testModel,100,Category.SMARTPHONE,testDate,"",1)
            await addProductInCart(1,testModel,2,Category.SMARTPHONE,100)
            let cartController = new CartController();

            await expect(cartController.checkoutCart(testUser)).rejects.toStrictEqual(new LowProductStockError());
        });

        test("Success checkout", async () => {
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


    describe('getCustomerCarts', () => {

        test("Error- not exist PAID carts", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            let cartController = new CartController();

            await expect(cartController.getCustomerCarts(testUser)).resolves.toStrictEqual([]);
        });

        test("Success", async () => {
            
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

    describe('removeProductFromCart', () => {

        test("Error- product not exist", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            let cartController = new CartController();

            await expect(cartController.removeProductFromCart(testUser,testModel)).rejects.toStrictEqual(new ProductNotFoundError());
        });

        test("Error- cart not exist", async () => {
            await addProduct(testModel,100,Category.SMARTPHONE,"20/01/2024","",1)
            await addProduct("prova",50,Category.SMARTPHONE,"20/01/2024","",1)

            let cartController = new CartController();
            await expect(cartController.removeProductFromCart(testUser,testModel)).rejects.toStrictEqual(new CartNotFoundError());
        });  
        
        test("Error- product not in cart", async () => {
            
            await addCart(1,testUser.username,false,"",100)
            await addProductInCart(1,"prova",1,Category.SMARTPHONE,50)
            //await addProductInCart(1,testModel,1,Category.SMARTPHONE,500)

            let cartController = new CartController();
            await expect(cartController.removeProductFromCart(testUser,testModel)).rejects.toStrictEqual(new ProductNotInCartError());
        }); 

        test("Succes", async () => {
            await addProductInCart(1,testModel,1,Category.SMARTPHONE,50)

            let cartController = new CartController();
            await expect(cartController.removeProductFromCart(testUser,testModel)).resolves.toBe(true);
        }); 
    });

    describe('clearCart', () => {

        test("Succes", async () => {
            let cartController = new CartController();
            await expect(cartController.clearCart(testUser)).resolves.toBe(true);
        });

        test("Error- no cart to clear", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            let cartController = new CartController();

            await expect(cartController.clearCart(testUser)).rejects.toStrictEqual(new CartNotFoundError());
        });  
    });

    describe('deleteAllCarts', () => {

        test("Error- no cart to delete", async () => {
            let cartController = new CartController();
            await expect(cartController.deleteAllCarts()).resolves.toBe(true);
        });  

        test("Succes", async () => {
            //await removeCarts()
            await addUser(new User("altro","","",Role.CUSTOMER,"",""))
            await addCart(1,testUser.username,false,"",100)
            await addCart(2,"altro",true,testDate,300)
            
            let cartController = new CartController();
            await expect(cartController.deleteAllCarts()).resolves.toBe(true);
        });
    });

    describe('getAllCarts', () => {

        test("Error- not exist PAID carts", async () => {
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            let cartController = new CartController();

            await expect(cartController.getAllCarts()).resolves.toStrictEqual([]);
        });

        test("Success", async () => {
            
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

    describe("GET /ezelectronics/carts/", () => {
        test("Correct unexisting cart", async ()=>{
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

        test("Correct get carts", async () => {
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
    
    describe("POST /ezelectronics/carts/", () => {
        test("Correct added product to cart", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            //await addCart(1,customer.username,false,null,20)
            customerCookie = await login(customer)

            const response = await request(app).post(`${baseURL}/carts/`).send({model:testModel}).set("Cookie", customerCookie)
            expect(response.status).toBe(200);

        });

        test("error product doesn't exist", async ()=>{
            await removeProductsFromCart()
            await removeCarts()
            await removeProduct()
            customerCookie = await login(customer)

            const response = await request(app).post(`${baseURL}/carts/`).send({model:testModel}).set("Cookie", customerCookie)
            expect(response.status).toBe(404);
            expect(response.body.error).toStrictEqual(new ProductNotFoundError().customMessage)
        });

        test("error product stock==0", async ()=>{
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

    describe("PATCH /ezelectronics/carts/", () => {
        test("Correct checkout cart", async ()=>{
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

        test("cart to checkout doesn't exist", async ()=>{
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

        test("cart contains no product", async ()=>{
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

        test("at least one product in cart has stock=0", async ()=>{
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

        test("at least one product in cart has stock<quantity in cart", async ()=>{
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

    describe("GET /ezelectronics/carts/history", () => {
        test("Correct history get", async ()=>{
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
            console.log(carts)
            expect(carts[0].customer).toBe(customer.name)
            expect(carts[0].paid).toBe(true)
            expect(carts[0].products).toStrictEqual([{model:testModel, quantity:2, category:Category.SMARTPHONE, price:50}])

        });
    });

    describe("DELETE /ezelectronics/carts/products/:model", () => {
        test("Correct delete with quantity>1", async ()=>{
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

        test("Correct delete with quantity==1", async ()=>{
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

        test("Error product not in cart", async ()=>{
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
            expect(response.body.error).toBe(new ProductNotFoundError().customMessage)
        });

        test("Error cart not exist", async ()=>{
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

        test("Error cart is empty", async ()=>{
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

        test("Error cart is empty", async ()=>{
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


    //fare delete ezelectronics/cart/current
});