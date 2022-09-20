import * as s3 from "aws-cdk-lib/aws-s3";
import { RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";


export class BatchJobManifestBucket extends Construct {
    readonly bucket: s3.IBucket

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.bucket = new s3.Bucket(scope, "bucket", {
            removalPolicy: RemovalPolicy.DESTROY
        });
    }
}