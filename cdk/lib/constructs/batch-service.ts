import { Construct } from "constructs";
import * as batch from "aws-cdk-lib/aws-batch";

import { BatchComputeEnvironment } from "./batch-compute-environment";
import { ComputeEnvironmentVpc } from "./compute-environment-vpc";
import { ProjectConfig } from "../../config/project-config";
import { BatchJobManifestBucket } from "./batch-job-manifest-bucket";
import { BatchJobDefinition } from "./batch-job-definition";


export interface BatchServiceProps {
    config: ProjectConfig
    vpc: ComputeEnvironmentVpc
    batchManifestBucket: BatchJobManifestBucket
}

export class BatchService extends Construct {
    readonly batchJobDefinition: batch.CfnJobDefinition
    readonly batchJobQueue: batch.CfnJobQueue

    constructor(scope: Construct, id: string, props: BatchServiceProps) {
        super(scope, id);
    
        const batchComputeEnvironment = new BatchComputeEnvironment(this, 'BatchComputeEnvironment', {
            maxvCpus: props.config.batchService.computeEnvMaxvCpus,
            vpc: props.vpc
        });
    
        const batchJobQueue = new batch.CfnJobQueue(this, 'BatchJobQueue', {
            computeEnvironmentOrder: [
                {
                    computeEnvironment: batchComputeEnvironment.computeEnvironment.ref,
                    order: 0
                }
            ],
            priority: 0
        });   
        
        const batchJobDefinition = new BatchJobDefinition(this, 'BatchJobDefinition', {
            batchJobManifestBucket: props.batchManifestBucket,
            batchServiceConfig: props.config.batchService
        })

        this.batchJobDefinition = batchJobDefinition.jobDefinition;
        this.batchJobQueue = batchJobQueue;
    }
}