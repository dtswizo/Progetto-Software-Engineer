import { expect, jest } from '@jest/globals';
import request from 'supertest'
import express from 'express';
import { spyCustomer, spyManager, spyAdmin, spyNotLogged, enableMockedAuth, initMockedApp } from '../src/testUtilities'
import ProductController from '../src/controllers/productController';
import ProductDAO from '../src/dao/productDAO';
import { User, Role } from '../src/components/user';
import { ProductAlreadyExistsError, ProductNotFoundError, LowProductStockError, EmptyProductStockError, FilteringError } from '../src/errors/productError';
import { cleanup, cleanupDB } from '../src/db/cleanup';
import db from "../src/db/db"
import sqlite from 'sqlite3';
import dayjs from 'dayjs';
import { Category } from '../src/components/product';
import { DateError } from '../src/utilities';

beforeAll((done) => {
    db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS products (model TEXT PRIMARY KEY, sellingPrice REAL, category TEXT, arrivalDate TEXT, details TEXT, quantity INTEGER)",
        done
      );
    });
  });
  
  beforeEach((done) => {
    db.serialize(() => {
      db.run("DELETE FROM products", done);
    });
  });
  
  afterAll((done) => {
    db.close(done);
  });
  
  describe('ProductController Integration Tests', () => {
    let productController: ProductController;
  
    beforeAll(() => {
      productController = new ProductController();
    });
  
    test('registerProducts should add a new product', async () => {
      const model = 'iPhone12';
      const category = Category.SMARTPHONE;
      const quantity = 10;
      const details = 'Latest model';
      const sellingPrice = 999;
      const arrivalDate = '2023-01-01';
  
      await productController.registerProducts(
        model,
        category,
        quantity,
        details,
        sellingPrice,
        arrivalDate
      );
      const products = await productController.getProducts(null, null, null);
  
      expect(products.length).toBe(1);
      expect(products[0].model).toBe(model);
      expect(products[0].category).toBe(category);
      expect(products[0].quantity).toBe(quantity);
    });
  
    test('registerProducts should throw DateError for future arrivalDate', async () => {
      const model = 'iPhone12';
      const category = Category.SMARTPHONE;
      const quantity = 10;
      const details = 'Latest model';
      const sellingPrice = 999;
      const arrivalDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
  
      await expect(
        productController.registerProducts(
          model,
          category,
          quantity,
          details,
          sellingPrice,
          arrivalDate
        )
      ).rejects.toThrow(DateError);
    });
  
    test('registerProducts should throw ProductNotFoundError for empty model', async () => {
      const model = '';
      const category = Category.SMARTPHONE;
      const quantity = 10;
      const details = 'Latest model';
      const sellingPrice = 999;
      const arrivalDate = '2023-01-01';
  
      await expect(
        productController.registerProducts(
          model,
          category,
          quantity,
          details,
          sellingPrice,
          arrivalDate
        )
      ).rejects.toThrow(ProductNotFoundError);
    });
  
    test('changeProductQuantity should increase the product quantity', async () => {
      const model = 'iPhone12';
      const category = Category.SMARTPHONE;
      const quantity = 10;
      const details = 'Latest model';
      const sellingPrice = 999;
      const arrivalDate = '2023-01-01';
  
      await productController.registerProducts(
        model,
        category,
        quantity,
        details,
        sellingPrice,
        arrivalDate
      );
  
      const newQuantity = 5;
      const updatedQuantity = await productController.changeProductQuantity(
        model,
        newQuantity,
        null
      );
  
      expect(updatedQuantity).toBe(quantity + newQuantity);
    });
  
    test('changeProductQuantity should throw DateError for future changeDate', async () => {
      const model = 'iPhone12';
      const category = Category.SMARTPHONE;
      const quantity = 10;
      const details = 'Latest model';
      const sellingPrice = 999;
      const arrivalDate = '2023-01-01';
  
      await productController.registerProducts(
        model,
        category,
        quantity,
        details,
        sellingPrice,
        arrivalDate
      );
  
      const newQuantity = 5;
      const changeDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
  
      await expect(
        productController.changeProductQuantity(model, newQuantity, changeDate)
      ).rejects.toThrow(DateError);
    });
  
    test('sellProduct should decrease the product quantity', async () => {
      const model = 'iPhone12';
      const category = Category.SMARTPHONE;
      const quantity = 10;
      const details = 'Latest model';
      const sellingPrice = 999;
      const arrivalDate = '2023-01-01';
  
      await productController.registerProducts(
        model,
        category,
        quantity,
        details,
        sellingPrice,
        arrivalDate
      );
  
      const sellQuantity = 3;
      const remainingQuantity = await productController.sellProduct(
        model,
        sellQuantity,
        null
      );
  
      expect(remainingQuantity).toBe(quantity - sellQuantity);
    });
  
    test('sellProduct should throw EmptyProductStockError if no stock is available', async () => {
      const model = 'iPhone12';
      const category = Category.SMARTPHONE;
      const quantity = 0;
      const details = 'Latest model';
      const sellingPrice = 999;
      const arrivalDate = '2023-01-01';
  
      await productController.registerProducts(
        model,
        category,
        quantity,
        details,
        sellingPrice,
        arrivalDate
      );
  
      await expect(
        productController.sellProduct(model, 1, null)
      ).rejects.toThrow(EmptyProductStockError);
    });
  
    test('sellProduct should throw LowProductStockError if insufficient stock', async () => {
      const model = 'iPhone12';
      const category = Category.SMARTPHONE;
      const quantity = 5;
      const details = 'Latest model';
      const sellingPrice = 999;
      const arrivalDate = '2023-01-01';
  
      await productController.registerProducts(
        model,
        category,
        quantity,
        details,
        sellingPrice,
        arrivalDate
      );
  
      await expect(
        productController.sellProduct(model, 10, null)
      ).rejects.toThrow(LowProductStockError);
    });
  
    test('getProducts should return all products', async () => {
      const model1 = 'iPhone12';
      const model2 = 'MacBookPro';
      await productController.registerProducts(
        model1,
        Category.SMARTPHONE,
        10,
        'Latest model',
        999,
        '2023-01-01'
      );
      await productController.registerProducts(
        model2,
        Category.LAPTOP,
        5,
        '2022 model',
        1999,
        '2023-01-01'
      );
  
      const products = await productController.getProducts(null, null, null);
  
      expect(products.length).toBe(2);
    });
  
    test('getAvailableProducts should return only products with quantity above 0', async () => {
      const model1 = 'iPhone12';
      const model2 = 'MacBookPro';
      await productController.registerProducts(
        model1,
        Category.SMARTPHONE,
        10,
        'Latest model',
        999,
        '2023-01-01'
      );
      await productController.registerProducts(
        model2,
        Category.LAPTOP,
        0,
        '2022 model',
        1999,
        '2023-01-01'
      );
  
      const availableProducts = await productController.getAvailableProducts(
        null,
        null,
        null
      );
  
      expect(availableProducts.length).toBe(1);
      expect(availableProducts[0].model).toBe(model1);
    });
  
    test('deleteAllProducts should delete all products', async () => {
      await productController.registerProducts(
        'iPhone12',
        Category.SMARTPHONE,
        10,
        'Latest model',
        999,
        '2023-01-01'
      );
      await productController.registerProducts(
        'MacBookPro',
        Category.LAPTOP,
        5,
        '2022 model',
        1999,
        '2023-01-01'
      );
  
      await productController.deleteAllProducts();
  
      const products = await productController.getProducts(null, null, null);
  
      expect(products.length).toBe(0);
    });
  
    test('deleteProduct should delete a specific product', async () => {
      await productController.registerProducts(
        'iPhone12',
        Category.SMARTPHONE,
        10,
        'Latest model',
        999,
        '2023-01-01'
      );
      await productController.registerProducts(
        'MacBookPro',
        Category.LAPTOP,
        5,
        '2022 model',
        1999,
        '2023-01-01'
      );
  
      await productController.deleteProduct('iPhone12');
  
      const products = await productController.getProducts(null, null, null);
  
      expect(products.length).toBe(1);
      expect(products[0].model).toBe('MacBookPro');
    });
  });