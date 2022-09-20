import path = require("path");

import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as batch from "aws-cdk-lib/aws-batch";
import * as ecrAssets from "aws-cdk-lib/aws-ecr-assets";
import * as logs from "aws-cdk-lib/aws-logs";

import { BatchJobManifestBucket } from "./batch-job-manifest-bucket";
import { BatchServiceConfig } from "../../config/project-config";


class BatchJobDefinitionProps {
    batchServiceConfig: BatchServiceConfig
    batchJobManifestBucket: BatchJobManifestBucket
}

export class BatchJobDefinition extends Construct {
    readonly jobDefinition: batch.CfnJobDefinition;

    constructor(scope: Construct, id: string, props: BatchJobDefinitionProps) {
        super(scope, id);

        const executionRole = this.createEcsRole('ServiceTaskExecutionRole', 'ServiceTaskExecutionRole');
        const jobRole = this.createEcsRole('ServiceTaskRole', 'ServiceTaskRole');

        const imageAsset = new ecrAssets.DockerImageAsset(this, 'ImageAsset', {
            directory: path.join(path.dirname(path.dirname(path.dirname(__dirname))), 'image')
        })

        this.jobDefinition = new batch.CfnJobDefinition(this, 'BatchJobDefinition', {
            containerProperties: {
                image: imageAsset.imageUri,
                executionRoleArn: executionRole.roleArn,
                jobRoleArn: jobRole.roleArn,
                resourceRequirements: [
                    {
                        type: 'MEMORY',
                        value: props.batchServiceConfig.jobMemory
                    },
                    {
                        type: 'VCPU',
                        value: props.batchServiceConfig.jobvCpus
                    }
                ],
                environment: [
                    {
                        name: 'BATCH_JOB_MANIFEST_BUCKET_NAME',
                        value: props.batchJobManifestBucket.bucket.bucketName
                    }
                ]
            },
            retryStrategy: {
                attempts: 3
            },
            type: 'container',
            platformCapabilities: ['FARGATE']
        });

        // Permissions
        const awsBatchLogGroup = logs.LogGroup.fromLogGroupName(this, 'AwsBatchLogGroup', '/aws/batch/job');
        imageAsset.repository.grantPull(executionRole);
        awsBatchLogGroup.grantWrite(executionRole);
        props.batchJobManifestBucket.bucket.grantRead(jobRole);
    }

    private createEcsRole(id: string, roleName: string): iam.IRole {
        const ecsRole = new iam.Role(this, id, {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            roleName: roleName
        });
        return ecsRole;
    }
}