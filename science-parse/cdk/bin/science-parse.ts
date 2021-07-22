/**
 * @author Alexander Catic <alex@catic.dev>
 * @version  0.1.0
 * @license The MIT License (MIT)
   @file science-parse.ts
   @description AWS CDK Deployment script
 */

import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";

export class ScienceParseStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const vpc = new ec2.Vpc(this, "ScienceParseStackVPC", {
      maxAzs: 3,
    });

    const cluster = new ecs.Cluster(this, "ScienceParseCluster", {
      vpc: vpc,
    });

    const ScienceParseBaseEnv: {
      [key: string]: string;
    } = {
      APP_PORT: "8080",
      AWS_REGION: this.region,
    };

    const server = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "ScienceParseServer",
      {
        cluster: cluster,
        cpu: 1024,
        desiredCount: 1,
        taskImageOptions: {
          enableLogging: true,
          containerPort: Number.parseInt(ScienceParseBaseEnv.APP_PORT),
          image: ecs.ContainerImage.fromRegistry("stoposto1/9323:latest"),
          environment: {
            ...ScienceParseBaseEnv,
          },
        },
        memoryLimitMiB: 8192,
        publicLoadBalancer: true,
      }
    );
  }
}

const app = new cdk.App();
new ScienceParseStack(app, "SPV1");
app.synth();
