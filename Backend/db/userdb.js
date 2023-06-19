// Get Cosmos Client
//import {CosmosClient} from "@azure/cosmos";
const {CosmosClient} = require("@azure/cosmos")
require('dotenv').config();

const GetUserContainer = async () => {
    // Provide required connection from environment variables
    //const key = process.env.COSMOS_KEY;
    const key = process.env.dbkey
    // Endpoint format: https://YOUR-RESOURCE-NAME.documents.azure.com:443/
    //const endpoint = process.env.COSMOS_ENDPOINT;
    const endpoint = process.env.dbendpoint;

    // Set Database name and container name with unique timestamp
    const databaseName = `TestWeatherAppDB`;
    const containerName = `User`;
    const partitionKeyPath = ["/id"]

    // Authenticate to Azure Cosmos DB
    const cosmosClient = new CosmosClient({ endpoint, key });

    // Create database if it doesn't exist
    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
    console.log(`${database.id} database ready`);

    // Create container if it doesn't exist
    const { container } = await database.containers.createIfNotExists({
        id: containerName,
        partitionKey: {
            paths: partitionKeyPath
        }
    });
    console.log(`${container.id} container ready`);
    return container;
}

module.exports = {GetUserContainer};