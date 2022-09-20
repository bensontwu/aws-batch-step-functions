import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";

import { BatchService } from "./batch-service";
import { SubmitJobsFunction } from "./submit-jobs-function";


class ProcessorStateMachineProps {
    submitJobsFunction: SubmitJobsFunction
    batchService: BatchService
}

export class ProcessorStateMachine extends Construct {
    readonly stateMachine: sfn.IStateMachine;

    constructor(scope: Construct, id: string, props: ProcessorStateMachineProps) {
        super(scope, id);

        const submitJobsFunctionResultPath = 'submit-jobs-function-result'
    
        const invokeSubmitJobsFunction = new tasks.LambdaInvoke(this, "InvokeSubmitJobsFunction", {
            lambdaFunction: props.submitJobsFunction.function,
            resultSelector: {
                'array-job-id.$': '$.Payload.array-job-id',
                'array-job-size.$': '$.Payload.array-job-size'
            },
            resultPath: `$.${submitJobsFunctionResultPath}`
        });

        const submitBatchJobs = new tasks.BatchSubmitJob(this, 'BatchSubmitJob', {
            jobName: 'ProcessingJob',
            jobDefinitionArn: props.batchService.batchJobDefinition.ref,
            jobQueueArn: props.batchService.batchJobQueue.attrJobQueueArn,
            containerOverrides: {
                environment: {
                    'JOB_ID': sfn.TaskInput.fromJsonPathAt(`$.${submitJobsFunctionResultPath}.array-job-id`).value
                }
            },
            arraySize: sfn.TaskInput.fromJsonPathAt(`$.${submitJobsFunctionResultPath}.array-job-size`).value,
            integrationPattern: sfn.IntegrationPattern.RUN_JOB
        })

        this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
            definition: invokeSubmitJobsFunction.next(submitBatchJobs)
        });
    }
}