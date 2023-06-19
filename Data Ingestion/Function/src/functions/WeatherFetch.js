const { app, output } = require('@azure/functions');
//const https = require('https');
const axios = require('axios'); 
const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();
const { DefaultAzureCredential } = require('@azure/identity');
//const uploadBlob = require('./UploadBlob');

const getWeatherData = async (context) => {
    console.log('Function called')
    const key = 'a8562a123ca89df5d38118d86b813b2b'
    const lat = '39.986790'
    const lon = '-75.608883'
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;

    try {
        await axios.get(url)
        .then((res) => {
            context.log(res.data);
            return uploadBlob(context, res.data)
        });
        /*context.log(`statusCode: ${response.statusCode}`);
        context.log(response.data);
        return response.data;*/ // or return a custom object using properties from response
    } catch (error) {
        context.error(error);
      }
};

const uploadBlob = async (context, data) => {
    try {
        const AZURE_STORAGE_CONNECTION_STRING = 
        process.env.AzureWebJobsStorage;

        if (!AZURE_STORAGE_CONNECTION_STRING) {
            throw Error('Azure Storage Connection string not found');
        }

        // Create the BlobServiceClient object with connection string
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        const containerName = 'weatherinputdata';
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // Create the container

        const locationName = data.name.replace(/\s+/g, '');
        const date = new Date();
        // Create a unique name for the blob
        const blobName = `${locationName}_${date.getTime()}.json`;

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Display blob name and url
        context.log(
        `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
        );

        // Upload data to the blob
        //const JSONdata = JSON.parse(data)
        const uploadBlobResponse = await blockBlobClient.upload(JSON.stringify(data), Object.keys(data).length);
        context.log(
        `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        );
    }
    catch (error) {
        context.error(error);
    }
    
}

app.timer('WeatherFetch', {
    schedule: '0 15 * * * *',
    return: output.storageBlob({
        connection: process.env.AzureWebJobsStorage,
        path: 'weatherinputdata/testData',
    }),
    handler: async (myTimer, context) => {
        context.log('Function started')
        //context.log(process.env.AzureWebJobsStorage);
        
        return await getWeatherData(context)
    }
});