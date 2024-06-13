import { test, expect, jest } from "@jest/globals"
import ProductController from "../../src/controllers/productController"
import ProductDAO from "../../src/dao/productDAO"
import { Product } from "../../src/components/product"
import { Category } from "../../src/components/product"
import { DateError } from "../../src/utilities"
import { ProductAlreadyExistsError, ProductNotFoundError, LowProductStockError, EmptyProductStockError, FilteringError } from "../../src/errors/productError"

jest.mock("../../src/dao/productDAO")

let productController = new ProductController();

describe("UPC1 - registerProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPC1.1 - 201 OK - registers product successfully", async () => {
        const testProduct = new Product(
            1200,
            "iphone",
            Category.SMARTPHONE,
            "",
            "mint",
            5
        );
        const arrivalDate = "2024-01-01";

        jest.spyOn(ProductDAO.prototype, "registerProducts").mockResolvedValue();

        const response = await productController.registerProducts(
            testProduct.model,
            testProduct.category,
            testProduct.quantity,
            testProduct.details,
            testProduct.sellingPrice,
            arrivalDate
        );

        expect(ProductDAO.prototype.registerProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.registerProducts).toHaveBeenCalledWith(
            testProduct.model,
            testProduct.category,
            testProduct.quantity,
            testProduct.details,
            testProduct.sellingPrice,
            arrivalDate
        );
        expect(response).toEqual(undefined);
    });

    it("UPC1.2 - 400 KO - arrivalDate is after the currentDate", async () => {
        const testProduct = new Product(
            1200,
            "iphone",
            Category.SMARTPHONE,
            "",
            "mint",
            5,  
        );
        const arrivalDate="2024-07-01";
    
        jest.spyOn(ProductDAO.prototype, "registerProducts").mockRejectedValue(new DateError());
        await expect(productController.registerProducts(testProduct.model,testProduct.category,testProduct.quantity,testProduct.details,testProduct.sellingPrice,arrivalDate)).rejects.toThrowError(DateError);
        expect(ProductDAO.prototype.registerProducts).toHaveBeenCalledTimes(0);
    });

    it("UPC1.3 - 409 KO - model represents an already existing set of products", async () => {
        const testProduct = new Product(
            1200,
            "Iphone 12", 
            Category.SMARTPHONE,
            "",
            "mint",
            5,  
        );
        const arrivalDate = "2024-01-01";
    
        jest.spyOn(ProductDAO.prototype, "registerProducts").mockRejectedValue(new ProductAlreadyExistsError());
    
        await expect(productController.registerProducts(testProduct.model, testProduct.category, testProduct.quantity, testProduct.details, testProduct.sellingPrice, arrivalDate)).rejects.toThrowError(ProductAlreadyExistsError);
    
        expect(ProductDAO.prototype.registerProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.registerProducts).toHaveBeenCalledWith(
            testProduct.model, testProduct.category, testProduct.quantity, testProduct.details, testProduct.sellingPrice, arrivalDate
        );
    });
});

describe("UPC2 - changeProductQuantity", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPC2.1 - 200 OK - model not empty", async () => {
        expect.assertions(3);
        const testProduct = new Product(
            1200,
            "iPhone 12",
            Category.SMARTPHONE,
            "",
            "mint",
            5,  
        );
        const changeDate="";
        const newQuantity=10;

        jest.spyOn(ProductDAO.prototype, "changeProductQuantity").mockResolvedValue(20);

        const response = await productController.changeProductQuantity(testProduct.model, newQuantity,changeDate);

        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledWith(testProduct.model, newQuantity,changeDate);
        expect(response).toBe(20);
    });

    it("UPC2.2 - 404 KO - model does not represent a product in the database", async () => {
        const testProduct = new Product(
            1200,
            "iPhone 12",
            Category.SMARTPHONE,
            "",
            "mint",
            5,  
        );
        const changeDate="";
        const newQuantity=10;
    
        jest.spyOn(ProductDAO.prototype, "changeProductQuantity").mockRejectedValue(new ProductNotFoundError());
    
        await expect(productController.changeProductQuantity(testProduct.model, newQuantity,changeDate)).rejects.toThrowError(ProductNotFoundError);
    
        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledWith(testProduct.model, newQuantity,changeDate);
    });

    it("UPC2.3 - 400 KO - changeDate is before/after the currentDate", async () => {
        const testProduct = new Product(
            1200,
            "iPhone 12",
            Category.SMARTPHONE,
            "",
            "mint",
            5,  
        );
        const changeDate="2024-07-01";
        const newQuantity=10;
    
        jest.spyOn(ProductDAO.prototype, "changeProductQuantity").mockRejectedValue(new DateError());
        await expect(productController.changeProductQuantity(testProduct.model, newQuantity,changeDate)).rejects.toThrowError(DateError);
        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(0);
    });

});

describe("UPC3 - sellProduct", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPC3.1 - 200 OK - sell product successfully", async () => {
        const model = "iPhone 13";
        const quantity = 2;
        const sellingDate = "2024-01-02";
    
        jest.spyOn(ProductDAO.prototype, "getArrivalDate").mockResolvedValue("2024-01-01");
        jest.spyOn(ProductDAO.prototype, "getProductQuantity").mockResolvedValue(10);
        jest.spyOn(ProductDAO.prototype, "changeProductQuantity").mockResolvedValue(8);
    
        const response = await productController.sellProduct(model, quantity, sellingDate);
    
        expect(ProductDAO.prototype.getArrivalDate).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getArrivalDate).toHaveBeenCalledWith(model);
        expect(ProductDAO.prototype.getProductQuantity).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProductQuantity).toHaveBeenCalledWith(model);
        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledWith(model, -quantity, sellingDate); // Qui il cambiamento
    });

    it("UPC3.2 - 404 KO - model does not represent a product in the database", async () => {
        const model = "Nonexistent Model";
        const quantity = 2;
        const sellingDate = "2024-01-02";

        jest.spyOn(ProductDAO.prototype, "getArrivalDate").mockRejectedValue(new ProductNotFoundError());

        await expect(productController.sellProduct(model, quantity, sellingDate)).rejects.toThrowError(ProductNotFoundError);

        expect(ProductDAO.prototype.getArrivalDate).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getArrivalDate).toHaveBeenCalledWith(model);
        expect(ProductDAO.prototype.getProductQuantity).toHaveBeenCalledTimes(0);
    });

    it("UPC3.3 - 400 KO - sellingDate is after the currentDate", async () => {
        const model = "iPhone 13";
        const quantity = 2;
        const sellingDate = "2028-06-04";

        jest.spyOn(ProductDAO.prototype, "getArrivalDate").mockResolvedValue("2023-01-01");
        await expect(productController.sellProduct(model, quantity, sellingDate)).rejects.toThrowError(DateError);

        expect(ProductDAO.prototype.getArrivalDate).toHaveBeenCalledTimes(0);
    });

    it("UPC3.4 - 400 KO - sellingDate is before the arrivalDate", async () => {
        const model = "iPhone 13";
        const quantity = 2;
        const sellingDate = "2023-12-31";

        jest.spyOn(ProductDAO.prototype, "getArrivalDate").mockResolvedValue("2024-01-01");

        await expect(productController.sellProduct(model, quantity, sellingDate)).rejects.toThrowError(DateError);

        expect(ProductDAO.prototype.getArrivalDate).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getArrivalDate).toHaveBeenCalledWith(model);
        expect(ProductDAO.prototype.getProductQuantity).toHaveBeenCalledTimes(0);
        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(0);

    });

    it("UPC3.5 - 409 KO - available quantity is zero", async () => {
        const model = "iPhone 13";
        const quantity = 2;
        const sellingDate = "2024-01-02";

        jest.spyOn(ProductDAO.prototype, "getArrivalDate").mockResolvedValue("2024-01-01");
        jest.spyOn(ProductDAO.prototype, "getProductQuantity").mockResolvedValue(0);

        await expect(productController.sellProduct(model, quantity, sellingDate)).rejects.toThrowError(EmptyProductStockError);

        expect(ProductDAO.prototype.getArrivalDate).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getArrivalDate).toHaveBeenCalledWith(model);
        expect(ProductDAO.prototype.getProductQuantity).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProductQuantity).toHaveBeenCalledWith(model);
        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(0);

    });

    it("UPC3.6 - 409 KO - available quantity is lower than requested quantity", async () => {
        const model = "iPhone 13";
        const quantity = 5;
        const sellingDate = "2024-01-02";

        jest.spyOn(ProductDAO.prototype, "getArrivalDate").mockResolvedValue("2024-01-01");
        jest.spyOn(ProductDAO.prototype, "getProductQuantity").mockResolvedValue(2);

        await expect(productController.sellProduct(model, quantity, sellingDate)).rejects.toThrowError(LowProductStockError);

        expect(ProductDAO.prototype.getArrivalDate).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getArrivalDate).toHaveBeenCalledWith(model);
        expect(ProductDAO.prototype.getProductQuantity).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProductQuantity).toHaveBeenCalledWith(model);
        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(0);

        
    });

});

describe("UPC4 - getProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPC4.1 - 200 OK - get all products", async () => {
        const products = [
            new Product(200, "iPhone 13", Category.SMARTPHONE, "", "2024-01-01", 8),
            new Product(1500, "MacBook Pro", Category.LAPTOP, "", "2024-01-01", 5)
        ];

        jest.spyOn(ProductDAO.prototype, "getAllProducts").mockResolvedValue(products);

        const response = await productController.getProducts(null, null, null);

        expect(ProductDAO.prototype.getAllProducts).toHaveBeenCalledTimes(1);
        expect(response).toEqual(products);
    });

    it("UPC4.2 - 200 OK - get products by category", async () => {
        const products = [
            new Product(200, "iPhone 13", Category.SMARTPHONE, "", "2024-01-01", 8),
            new Product(200, "iPhone 13", Category.SMARTPHONE, "", "2024-01-01", 8)
        ];

        jest.spyOn(ProductDAO.prototype, "getFilteredProducts").mockResolvedValue(products);

        const response = await productController.getProducts("category", Category.SMARTPHONE, null);

        expect(ProductDAO.prototype.getFilteredProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getFilteredProducts).toHaveBeenCalledWith("category", Category.SMARTPHONE);
        expect(response).toEqual(products);
    });

    it("UPC4.3 - 200 OK - get product by model", async () => {
        const product = new Product(200, "iPhone 13", Category.SMARTPHONE, "", "2024-01-01", 8);

        jest.spyOn(ProductDAO.prototype, "getFilteredProducts").mockResolvedValue([product]);

        const response = await productController.getProducts("model", null, "iPhone 13");

        expect(ProductDAO.prototype.getFilteredProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getFilteredProducts).toHaveBeenCalledWith("model", "iPhone 13");
        expect(response).toEqual([product]);
    });

    it("UPC4.4 - 422 Unprocessable Entity - invalid parameters combination (grouping is null, category is not null)", async () => {
        await expect(productController.getProducts(null, "Smartphone", null)).rejects.toThrowError(FilteringError);
        expect(ProductDAO.prototype.getAllProducts).toHaveBeenCalledTimes(0);
    });

    it("UPC4.5 - 422 Unprocessable Entity - invalid parameters combination (grouping is null, model is not null)", async () => {
        await expect(productController.getProducts(null, null, "iPhone 13")).rejects.toThrowError(FilteringError);
        expect(ProductDAO.prototype.getAllProducts).toHaveBeenCalledTimes(0);
    });

    it("UPC4.6 - 422 Unprocessable Entity - invalid parameters combination (grouping is category, category is null)", async () => {
        await expect(productController.getProducts("category", null, null)).rejects.toThrowError(FilteringError);
        expect(ProductDAO.prototype.getFilteredProducts).toHaveBeenCalledTimes(0);
    });

    it("UPC4.7 - 422 Unprocessable Entity - invalid parameters combination (grouping is category, model is not null)", async () => {
        await expect(productController.getProducts("category", "Smartphone", "iPhone 13")).rejects.toThrowError(FilteringError);
        expect(ProductDAO.prototype.getFilteredProducts).toHaveBeenCalledTimes(0);
    });

    it("UPC4.8 - 422 Unprocessable Entity - invalid parameters combination (grouping is model, model is null)", async () => {
        await expect(productController.getProducts("model", null, null)).rejects.toThrowError(FilteringError);
        expect(ProductDAO.prototype.getFilteredProducts).toHaveBeenCalledTimes(0);
    });

    it("UPC4.9 - 422 Unprocessable Entity - invalid parameters combination (grouping is model, category is not null)", async () => {
        await expect(productController.getProducts("model", "Smartphone", null)).rejects.toThrowError(FilteringError);
        expect(ProductDAO.prototype.getFilteredProducts).toHaveBeenCalledTimes(0);
    });

    it("UPC4.10 - 404 Not Found - model does not represent a product in the database", async () => {
        jest.spyOn(ProductDAO.prototype, "getFilteredProducts").mockRejectedValue(new ProductNotFoundError());

        await expect(productController.getProducts("model", null, "Nonexistent Model")).rejects.toThrowError(ProductNotFoundError);

        expect(ProductDAO.prototype.getFilteredProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getFilteredProducts).toHaveBeenCalledWith("model", "Nonexistent Model");
    });
});


describe("UPC5 - getAvailableProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPC5.1 - 200 OK - get all available products", async () => {
        const products = [
            new Product(200, "iPhone 13", Category.SMARTPHONE, "", "2024-01-01", 8),
            new Product(1500, "MacBook Pro", Category.LAPTOP, "", "2024-01-01", 5)
        ];
    
        jest.spyOn(ProductDAO.prototype, "getAllProducts").mockResolvedValue(products);
        jest.spyOn(productController, "getProducts").mockResolvedValue(products); // Mocking getProducts
    
        const response = await productController.getAvailableProducts(null, null, null);
        expect(productController.getProducts).toHaveBeenCalledTimes(1);
        expect(response).toEqual(products);
    });

    it("UPC5.2 - 404 Not Found - model does not represent a product in the database", async () => {
        jest.spyOn(ProductDAO.prototype, "getAllProducts").mockRejectedValue(new ProductNotFoundError());

        await expect(productController.getAvailableProducts("model", null, "Nonexistent Model")).rejects.toThrowError(ProductNotFoundError);

        expect(productController.getProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getAllProducts).toHaveBeenCalledWith("model", null, "Nonexistent Model");
    });
});

describe("UPC6 - deleteProduct", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPC6.1 - 200 OK - product deleted successfully", async () => {
        const model = "iPhone13";

        jest.spyOn(ProductDAO.prototype, "deleteProduct").mockResolvedValue(true);

        const response = await productController.deleteProduct(model);

        expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledWith(model);
        expect(response).toBe(true);
    });

    it("UPC6.2 - 404 Not Found - product not found", async () => {
        const model = "NonexistentModel";

        jest.spyOn(ProductDAO.prototype, "deleteProduct").mockRejectedValue(new ProductNotFoundError());

        await expect(productController.deleteProduct(model)).rejects.toThrowError(ProductNotFoundError);

        expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledWith(model);
    });
});

describe("UPC7 - deleteAllProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("UPC7.1 - 200 OK - all products deleted successfully", async () => {
        jest.spyOn(ProductDAO.prototype, "deleteAllProducts").mockResolvedValue(true);

        const response = await productController.deleteAllProducts();

        expect(ProductDAO.prototype.deleteAllProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.deleteAllProducts).toHaveBeenCalledWith();
        expect(response).toBe(true);
    });
});



