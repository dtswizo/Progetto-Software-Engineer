import { expect, jest ,test} from '@jest/globals';
import request from 'supertest'
import express from 'express';
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from '../src/testUtilities'

import cartController from '../src/controllers/cartController';
import { User, Role } from '../src/components/user';
import { Category } from '../src/components/product';
import { EmptyProductStockError, ProductNotFoundError } from '../src/errors/productError';
import { ExistingReviewError, NoReviewProductError } from '../src/errors/reviewError';
import { ProductReview } from '../src/components/review';
import { cleanup, cleanupDB } from '../src/db/cleanup';
import db from "../src/db/db"
import CartDAO from '../src/dao/cartDAO';

const testUser = new User('MarioRossi',
    'Mario',
    'Rossi',
    Role.CUSTOMER,
    '',
    ''
);
const testModel = 'iPhone13';
const testDate = new Date('2024-05-21').toISOString().split('T')[0];

const addUser = async (user: User) => {
    const sqlUser = "INSERT INTO users(username, name, surname, role) VALUES(?, ?, ?, ?)"
    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sqlUser, [user.username, user.name, user.surname, user.role], (err) => {
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



describe('Integration DAO - DB', () => {

    beforeAll(async () => {
        cleanup();
        await addUser(testUser);
    });

    describe('addToCart', () => {

        test("Success - cart not already exist and product not already in the cart", async () => {
            await addProduct(testModel,500,Category.SMARTPHONE,"2024-04-18","",2)

            let cartDAO = new CartDAO;
            await expect(cartDAO.addToCart(testUser, testModel)).resolves.toBe(true);
            await expect(cartDAO.checkProductAvailability(testModel)).resolves.toBeGreaterThan(0);
        });

        test("Success - product already in the cart and cart exist", async () => {
            let cartDAO = new CartDAO;

            await expect(cartDAO.addToCart(testUser, testModel)).resolves.toBe(true);
            await expect(cartDAO.checkProductAvailability(testModel)).resolves.toBeGreaterThan(0);
        });

        test("Error - product strock=0", async () => {
            let cartDAO = new CartDAO;
            
            await expect(cartDAO.addToCart(testUser, testModel)).rejects.toBe(EmptyProductStockError);
            await expect(cartDAO.checkProductAvailability(testModel)).resolves.toBe(0);
        });

        test("Error - product doesn't exist", async () => {
            let cartDAO = new CartDAO;

            await expect(cartDAO.addToCart(testUser, "nonEsiste")).rejects.toBe(ProductNotFoundError);
            await expect(cartDAO.checkProductAvailability(testModel)).resolves.toBe(0);
        });

        afterAll(() => {
            cleanup()
        });

    });

});