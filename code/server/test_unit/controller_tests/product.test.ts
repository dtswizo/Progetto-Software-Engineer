import { test, expect, jest } from "@jest/globals"
import ProductController from "../../src/controllers/productController"
import ProductDAO from "../../src/dao/productDAO"

jest.mock("../../src/dao/userDAO")

//Example of a unit test for the registerProducts method of the productController
//The test checks if the method returns void when the DAO method returns void
//The test also expects the DAO method to be called once with the correct parameters

test("Test correct registerProducts controller", async () => {
    const testProducts = { //Define a test user object
        model: "test",
        category: "Laptop",
        quantity: 5,
        details: "test",
        sellingPrice: 3,
        arrivalDate: "2024/05/20"
    }
    jest.spyOn(ProductDAO.prototype, "registerProducts").mockResolvedValueOnce(); //Mock the createUser method of the DAO   //return void
    //const stub=jest.fn().mockReturnValue(undefined);
    const controller = new ProductController(); //Create a new instance of the controller
    //Call the registerProducts method of the controller with the test user object
    const response = await controller.registerProducts(testProducts.model,testProducts.category,testProducts.quantity,
        testProducts.details,testProducts.sellingPrice,testProducts.arrivalDate);

    //Check if the createUser method of the DAO has been called once with the correct parameters
    expect(ProductDAO.prototype.registerProducts).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.registerProducts).toHaveBeenCalledWith(testProducts.model,testProducts.category,testProducts.quantity,
        testProducts.details,testProducts.sellingPrice,testProducts.arrivalDate);
    expect(response).toBe(undefined);
});

test("Test correct changeProductQuantity controller", async () => {
    const testProducts = { //Define a test user object
        model: "test",
        newQuantity: 2,
        changeDate: "2024/05/20"
    }
    jest.spyOn(ProductDAO.prototype, "changeProductQuantity").mockResolvedValueOnce(2); //Mock the createUser method of the DAO
    jest.spyOn(ProductDAO.prototype, "getArrivalDate").mockResolvedValueOnce("2024/05/19");
    // nel caso voglio una condizione giusta se metto data sbagliata con error torna errore ma non lo vedo, se invece uso throw mi dice dove lancia eccezione

    const controller = new ProductController(); //Create a new instance of the controller
    //Call the registerProducts method of the controller with the test user object
    const response = await controller.changeProductQuantity(testProducts.model,testProducts.newQuantity,testProducts.changeDate);

    //Check if the createUser method of the DAO has been called once with the correct parameters
    expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledWith(testProducts.model,testProducts.newQuantity,testProducts.changeDate);
    expect(response).toBe(2);
    /*
    Prove per gestione errore ************* ----> DA CANCELLARE <----- *************************************** <----------------
    //await expect(controller.changeProductQuantity(testProducts.model,testProducts.newQuantity,testProducts.changeDate)).rejects.toMatch('error');
    try {
        await controller.changeProductQuantity(testProducts.model,testProducts.newQuantity,testProducts.changeDate);
        console.log("prova");
      } catch (error) {
        console.log(error);
        expect(error).toMatch('parameter quantity is not valid');
      }*/

});