import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"

import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import crypto from "crypto"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { UserAlreadyExistsError, UserNotFoundError } from "../../src/errors/userError"
import { Role, User } from "../../src/components/user"
//import '@types/jest'
jest.mock("crypto")
jest.mock("../../src/db/db.ts")


const userDAO = new UserDAO()



describe("UUD 1 - getIsUserAuthenticated", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("UUD 1.1 - 200 OK - User is correctly authenticated",async ()=>{
        const test = {
            username:"test",
            password:"11111111",
            salt:"222222222222"
        }

        jest.spyOn(crypto, 'scryptSync').mockImplementation((p, s, k) => {
            return Buffer.from('test');
        });
        jest.spyOn(crypto, 'timingSafeEqual').mockImplementation((p, h) => {
            return true;
        });

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null,test)
            return {} as Database

        });
        const result = await userDAO.getIsUserAuthenticated("test", "11111111")
        expect(result).toBe(true)
    })
})
describe("UUD 2 - createUser", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("UUD 2.1 - 200 OK - User created correctly", async () => {
        
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
            return (Buffer.from("salt"))
        })
        const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
            return Buffer.from("hashedPassword")
        })
        const result = await userDAO.createUser("username", "name", "surname", "password", "role")
        expect(result).toBe(true)
        mockRandomBytes.mockRestore()
        mockDBRun.mockRestore()
        mockScrypt.mockRestore()
    })

    test("UUD 2.2 - 409 KO - Username alrady in database", async () => {
        const userDAO = new UserDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("UNIQUE constraint failed: users.username"))
            return {} as Database
        });

        await expect(userDAO.createUser("username", "name", "surname", "password", "role")).rejects.toThrowError(UserAlreadyExistsError)
        
    })

    test("UUD 2.3 - Generic DB Error", async () => {
        const userDAO = new UserDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error())
            return {} as Database
        });

        await expect(userDAO.createUser("username", "name", "surname", "password", "role")).rejects.toThrowError(Error)
        
    })



})

describe("UUD 3 - getUsers", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("UUD 3.1 - 200 OK - Users succesfully returned", async () => {
        const users =[new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"Torino","1980-01-01"),new User ("customer2","NameCustomer2","SurnameCustomer2",Role.CUSTOMER,"Torino","1980-01-01")]
        
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, users);
            return {} as Database;
        });

        const result = await userDAO.getUsers()
        expect(result).toStrictEqual(users)
    });

    test("UUD 3.2 - Generic DB Error", async () => {
        const users =[new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"Torino","1980-01-01"),new User ("customer2","NameCustomer2","SurnameCustomer2",Role.CUSTOMER,"Torino","1980-01-01")]
        
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(userDAO.getUsers()).rejects.toThrowError(Error)
       
    });


})

describe("UUD 4 - getUsersByRole", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })
    test("UUD 4.1 - 200 OK - Users succesfully returned by Role", async () => {
        const users =[new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"Torino","1980-01-01"),new User ("customer2","NameCustomer2","SurnameCustomer2",Role.CUSTOMER,"Torino","1980-01-01")]
        const role = "Customer"
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, users);
            return {} as Database;
        });

        const result = await userDAO.getUsersByRole(role)
        expect(result).toStrictEqual(users)
    });

    test("UUD 4.2 - Generic DB Error", async () => {
        const users =[new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"Torino","1980-01-01"),new User ("customer2","NameCustomer2","SurnameCustomer2",Role.CUSTOMER,"Torino","1980-01-01")]
        const role = "Customer"
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new Error);
            return {} as Database;
        });

        await expect(userDAO.getUsersByRole(role)).rejects.toThrowError(Error)
    });
})

describe("UUD 5 - getUsersByUsername", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("UUD 5.1 - 200 OK - Users succesfully returned by Username", async () => {
        const user =new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"Torino","1980-01-01")
        const username = "customer"
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, user);
            return {} as Database;
        });

        const result = await userDAO.getUserByUsername(username)
        expect(result).toStrictEqual(user)
    });

    test("UUD 5.2 - 404 KO - User not found", async () => {
        const user =new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"Torino","1980-01-01")
        const username = ""
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 0 },null);
            return {} as Database;
        });

        await expect(userDAO.getUserByUsername(username)).rejects.toThrowError(new UserNotFoundError)
    });

    test("UUD 5.3 - Generic DB Error", async () => {
        const user =new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"Torino","1980-01-01")
        const username = "customer"
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(userDAO.getUserByUsername(username)).rejects.toThrowError(Error)
    });
})


describe("UUD 6 - deleteUser", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("UUD 6.1 - 200 OK - Users succesfully deleted", async () => {
        const username = "customer"
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 1 }, null);
            return {} as Database;
        });

        const result = await userDAO.deleteUser(username)
        expect(result).toBe(true)
    });

    test("UUD 6.2 - 404 KO - User not found ", async () => {
        const username = "customer"
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 0 }, null);
            return {} as Database;
        });

        await expect(userDAO.deleteUser(username)).rejects.toThrowError(new UserNotFoundError)
    });

    test("UUD 6.3 - Generic DB Error", async () => {
        const username = "customer"
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(userDAO.deleteUser(username)).rejects.toThrowError(Error)
    });
})

describe("UUD 7 - deleteAll", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("UUD 7.1 - 200 OK - Users succesfully deleted", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 1 }, null);
            return {} as Database;
        });

        const result = await userDAO.deleteAll()
        expect(result).toBe(true)
    });

    test("UUD 7.2 - Generic DB Error", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(userDAO.deleteAll()).rejects.toThrowError(Error)
    });
})

describe("UUD 8 - updateUserInfo", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("UUD 8.1 - 200 OK - Users succesfully updated", async () => {
        let user = new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"Torino, Via Madama Cristina 17","1980-01-01")
        let newUser = new User ("customer","NameCustomer2","SurnameCustome2r",Role.CUSTOMER,"Torino, Via Madama Cristina 17","1980-01-01")
        jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(newUser);
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 1 }, null);
            return {} as Database;
        });

        const result = await userDAO.updateUserInfo(user.username,newUser.name,newUser.surname,newUser.address,newUser.birthdate)
        expect(result).toStrictEqual(newUser)
    });

    test("UUD 8.2 - 404 KO - User not found", async () => {
        let user = new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"Torino, Via Madama Cristina 17","1980-01-01")
        let newUser = new User ("customer","NameCustomer2","SurnameCustome2r",Role.CUSTOMER,"Torino, Via Madama Cristina 17","1980-01-01")
       
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call({ changes: 0 }, null);
            return {} as Database;
        });

        await expect(userDAO.updateUserInfo(user.username,newUser.name,newUser.surname,newUser.address,newUser.birthdate)).rejects.toThrowError(new UserNotFoundError)
    });

    test("UUD 8.3 - Generic DB Error", async () => {
        let user = new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"Torino, Via Madama Cristina 17","1980-01-01")
        let newUser = new User ("customer","NameCustomer2","SurnameCustome2r",Role.CUSTOMER,"Torino, Via Madama Cristina 17","1980-01-01")
       
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback.call(new Error());
            return {} as Database;
        });

        await expect(userDAO.updateUserInfo(user.username,newUser.name,newUser.surname,newUser.address,newUser.birthdate)).rejects.toThrowError(new Error)
    });

})
