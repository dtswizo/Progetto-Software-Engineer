import { expect, jest } from '@jest/globals';
import request from 'supertest'
import express from 'express';
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from '../src/testUtilities'
import crypto from "crypto"
import UserController from '../src/controllers/userController';
import UserDAO from '../src/dao/userDAO';
import { User, Role } from '../src/components/user';
import { cleanup, cleanupDB } from '../src/db/cleanup';
import db from "../src/db/db"
import { UserAlreadyExistsError, UserNotFoundError } from '../src/errors/userError';

let userDAO: UserDAO;
let userController: UserController;

const userToAdd = { //Define a test user object sent to the route
    username: "MarioRossi",
    name: "Mario",
    surname: "Rossi",
    password: "test",
    role: "Customer"
}

const user = {
    username: "MarioRossi",
    name: "Mario",
    surname: "Rossi",
    role: "Customer",
    address: "",
    birthdate:""
}

const newUser = { //Define a test user object sent to the route
    username: "MarioRossi",
    name: "newName",
    surname: "newSurname",
    role: "Customer",
    address: "Torino, Via Madama Cristina 27",
    birthdate:"1980-01-01"
}

const createUser = async()=>{
    
    return new Promise<boolean>((resolve, reject) => {
        try {
            const salt = crypto.randomBytes(16)
            const hashedPassword = crypto.scryptSync(userToAdd.password, salt, 16)
            const sql = "INSERT INTO users(username, name, surname, role, password, salt) VALUES(?, ?, ?, ?, ?, ?)"
            db.run(sql, [userToAdd.username, userToAdd.name, userToAdd.surname, userToAdd.role, hashedPassword, salt], (err: Error | null) => {
                if (err) {
                    if (err.message.includes("UNIQUE constraint failed: users.username")) reject(new UserAlreadyExistsError)
                    reject(err)
                }
                resolve(true)
            })
        }
        catch(error){
            reject(error)
        }
    })
}

const deleteUser = async()=>{
    return new Promise<boolean>((resolve, reject) => {
        try {
            const sql = "DELETE FROM users WHERE username = ?";
            db.run(sql, [user.username], function (err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }

                if (this.changes === 0) {
                    reject(new UserNotFoundError());
                    return;
                }

                resolve(true);
            });
        } catch (error) {
            reject(error);
        }
    });
}

const deleteAll = async()=>{
    return new Promise<boolean>((resolve, reject) => {
        try {
            const sql = "DELETE FROM users WHERE role != 'Admin'";
            db.run(sql, [], (err: Error | null) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        } catch (error) {
            reject(error);
        }
    });

}

const updateUserInfo = async()=>{
    
    return new Promise<User>((resolve, reject) => {
        try {
            const sql = `UPDATE users SET name = ?, surname = ?, address = ?, birthdate = ? WHERE username = ?`;
            db.run(sql, [newUser.name, newUser.surname, newUser.address, newUser.birthdate, newUser.username], function (err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }

                //Questo controllo dovrebbe essere superfluo
                if (this.changes === 0) {
                    reject(new UserNotFoundError());
                    return;
                }

                this.getUserByUsername(newUser.username).then((updatedUser: User) => {
                    resolve(updatedUser);
                }).catch((error: Error) => {
                    reject(error);
                });

            }.bind(this));
        } catch (error) {
            reject(error);
        }
    });
}

const setupDB = async () => {
    const sqlUser = "INSERT INTO users(username, name, surname, role) VALUES(?, ?, ?, ?)"
    

    await new Promise<void>((resolve, reject) => {
        try {
            db.run(sqlUser, [userToAdd.username, userToAdd.name, userToAdd.surname, userToAdd.role], (err) => {
                if (err) {
                    return reject(err);
                }
                
            });
        } catch (error) {
            reject(error);
        }

    });
}

describe('Integration DAO - DB', () => {

    beforeAll(async () => {
        cleanup();
        await setupDB();
    });

    describe('createUser',() =>{

        beforeEach(async () => {
            userDAO = new UserDAO;
        });

        it("200 OK - User successfully created", async () => {

            await expect(userDAO.createUser(userToAdd.username,userToAdd.name,userToAdd.surname,userToAdd.password,userToAdd.role)).resolves.toBe(true);
        });

        it("409 KO - User already exists", async () => {

            await expect(userDAO.createUser(userToAdd.username,userToAdd.name,userToAdd.surname,userToAdd.password,userToAdd.role)).rejects.toThrowError(UserAlreadyExistsError)
        });

    })

    describe('getUsers',() =>{

        beforeEach(async () => {
            userDAO = new UserDAO;
        })

        it("200 OK - Users successfully retrieved", async () => {

            const result = await userDAO.getUsers();
            expect(result[0].username).toBe(user.username);
            expect(result[0].name).toBe(user.name)
            expect(result[0].surname).toBe(user.surname)
            expect(result[0].address).toBe(user.address)
            expect(result[0].birthdate).toBe(user.birthdate)
            expect(result[0].role).toBe(user.role)
        });
    })

    describe('getUsersByRole',() =>{

        beforeEach(async () => {
            userDAO = new UserDAO;
        })
        it("200 OK - Users successfully retrieved by role", async () => {

            const result = await userDAO.getUsersByRole(user.role);
            expect(result[0].username).toBe(user.username);
            expect(result[0].name).toBe(user.name)
            expect(result[0].surname).toBe(user.surname)
            expect(result[0].address).toBe(user.address)
            expect(result[0].birthdate).toBe(user.birthdate)
            expect(result[0].role).toBe(user.role)
        });

    })

    describe('getUsersByUsername',() =>{

        beforeEach(async () => {
            userDAO = new UserDAO;
        })
        it("200 OK - User successfully retrieved by username", async () => {

            const result = await userDAO.getUserByUsername(user.username);
            expect(result[0].username).toBe(user.username);
            expect(result[0].name).toBe(user.name)
            expect(result[0].surname).toBe(user.surname)
            expect(result[0].address).toBe(user.address)
            expect(result[0].birthdate).toBe(user.birthdate)
            expect(result[0].role).toBe(user.role)
        });

    })

    describe('deleteUser',() =>{

        beforeEach(async () => {
            userDAO = new UserDAO;
        })
        it("200 OK - User successfully deleted", async () => {

            await expect(userDAO.deleteUser(user.username)).resolves.toBe(true)
        });
        /*
        it("404 KO - User not found ", async () => {

            await expect(userDAO.deleteUser(user.username)).rejects.toThrowError(new UserNotFound())
        });*/



    })

    describe('deleteAll',() =>{

        beforeEach(async () => {
            userDAO = new UserDAO;
        })
        it("200 OK - Users successfully deleted", async () => {

            await expect(userDAO.deleteAll()).resolves.toBe(true)
        });

    })

    describe('updateUserInfo',() =>{

        beforeEach(async () => {
            userDAO = new UserDAO;
        })
        it("200 OK - User successfully updated", async () => {

            const result = await userDAO.updateUserInfo(user.username,newUser.name,newUser.surname,newUser.address,newUser.birthdate)
            expect(result[0].username).toBe(newUser.username)
            expect(result[0].name).toBe(newUser.name)
            expect(result[0].surname).toBe(newUser.surname)
            expect(result[0].address).toBe(newUser.address)
            expect(result[0].birthdate).toBe(newUser.birthdate)
        });
        /*
        it("404 KO - User not found ", async () => {

            await expect(userDAO.deleteUser(user.username)).rejects.toThrowError(new UserNotFound())
        });*/



    })

})
