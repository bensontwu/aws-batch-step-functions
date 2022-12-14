# AWS Batch with Step Functions

AWS Batch is a powerful tool that makes it easy to schedule and track batch processing jobs. When combined with Step Functions, it allows teams to easily set up a platform to track and run processing jobs at a large scale.

AWS Batch Job Arrays take this further by allowing teams to process many similar jobs as one process. This allows teams to track a group of related jobs as a unit. This pattern will demonstrate how to use AWS Batch, AWS Step Functions, and job manifests to orchestrate and process a large amount of related jobs.

## Architecture Diagram

![batch-step (2)](https://user-images.githubusercontent.com/40438500/194972806-0091259f-4abf-4c6b-a18e-75b466b74bea.png)

## Orhestrator State Machine Graph

![stepfunctions_graph (7)](https://user-images.githubusercontent.com/40438500/194970568-12997cbe-2ff0-460f-9db8-629ea74031cd.png)
