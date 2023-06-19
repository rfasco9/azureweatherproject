// 1. importing the required APIs for performing operations with Cosmos
import { CosmosClient } from '@azure/cosmos';
// 2. importing the application configuration constant for URL and Primary key 
import dotenv from 'dotenv'
// 3. importing product details class
// 4. The Data Access class to create various operations
export class Dao {
    // 4.1. defining class level members 
    client;
    databaseId;
    collectionId;
    database;
    container;
    // 4.2. constructor contains code to connect to CosmosDB Account
    constructor() {
        dotenv.config()
        // 4.3. creating an instance of the CosmosClient and settings keys
        const endpoint = process.env.uri;
        const key = process.env.authKey;
        this.client = new CosmosClient({ endpoint, key });
        // ends here
        // 4.4. set the databaseId and containerId
        this.databaseId = process.env.databaseId;
        this.collectionId = process.env.containerId;
        //ends here
    }

    // 4.5. initialize the CosmosDB connections to create database and container
     async initDbAndContainer() {
         // create database if not exist
         console.log('init db')
         const responseDb = await this.client.databases.createIfNotExists({id:this.databaseId});
         this.database = responseDb.database;   
         console.log(`Database Created ${this.database}`);
         // ends here

         // create a container if not exist
          const responseContainer = await this.database.containers.createIfNotExists({
            id:this.collectionId
          });  
          this.container =  responseContainer.container;
          console.log(`Container Created ${this.container}`);
         // ends here
     }
    // ends here

    // 4.6. add user
    async addUser(user) {
        const resp = await this.container.items.create(user);
        console.log(`In the addUser ${JSON.stringify(resp.body)}`);
        return resp.body;
    }
    // ends here

    // 4.7. query to data
    async queryData() {
      const query = 'SELECT * FROM User';
      if(!this.container){
          throw new Error('The specified collection is not present');
      }  
      const {resources} = await this.container.items.query(query).fetchAll();
      return resources
    }

    async queryById(id) {
        const querySpec = {
            query: "select * from User p where p.id=@id",
            parameters: [
                {
                    name: "@id",
                    value: id
                }
            ]
        };
        if(!this.container){
            throw new Error('The specified collection is not present');
        }  
        const {resources} = await this.container.items.query(querySpec).fetchAll();
        console.log(resources)
        if (!resources) {
            console.log('not found')
        }
        return resources;
    }

    async createUserIfNoneExists(id) {
        console.log(id)
        const dbUser = await this.queryById(id);
        if (dbUser.length == 0) {
            console.log('adding user')
            return await this.addUser({id: id, locations: []})
        } else {
            console.log(dbUser)
            return dbUser
        }
    }
    // ends here
    // 4.8. code to update user
    async update(id, user){
        // get the document base on id parameter
        const record =  await this.container.item(id, id).read();
        console.log(record)
        console.log(`Record for update ${JSON.stringify(record.resource)}`);
        // set the updated values
        record.resource.id = user.id;
        record.resource.locations = user.locations
        console.log(`Record for update values ${JSON.stringify(record.resource)}`);

        const updated = await this.container.item(id).replace(record.resource);
        console.log(`Record after update ${JSON.stringify(updated.resource)}`);
        console.log(updated)
        return updated.resource;
    }
}