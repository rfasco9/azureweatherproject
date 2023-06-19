import { app, HttpHandler, HttpRequest, HttpResponse, InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';
import { ActivityHandler, OrchestrationContext, OrchestrationHandler } from 'durable-functions';
const axios = require('axios')

const activityName = 'FetchOrchestrator';

const FetchOrchestratorOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {

    const key = 'a8562a123ca89df5d38118d86b813b2b'
    const input: any = context.df.getInput()
    const zips: string[] = input.zips;
    context.log(input)
    const tasks: df.Task[] = [];
    context.log('In orchestrator')
    for (let i = 0; i < zips.length; i++) {
        context.log('in loop')
        tasks.push(context.df.callActivity('FetchOrchestrator', zips[i]));
    }
    const results: df.Task[] = yield context.df.Task.all(tasks)
    context.df.setCustomStatus("Tasks complete");
    const returnedResults = {results: results}
    return returnedResults
};
df.app.orchestration('FetchOrchestratorOrchestrator', FetchOrchestratorOrchestrator);

const FetchOrchestrator: ActivityHandler = async (input: string) => {
    const url: string = `https://api.openweathermap.org/data/2.5/weather?zip=${input}&appid=a8562a123ca89df5d38118d86b813b2b&units=imperial`;
    const response = await axios.get(url);
    const body = await response.data;
    return body;
};

df.app.activity(activityName, { handler: FetchOrchestrator });

const FetchOrchestratorHttpStart: HttpHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponse> => {
    const client = df.getClient(context);
    const zips: string[] = await request.query.getAll('zip')[0].split(',');
    const instanceId: string = await client.startNew(request.params.orchestratorName, { input: {zips: zips} });

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    let durableOrchestrationStatus = await client.getStatus(instanceId);
    while (durableOrchestrationStatus.customStatus == null || durableOrchestrationStatus.customStatus.toString() !== "Tasks complete") {
        await new Promise((resolve) => setTimeout(resolve, 50));
        durableOrchestrationStatus = await client.getStatus(instanceId);
    }

    return client.createCheckStatusResponse(request, instanceId);
};

app.http('FetchOrchestratorHttpStart', {
    route: `orchestrators/{orchestratorName}`,
    extraInputs: [df.input.durableClient()],
    handler: FetchOrchestratorHttpStart,
});