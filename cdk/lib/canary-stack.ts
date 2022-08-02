import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as synthetics from '@aws-cdk/aws-synthetics';
import * as s3 from '@aws-cdk/aws-s3';
import * as path from 'path';

export class CanaryStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const assetsBucket = new s3.Bucket(this, 'CanaryAssetsBucket', {
      bucketName: 'canary-assets-bucket',
      versioned: false,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const canaryRole = new iam.Role(this, 'canary-iam-role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Canary IAM Role',
    });

    canaryRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['s3:ListAllMyBuckets'],
        effect: iam.Effect.ALLOW,
      }),
    );

    canaryRole.addToPolicy(
      new iam.PolicyStatement({
        resources: [`${assetsBucket.bucketArn}/*`],
        actions: ['kms:GenerateDataKey'],
        effect: iam.Effect.ALLOW,
      }),
    );

    canaryRole.addToPolicy(
      new iam.PolicyStatement({
        resources: [
          `${assetsBucket.bucketArn}`,
          `${assetsBucket.bucketArn}/*`
        ],
        actions: ['s3:*'],
        effect: iam.Effect.ALLOW,
      }),
    );

    canaryRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['cloudwatch:PutMetricData'],
        effect: iam.Effect.ALLOW,
        conditions: {
          StringEquals: {
            'cloudwatch:namespace': 'CloudWatchSynthetics',
          },
        },
      }),
    );

    canaryRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ['arn:aws:logs:::*'],
        actions: ['logs:CreateLogStream', 'logs:CreateLogGroup', 'logs:PutLogEvents'],
        effect: iam.Effect.ALLOW,
      }),
    );

    new synthetics.Canary(this, 'Canary', {
      canaryName: 'example-canary',
      role: canaryRole,
      schedule: synthetics.Schedule.rate(cdk.Duration.minutes(1)), // ensure it runs every minute
      artifactsBucketLocation: {
        bucket: assetsBucket,
      },
      test: synthetics.Test.custom({
        code: synthetics.Code.fromAsset(path.join(__dirname, '../../canary')),
        handler: 'index.handler',
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_5,
      environmentVariables: {
        ENVIRONMENT: 'production',
        REGION: props?.env?.region!,
        URL: 'www.google.co.uk'
      },
    });
  }
}
