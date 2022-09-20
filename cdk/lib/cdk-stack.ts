import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import config from '../config/project-config';
import { BatchJobManifestBucket } from './constructs/batch-job-manifest-bucket';
import { BatchService } from './constructs/batch-service';
import { ComputeEnvironmentVpc } from './constructs/compute-environment-vpc';
import { ProcessorStateMachine } from './constructs/processor-state-machine';
import { SubmitJobsFunction } from './constructs/submit-jobs-function';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = new ComputeEnvironmentVpc(this, 'ComputeEnvironmentVpc');

        const bucket = new BatchJobManifestBucket(this, 'BatchJobManifestBucket');

        const batchService = new BatchService(this, 'BatchService', {
            vpc: vpc,
            batchManifestBucket: bucket,
            config: config
        });

        const submitJobsFunction = new SubmitJobsFunction(this, 'SubmitJobsFunction', {
            batchJobManifestBucket: bucket
        });

        const processorStateMachine = new ProcessorStateMachine(this, 'ProcessorStateMachine', {
            batchService: batchService,
            submitJobsFunction: submitJobsFunction
        })
    }
}
