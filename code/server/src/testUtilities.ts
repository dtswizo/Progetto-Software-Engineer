const cors = require('cors');
import { User, Role } from "./components/user";
import Authenticator from "./routers/auth";
import initRoutes from "./routes"
import dotenv from 'dotenv';
import express from 'express';

const spyCustomer = () => {
    const testLoggedUser = new User(
        "MarioRossi",
        "Mario",
        "Rossi",
        Role.CUSTOMER,
        "",
        ""
    );
    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return next();
    });
    jest.spyOn(Authenticator.prototype, "isManager").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return res.status(401).json({ error: "User is not a manager", status: 401 });
    });
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return res.status(401).json({ error: "User is not an admin", status: 401 });
    });
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return next();
    });
    jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return res.status(401).json({ error: "User is not an admin or manager", status: 401 });
    });
    return testLoggedUser;
}
const spyManager = () => {
    const testLoggedUser = new User(
        "MarioRossi",
        "Mario",
        "Rossi",
        Role.MANAGER,
        "",
        ""
    );

    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return res.status(401).json({ error: "User is not a customer", status: 401 });
    });
    jest.spyOn(Authenticator.prototype, "isManager").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return next();
    });
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return res.status(401).json({ error: "User is not an admin", status: 401 });
    });
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return next();
    });
    jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return next();
    });
    return testLoggedUser;
}
const spyAdmin = () => {
    const testLoggedUser = new User(
        "MarioRossi",
        "Mario",
        "Rossi",
        Role.ADMIN,
        "",
        ""
    );

    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return res.status(401).json({ error: "User is not a customer", status: 401 });
    });
    jest.spyOn(Authenticator.prototype, "isManager").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return res.status(401).json({ error: "User is not a manager", status: 401 });
    });
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return next();
    });
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return next();
    });
    jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        req.user = testLoggedUser;
        return next();
    });
    return testLoggedUser;
}

const spyNotLogged = () => {
    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => false;
        return res.status(401).json({ error: "User is not a customer", status: 401 });
    });
    jest.spyOn(Authenticator.prototype, "isManager").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => false;
        return res.status(401).json({ error: "User is not a manager", status: 401 });
    });
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => false;
        return res.status(401).json({ error: "User is not an admin", status: 401 });
    });
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => false;
        return res.status(401).json({ error: "Unauthenticated user", status: 401 });
    });
    jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => {
        req.isAuthenticated = () => false;
        return res.status(401).json({ error: "User is not an admin or manager", status: 401 });
    });
}

const enableMockedAuth = (app: express.Application) => {
    initRoutes(app)
}
const initMockedApp = () => {
    dotenv.config();
    const app: express.Application = express();
    const corsOptions = {
        origin: 'http://localhost:3000',
        credentials: true,
    };
    app.use(cors(corsOptions));
    return app;
}

export {spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp};