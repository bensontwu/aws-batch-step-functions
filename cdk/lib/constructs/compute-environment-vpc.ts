import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';


export class ComputeEnvironmentVpc extends Construct {

    readonly vpc: ec2.IVpc;
    readonly securityGroup: ec2.ISecurityGroup;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.vpc = new ec2.Vpc(this, 'Vpc', {
            cidr: '10.0.0.0/24',
            subnetConfiguration: [
                {
                    cidrMask: 26,
                    name: 'private-subnet-1',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
                },
                {
                    cidrMask: 28,
                    name: 'public-subnet-1',
                    subnetType: ec2.SubnetType.PUBLIC
                }
            ]
        });
        
        this.securityGroup = new ec2.SecurityGroup(this, 'SecGroup', {
            allowAllOutbound: true,
            vpc: this.vpc
        });
    }
}

