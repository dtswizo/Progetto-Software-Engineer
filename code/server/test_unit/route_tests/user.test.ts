import { test, expect, jest } from "@jest/globals"
import request from 'supertest'
//import { app } from "../../index"

import UserController from "../../src/controllers/userController"
import { UnauthorizedUserError, UserAlreadyExistsError, UserIsAdminError, UserNotAdminError, UserNotFoundError } from "../../src/errors/userError"
import { Role, User } from "../../src/components/user"
import { enableMockedAuth, initMockedApp, spyAdmin, spyCustomer, spyManager, spyNotLogged } from "../../src/testUtilities"
import Authenticator from "../../src/routers/auth"
import express from "express"
import { DateError } from "../../src/utilities"

jest.mock('../../src/controllers/userController');

jest.mock('../../src/routers/auth')
const baseURL = "/ezelectronics"
let app: express.Application;

//Example of a unit test for the POST ezelectronics/users route
//The test checks if the route returns a 200 success code
//The test also expects the createUser method of the controller to be called once with the correct parameters
describe("POST /ezelectronics/users", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        app = initMockedApp();
    });

it("200 OK - User successfully created", async () => {
    spyNotLogged();
        enableMockedAuth(app)
    const testUser = { //Define a test user object sent to the route
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
    const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
    expect(response.status).toBe(200) //Check if the response status is 200
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
    //Check if the createUser method has been called with the correct parameters
    expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role)
})

test("422 - Username is Empty", async () => {
    spyNotLogged();
        enableMockedAuth(app)
    const testUser = { //Define a test user object sent to the route
        username: "",
        name: "test",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
    const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
    expect(response.status).toBe(422) //Check if the response status is 200
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(0) //Check if the createUser method has been called once
    //Check if the createUser method has been called with the correct parameters
   
})

test("422 - Name is Empty", async () => {
    spyNotLogged();
        enableMockedAuth(app)
    const testUser = { //Define a test user object sent to the route
        username: "test",
        name: "",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
    const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
    expect(response.status).toBe(422) //Check if the response status is 200
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(0) //Check if the createUser method has been called once
    //Check if the createUser method has been called with the correct parameters
   
})

test("422 - Surname is Empty", async () => {
    spyNotLogged();
        enableMockedAuth(app)
    const testUser = { //Define a test user object sent to the route
        username: "test",
        name: "test",
        surname: "",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
    const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
    expect(response.status).toBe(422) //Check if the response status is 200
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(0) //Check if the createUser method has been called once
    //Check if the createUser method has been called with the correct parameters
   
})

test("422 - Password is Empty", async () => {
    spyNotLogged();
        enableMockedAuth(app)
    const testUser = { //Define a test user object sent to the route
        username: "test",
        name: "test",
        surname: "test",
        password: "",
        role: "Manager"
    }
    jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
    const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
    expect(response.status).toBe(422) //Check if the response status is 200
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(0) //Check if the createUser method has been called once
    //Check if the createUser method has been called with the correct parameters
   
})

test("422 - Role is not valid", async () => {
    spyNotLogged();
        enableMockedAuth(app)
    const testUser = { //Define a test user object sent to the route
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "test"
    }
    jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
    const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
    expect(response.status).toBe(422) //Check if the response status is 200
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(0) //Check if the createUser method has been called once
    //Check if the createUser method has been called with the correct parameters
   
})


test("409 KO - Username already exists", async () => {
    spyNotLogged();
    const testUser = { //Define a test user object sent to the route
        username: "test1",
        name: "test",
        surname: "test",
        password: "test",
        role: "Customer"
    }

    enableMockedAuth(app);
    jest.spyOn(UserController.prototype, "createUser").mockImplementation(() => {
        return Promise.reject(new UserAlreadyExistsError());
    });
    const response = await request(app).post(baseURL + "/users").send(testUser)
     
    //expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
    
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) 
    expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role)
    expect(response.status).toBe(409)
})

/*test("409 - Username already in database", async () => {
    spyNotLogged();
        enableMockedAuth(app)
    const testUser = { //Define a test user object sent to the route
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "Customer"
    }
    jest.spyOn(UserController.prototype, "createUser").mockImplementation(() => {
        return Promise.reject(new UserAlreadyExistsError());
    });
    //jest.spyOn(UserController.prototype, "createUser").mockRejectedValue(new UserAlreadyExistsError)
     const response = await request(app).post(`${baseURL}/users`).send(testUser)
    expect(response.status).toBe(409)
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) 
    expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role)
   
})*/


})

describe("GET /ezelectronics/users", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        app = initMockedApp();
    });

    test("200 OK - Users succesfully returned", async () => {
        const users = [new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"",""),
        new User ("customer2","NameCustomer2","SurnameCustomer2",Role.CUSTOMER,"","")
        ]
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce(users) //Mock the createUser method of the controller
        const response = await request(app).get(baseURL + "/users") //Send a POST request to the route
        
        expect(response.status).toBe(200) //Check if the response status is 200
        expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.getUsers).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
        //Check if the createUser method has been called with the correct parameters
        expect(UserController.prototype.getUsers).toHaveBeenCalledWith()
    })

    test("401 KO - User is not an Admin", async () => {
        const users = [new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"",""),
        new User ("customer2","NameCustomer2","SurnameCustomer2",Role.CUSTOMER,"","")
        ]
        spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce(users) //Mock the createUser method of the controller
        const response = await request(app).get(baseURL + "/users") //Send a POST request to the route
        
        expect(response.status).toBe(401) //Check if the response status is 200
        expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.getUsers).toHaveBeenCalledTimes(0) //Check if the createUser method has been called once
        //Check if the createUser method has been called with the correct parameters
    })
   /* 
    test("Generic Error", async () => {
        const users = [new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"",""),
        new User ("customer2","NameCustomer2","SurnameCustomer2",Role.CUSTOMER,"","")
        ]
        spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "getUsers").mockImplementation(() => {
            return Promise.reject(new (Error));
        });
        const response = await request(app).get(baseURL + "/users") //Send a POST request to the route
        
        expect(response.status).toBe(401) //Check if the response status is 200
        expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.getUsers).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
        //Check if the createUser method has been called with the correct parameters
    })*/

})

describe("GET /ezelectronics/users/roles/:role", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    test("200 OK - Users succesfully returned by role", async () => {
        const users = [new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"",""),
        new User ("customer2","NameCustomer2","SurnameCustomer2",Role.CUSTOMER,"","")
        ]
        spyAdmin();
        enableMockedAuth(app);
        let role = "Customer"

        jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce(users) //Mock the createUser method of the controller
        const response = await request(app).get(`${baseURL}/users/roles/${role}`) //Send a POST request to the route
        
        expect(response.status).toBe(200) //Check if the response status is 200
        expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
        //Check if the createUser method has been called with the correct parameters
        expect(UserController.prototype.getUsersByRole).toHaveBeenCalledWith(role)
    })

    test("401 KO - User is not an Admin", async () => {
        const users = [new User ("customer","NameCustomer","SurnameCustomer",Role.CUSTOMER,"",""),
        new User ("customer2","NameCustomer2","SurnameCustomer2",Role.CUSTOMER,"","")
        ]
        spyCustomer();
        enableMockedAuth(app);
        let role = "Customer"
        jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce(users) //Mock the createUser method of the controller
        const response = await request(app).get(`${baseURL}/users/roles/${role}`) //Send a POST request to the route
        
        expect(response.status).toBe(401) //Check if the response status is 200
        expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(0) //Check if the createUser method has been called once
        //Check if the createUser method has been called with the correct parameters
    })

})

describe("GET /ezelectronics/users/:username", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    
    test("200 OK - User succesfully returned by username (Customer)", async () => {
        const user = new User ("MarioRossi","Mario","Rossi",Role.CUSTOMER,"","")
        
        spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(user) 
        const response = await request(app).get(`${baseURL}/users/${user.username}`) 
        
        expect(response.status).toBe(200)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledWith(user, user.username)
    })

    test("200 OK - User succesfully returned by username (Admin)", async () => {
        const user = new User ("MarioRossi","Mario","Rossi",Role.CUSTOMER,"","")
        const admin = spyAdmin()
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(user) 
        const response = await request(app).get(`${baseURL}/users/${user.username}`) 
        
        expect(response.status).toBe(200)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledWith(admin, user.username)
    })

    test("401 KO - User is not an Admin", async () => {
        const admin = spyAdmin();
        const user = new User ("MarioRossi","Mario","Rossi",Role.CUSTOMER,"","")
        enableMockedAuth(app);
        jest.spyOn(UserController.prototype, "getUserByUsername").mockImplementation(() => {
            return Promise.reject(new UnauthorizedUserError());
        }); 
        const response = await request(app).get(`${baseURL}/users/${user.username}`) 
        expect(response.status).toBe(401) 
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledWith(admin, user.username)
    
    })
    
    test("404 KO - User does not exist in database", async () => {
        const admin = spyAdmin();
        const user = new User ("testtt","test","test",Role.CUSTOMER,"","")
        enableMockedAuth(app);
        jest.spyOn(UserController.prototype, "getUserByUsername").mockImplementation(() => {
            return Promise.reject(new UserNotFoundError());
        });
        const response = await request(app).get(`${baseURL}/users/${user.username}`) 
        expect(response.status).toBe(404) 
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledWith(admin, user.username)
   
    })

    
    /*

    test("422 KO - Username is empty", async () => {
        spyCustomer();
        //const user = new User ("","test","tests",Role.CUSTOMER,"","")
        const username = '';
        enableMockedAuth(app);
        jest.spyOn(UserController.prototype, "getUserByUsername").mockRejectedValue(new UserNotFoundError() )
        const response = await request(app).get(`${baseURL}/users/${username}`) 
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(0) 
        expect(response.status).toBe(422) 
        
        
    })*/

})

describe("DELETE /ezelectronics/users/:username", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    
    test("200 OK - User succesfully deleted (Customer)", async () => {
        const user = spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true) 
        const response = await request(app).delete(`${baseURL}/users/${user.username}`) 
        
        expect(response.status).toBe(200)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(user, user.username)
    })

    test("200 OK - User succesfully deleted (Admin)", async () => {
        const user = new User ("MarioRossi","Mario","Rossi",Role.CUSTOMER,"","")
        const admin = spyAdmin()
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true) 
        const response = await request(app).delete(`${baseURL}/users/${user.username}`) 
        
        expect(response.status).toBe(200)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(admin, user.username)
    })

    test("401 KO - User is not an Admin and username doesn't belong to User", async () => {
        const user = new User ("MarioRossi","Mario","Rossi",Role.CUSTOMER,"","")
        const customer = spyAdmin()
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "deleteUser").mockImplementation(() => {
            return Promise.reject(new UserNotAdminError());
        }); 
        const response = await request(app).delete(`${baseURL}/users/${user.username}`) 
        
        expect(response.status).toBe(401)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(customer , user.username)
    })

    test("401 KO - Admin User is trying to delete another Admin", async () => {
        const admin2 = new User ("test","test","test",Role.ADMIN,"","")
        const admin = spyAdmin()
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "deleteUser").mockImplementation(() => {
            return Promise.reject(new UserIsAdminError());
        });
        const response = await request(app).delete(`${baseURL}/users/${admin2.username}`) 
        
        expect(response.status).toBe(401)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(admin , admin2.username)
    })

    test("404 KO - User does not exist", async () => {
        const admin2 = new User ("test","test","test",Role.ADMIN,"","")
        const admin = spyAdmin()
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "deleteUser").mockImplementation(() => {
            return Promise.reject(new UserNotFoundError());
        });
        const response = await request(app).delete(`${baseURL}/users/${admin2.username}`) 
        
        expect(response.status).toBe(404)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(admin , admin2.username)
    })

    /*

    TOCHECK: è DA FARE?

    test("422 KO - Username is empty", async () => {
        const admin2 = new User ("","Mario","Rossi",Role.CUSTOMER,"","")
        const admin = spyAdmin()
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "deleteUser").mockRejectedValue(false)
        const response = await request(app).delete(`${baseURL}/users/${admin2.username}`) 
        
        expect(response.status).toBe(422)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(0) 
        //expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(admin , admin2.username)
    })
    */
})

describe("DELETE /ezelectronics/users", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    });

    
    test("200 OK - Users succesfully deleted", async () => {
        spyAdmin();
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "deleteAll").mockResolvedValueOnce(true) 
        const response = await request(app).delete(`${baseURL}/users`) 
        
        expect(response.status).toBe(200)
        
        expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.deleteAll).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.deleteAll).toHaveBeenCalledWith()
    })

    test("401 KO - User is not Admin", async () => {
        spyCustomer();
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "deleteAll").mockResolvedValueOnce(true) 
        const response = await request(app).delete(`${baseURL}/users`) 
        
        expect(response.status).toBe(401)
        
        expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.deleteAll).toHaveBeenCalledTimes(0) 
    })
})

describe("PATCH /ezelectronics/users/:username", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    })

    test("200 OK - User succesfully updated", async () => {
        const user = spyCustomer();
       // const newUser = new User("MarioRossi","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
        const newUser = { //Define a test user object sent to the route
            username: "MarioRossi",
            name: "newName",
            surname: "newSurname",
            role: "Customer",
            address: "Torino, Via Madama Cristina 27",
            birthdate:"1980-01-01"
        }
        const updatedUser = new User("MarioRossi","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
       
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(updatedUser) 
        const response = await request(app).patch(`${baseURL}/users/${newUser.username}`).send(newUser)
        
        expect(response.status).toBe(200)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledWith(user,newUser.name,newUser.surname,newUser.address,newUser.birthdate, newUser.username)
    })

    test("404 KO - User not found", async () => {
        const user = spyCustomer();
       // const newUser = new User("MarioRossi","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
        const newUser = { //Define a test user object sent to the route
            username: "MarioRossi",
            name: "newName",
            surname: "newSurname",
            role: "Customer",
            address: "Torino, Via Madama Cristina 27",
            birthdate:"1980-01-01"
        }
        const updatedUser = new User("MarioRossi","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
       
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "updateUserInfo").mockImplementation(() => {
            return Promise.reject(new UserNotFoundError());
        });
        const response = await request(app).patch(`${baseURL}/users/${newUser.username}`).send(newUser)
        
        expect(response.status).toBe(404)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledWith(user,newUser.name,newUser.surname,newUser.address,newUser.birthdate, newUser.username)
    })

    test("401 KO - Username doesn't match logged user and is not Admin", async () => {
        const user = spyCustomer();
       // const newUser = new User("MarioRossi","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
        const newUser = { //Define a test user object sent to the route
            username: "test",
            name: "newName",
            surname: "newSurname",
            role: "Customer",
            address: "Torino, Via Madama Cristina 27",
            birthdate:"1980-01-01"
        }
        const updatedUser = new User("test","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
       
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "updateUserInfo").mockImplementation(() => {
            return Promise.reject(new UserNotAdminError());
        });
        const response = await request(app).patch(`${baseURL}/users/${newUser.username}`).send(newUser)
        
        expect(response.status).toBe(401)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledWith(user,newUser.name,newUser.surname,newUser.address,newUser.birthdate, newUser.username)
    })

    test("400 KO - User birthdate is after current date", async () => {
        const user = spyCustomer();
       // const newUser = new User("MarioRossi","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
        const newUser = { //Define a test user object sent to the route
            username: "test",
            name: "newName",
            surname: "newSurname",
            role: "Customer",
            address: "Torino, Via Madama Cristina 27",
            birthdate:"2099-01-01"
        }
        const updatedUser = new User("test","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
       
        enableMockedAuth(app);

        jest.spyOn(UserController.prototype, "updateUserInfo").mockImplementation(() => {
            return Promise.reject(new DateError());
        });
        const response = await request(app).patch(`${baseURL}/users/${newUser.username}`).send(newUser)
        
        expect(response.status).toBe(400)
        
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1) 
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledWith(user,newUser.name,newUser.surname,newUser.address,newUser.birthdate, newUser.username)
    })

    test("422 KO - Name is empty", async () => {
        const user = spyCustomer();
       // const newUser = new User("MarioRossi","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
        const newUser = { //Define a test user object sent to the route
            username: "test",
            name: "",
            surname: "newSurname",
            role: "Customer",
            address: "Torino, Via Madama Cristina 27",
            birthdate:"2099-01-01"
        }
        const updatedUser = new User("test","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
        enableMockedAuth(app);

        const response = await request(app).patch(`${baseURL}/users/${newUser.username}`).send(newUser)
        
        expect(response.status).toBe(422)
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(0) 
         })

         test("422 KO - Surname is empty", async () => {
            const user = spyCustomer();
           // const newUser = new User("MarioRossi","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
            const newUser = { //Define a test user object sent to the route
                username: "test",
                name: "newName",
                surname: "",
                role: "Customer",
                address: "Torino, Via Madama Cristina 27",
                birthdate:"2099-01-01"
            }
            const updatedUser = new User("test","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
            enableMockedAuth(app);
    
            const response = await request(app).patch(`${baseURL}/users/${newUser.username}`).send(newUser)
            
            expect(response.status).toBe(422)
            expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
            expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(0) 
             })

             test("422 KO - Address is empty", async () => {
                const user = spyCustomer();
               // const newUser = new User("MarioRossi","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
                const newUser = { //Define a test user object sent to the route
                    username: "test",
                    name: "newName",
                    surname: "newSurname",
                    role: "Customer",
                    address: "",
                    birthdate:"2099-01-01"
                }
                const updatedUser = new User("test","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
                enableMockedAuth(app);
        
                const response = await request(app).patch(`${baseURL}/users/${newUser.username}`).send(newUser)
                
                expect(response.status).toBe(422)
                expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
                expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(0) 
                 })

                 test("422 KO - Birthdate is empty", async () => {
                    const user = spyCustomer();
                   // const newUser = new User("MarioRossi","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
                    const newUser = { //Define a test user object sent to the route
                        username: "test",
                        name: "newName",
                        surname: "newSurname",
                        role: "Customer",
                        address: "Torino, Via Madama Cristina 27",
                        birthdate:""
                    }
                    const updatedUser = new User("test","newName","newSurname",Role.CUSTOMER,"Torino, Via Madama Cristina 27","1980-01-01")
                    enableMockedAuth(app);
            
                    const response = await request(app).patch(`${baseURL}/users/${newUser.username}`).send(newUser)
                    
                    expect(response.status).toBe(422)
                    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1);
                    expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(0) 
                     })

})
describe("POST ezelectronics/sessions", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    })

    test("200 OK - User successfully logged in", async () => {
        spyNotLogged();
            enableMockedAuth(app)
        const testUser = { //Define a test user object sent to the route
            username: "MarioRossi",
            password: "test",
        }
        jest.spyOn(Authenticator.prototype, "login").mockResolvedValueOnce(true) 
        const response = await request(app).post(baseURL + "/sessions").send(testUser) 
        expect(response.status).toBe(200) 
        expect(Authenticator.prototype.login).toHaveBeenCalledTimes(1)
        //expect(Authenticator.prototype.login).toHaveBeenCalledWith(testUser,response)
    })

    test("401 KO - Username and/or password are incorrect", async () => {
        spyNotLogged();
            enableMockedAuth(app)
        const testUser = { //Define a test user object sent to the route
            username: "MarioRossi",
            password: "test",
        }
        jest.spyOn(Authenticator.prototype, "login").mockRejectedValueOnce(new Error) 
        const response = await request(app).post(baseURL + "/sessions").send(testUser) 
        expect(response.status).toBe(401) 
        expect(Authenticator.prototype.login).toHaveBeenCalledTimes(1)
        //expect(Authenticator.prototype.login).toHaveBeenCalledWith(testUser,response,)
    })
})

describe("DELETE ezelectronics/sessions/current", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    })

    test("200 OK - User successfully logged out", async () => {
        spyCustomer();
        enableMockedAuth(app)
        jest.spyOn(Authenticator.prototype, "logout").mockResolvedValueOnce(true) 
        const response = await request(app).delete(baseURL + "/sessions/current") 
        expect(response.status).toBe(200) 
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
        expect(Authenticator.prototype.logout).toHaveBeenCalledTimes(1)
        //expect(Authenticator.prototype.login).toHaveBeenCalledWith(testUser,response,)
    })
    /*
    test("Generic Error", async () => {
        spyCustomer();
        enableMockedAuth(app)
        jest.spyOn(Authenticator.prototype, "logout").mockResolvedValueOnce(new Error) 
        expect (await request(app).delete(baseURL + "/sessions/current")).rejects.toThrowError(new Error) 
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
        expect(Authenticator.prototype.logout).toHaveBeenCalledTimes(1)
        //expect(Authenticator.prototype.login).toHaveBeenCalledWith(testUser,response,)
    })*/
})

describe("GET ezelectronics/sessions/current", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        app = initMockedApp();
    })

    test("200 OK - User successfully retrieved", async () => {
        spyCustomer();
        enableMockedAuth(app)
        const testUser = { //Define a test user object sent to the route
            username: "MarioRossi",
            password: "test",
        }
        const response = await request(app).get(baseURL + "/sessions/current") 
        expect(response.status).toBe(200) 
        expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
        //expect(Authenticator.prototype.login).toHaveBeenCalledWith(testUser,response,)
    })
})
