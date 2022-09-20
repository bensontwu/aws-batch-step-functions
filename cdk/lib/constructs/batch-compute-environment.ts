import { Construct } from 'constructs';
import * as batch from 'aws-cdk-lib/aws-batch';

import { ComputeEnvironmentVpc } from './compute-environment-vpc';


export interface BatchComputeEnvironmentProps {
    vpc: ComputeEnvironmentVpc
    maxvCpus: number
}

export class BatchComputeEnvironment extends Construct {
    readonly computeEnvironment: batch.CfnComputeEnvironment;

    constructor(scope: Construct, id: string, props: BatchComputeEnvironmentProps) {
        super(scope, id);

        const vpc = props.vpc.vpc;

        const sgId = props.vpc.securityGroup.securityGroupId;
        
        const batchComputeEnvironment = new batch.CfnComputeEnvironment(this, 'BatchComputeEnvironment', {
            computeResources: {
                maxvCpus: props.maxvCpus,
                securityGroupIds: [sgId],
                subnets: vpc.privateSubnets.map(subnet => subnet.subnetId),
                type: 'FARGATE',
            },
            type: 'MANAGED',
            replaceComputeEnvironment: false
        });

        this.computeEnvironment = batchComputeEnvironment;
    }
}