// 1. import Request and Response objects from express
//import { Request, Response } from "express";
//const { Request, Response } = require('express')
// 2. import the ProductDetails class
//import { ProductDetails } from './../models/productsdetails';
// 3. import the Dao class
import { Dao } from "../db/userdao.js"
//const Dao = require("../db/userdao")
// 4. The AppController class
export class AppController {
    // 4.1 Define an instance of the Dao class
    dao;
    constructor() {
        this.dao = new Dao();
    }
    // 4.2 the init method accepts initDbAndContainer() 
    // method to create database and container
    async init() { 
        await this.dao.initDbAndContainer();
    }
   // 4.3 this method accepts queryData() method to return query result  
    async getData(request, response) {
        const users = await this.dao.queryData();

        response.send({ data: users });
    }

    async getUserById(request, response) {
        //console.log(request)
        const users = await this.dao.queryById(request.params.id);

        response.send({ data: users });
    }
    // 4.4 this method accepts the ProductDetails in the request body and 
    //create product by accepting addProduct() method
    async addUser(request, response) {
        const body = request.body;
        console.log(`Received Body ${JSON.stringify(body)}`);
        let data = await this.dao.createUserIfNoneExists(body.id);
        response.send({ data: data });
    }
    // 4.5 this method is used to update the product
    async updateLocations(request, response) {
        const body = request.body;
        const id = request.params.id;
        console.log(`Received Body ${JSON.stringify(body)}`);
        const user = {
            id: body.id,
            locations: body.locations
        };
        console.log(`User ${JSON.stringify(user)}`);
        let data = await this.dao.update(id,user);
        response.send({ data: data });
    }

}

//module.exports = AppController