import path = require('path');

import { Construct } from "constructs";
import { Duration } from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { BatchJobManifestBucket } from './batch-job-manifest-bucket';


class SubmitJobsFunctionProps {
    batchJobManifestBucket: BatchJobManifestBucket
}

export class SubmitJobsFunction extends Construct {
    readonly function: lambda.IFunction;

    constructor(scope: Construct, id: string, props: SubmitJobsFunctionProps) {
        super(scope, id);

        this.function = new lambda.Function(this, "Function", {
            runtime: lambda.Runtime.PYTHON_3_9,
            code: lambda.Code.fromAsset(path.join(path.dirname(path.dirname(path.dirname(__dirname))), 'lambda')),
            handler: 'submit_jobs.lambda_handler',
            timeout: Duration.seconds(10),
            environment: {
                'BATCH_JOB_MANIFEST_BUCKET_NAME': props.batchJobManifestBucket.bucket.bucketName
            }
        });

        props.batchJobManifestBucket.bucket.grantWrite(this.function);
    }
}