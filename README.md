# Cloudwatch Synthetic Canary

## Info 

This handles deployment for a Cloudwatch Synthetic Canary. The stack consists of an S3 bucket for the zip file of the canary code, Lambda function to execute canary code, Lambda layer for nodejs dependency management (puppeteer), Cloudwatch alarm for failed executions, Cloudwatch logs for runtime logging, Xray for distributed system tracing, and appropriate Iam roles.

Canaries offer programmatic access to a headless Google Chrome Browser. Canaries are scripts that monitor your endpoints and APIs from the outside-in. Canaries help you check the availability and latency of your web services and troubleshoot anomalies by investigating load time data, screenshots of the UI, logs, and metrics. You can set up a canary to run continuously or just once.

- [AWS Documentation: Using synthetic monitoring](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html)
- [AWS Documentation: CDK Synthetics](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-synthetics-readme.html)


## Architecture

<p align="center">
  <img src="/architecture-diagram.drawio.svg" />
</p>


## Usage 

### Credentials:

```bash
export AWS_PROFILE=<profile_name>
```

### Deploy:

```bash
yarn run deploy
```

### Remove:

```bash
yarn run remove
```
