import { ERROR } from "sqlite3";
import ProductDAO from "../dao/productDAO";
import dayjs from "dayjs";
import { EmptyProductStockError, FilteringError, LowProductStockError, ProductNotFoundError } from "../errors/productError";
import { DateAfterToday, DateBeforeArrival } from "../errors/dateError";
import { error, group } from "console";
import { Product } from "../components/product";

/**
 * Represents a controller for managing products.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class ProductController {
    private dao: ProductDAO

    constructor() {
        this.dao = new ProductDAO
    }

    /**
     * Registers a new product concept (model, with quantity defining the number of units available) in the database.
     * @param model The unique model of the product.
     * @param category The category of the product.
     * @param quantity The number of units of the new product.
     * @param details The optional details of the product.
     * @param sellingPrice The price at which one unit of the product is sold.
     * @param arrivalDate The optional date in which the product arrived.
     * @returns A Promise that resolves to nothing.
     */
    async registerProducts(model: string, category: string, quantity: number, details: string | null, sellingPrice: number, arrivalDate: string | null) /**:Promise<void> */ {
        
        if (arrivalDate===null){
            arrivalDate=dayjs().format('YYYY-MM-DD');
        }
        if (dayjs(arrivalDate).isAfter(dayjs())){
            return new DateAfterToday();
        }
        if (model=="" || model==null){
            return new ProductNotFoundError();
        }
        if (category!="Smartphone" && category!="Laptop" && category!="Appliance"){
            return Error("parameter category is not valid");
        }
        if(quantity<=0){
            return Error("parameter quantity is not valid");
        }
        

        const result = await this.dao.registerProducts(model, category,quantity,details,sellingPrice,arrivalDate);
        return result;
     }

    /**
     * Increases the available quantity of a product through the addition of new units.
     * @param model The model of the product to increase.
     * @param newQuantity The number of product units to add. This number must be added to the existing quantity, it is not a new total.
     * @param changeDate The optional date in which the change occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    async changeProductQuantity(model: string, newQuantity: number, changeDate: string | null) /**:Promise<number> */ { 
        
        if (changeDate===null){
            changeDate=dayjs().format('YYYY-MM-DD');
        }
        if (dayjs(changeDate).isAfter(dayjs())){
            return new DateAfterToday();
        }
        let arrival= await this.dao.getArrivalDate(model);
        if (dayjs(changeDate).isBefore(dayjs(arrival))){
            return new DateBeforeArrival();
        }
        if (model=="" || model==null){
            return new ProductNotFoundError();
        }
        if(newQuantity<=0){
            return Error("parameter quantity is not valid");
        }

        return await this.dao.changeProductQuantity(model,newQuantity,changeDate);

        
    }

    /**
     * Decreases the available quantity of a product through the sale of units.
     * @param model The model of the product to sell
     * @param quantity The number of product units that were sold.
     * @param sellingDate The optional date in which the sale occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    async sellProduct(model: string, quantity: number, sellingDate: string | null) /**:Promise<number> */ { 
        if (sellingDate===null){
            sellingDate=dayjs().format('YYYY-MM-DD');
        }
        if (dayjs(sellingDate).isAfter(dayjs())){
            return DateAfterToday;
        }
        let arrival= await this.dao.getArrivalDate(model);
        if (dayjs(sellingDate).isBefore(dayjs(arrival))){
            return DateBeforeArrival;
        }
        if (model=="" || model==null){
            return new ProductNotFoundError();
        }
        if(quantity<=0){
            return Error("parameter quantity is not valid");
        }
        let q= await this.dao.getProductQuantity(model);
        if(q==0){
            return new EmptyProductStockError();
        }
        if(q<quantity){
            return new LowProductStockError();
        }
        

        return await this.dao.changeProductQuantity(model,q-quantity,sellingDate);
    }

    /**
     * Returns all products in the database, with the option to filter them by category or model.
     * @param grouping An optional parameter. If present, it can be either "category" or "model".
     * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
     * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
     * @returns A Promise that resolves to an array of Product objects.
     */
    async getProducts(grouping: string | null, category: string | null, model: string | null) /**Promise<Product[]> */ { 
        if (grouping===null && (category!==null || model!==null)){
            return new FilteringError();
        }
        if(grouping==="category" && (category===null || model!==null)){
            return new FilteringError();
        }
        if(grouping==="model" && (category!==null || model===null)){
            return new FilteringError();
        }
        if (category!==null && category!="Smartphone" && category!="Laptop" && category!="Appliance"){
            return Error("parameter category is not valid");
        }

        if(grouping==="category"){
            return await this.dao.getFilteredProducts("category",category);
        }else if(grouping==="model"){
            if (model===""){
                return Error("parameter model can't be empty");
            }
            return await this.dao.getFilteredProducts("model",model);
        }else if (grouping===null){
            return await this.dao.getAllProducts();
        }else{
            return Error("parameter grouping is not valid");
        }

    }

    /**
     * Returns all available products (with a quantity above 0) in the database, with the option to filter them by category or model.
     * @param grouping An optional parameter. If present, it can be either "category" or "model".
     * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
     * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
     * @returns A Promise that resolves to an array of Product objects.
     */
    async getAvailableProducts(grouping: string | null, category: string | null, model: string | null) /**:Promise<Product[]> */ {
        let result=await this.getProducts(grouping,category,model)
        .then(
            (products:Product[])=>{products.filter((p)=>p.quantity>0)}
        );

        return result;

     }

    /**
     * Deletes all products.
     * @returns A Promise that resolves to `true` if all products have been successfully deleted.
     */
    async deleteAllProducts() /**:Promise <Boolean> */ {
        return this.dao.deleteAllProducts();
    }


    /**
     * Deletes one product, identified by its model
     * @param model The model of the product to delete
     * @returns A Promise that resolves to `true` if the product has been successfully deleted.
     */
    async deleteProduct(model: string) /**:Promise <Boolean> */ { 
        if (model===""){
            return Error("parameter model can't be empty");
        }

        return await this.dao.deleteProduct(model);
    }

}

export default ProductController;