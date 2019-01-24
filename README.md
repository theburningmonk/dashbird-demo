# dashbird-demo

A simple demo app to show how you can use Dashbird to debug serverless apps

To deploy and try out this demo:

1. run `npm install`

2. run `npm run sls -- deploy` to deploy the entire CloudFormation stack to your AWS account, using the [Serverless](https://serverless.com) framework. The stack would be deployed to the `us-east-1` region.

3. go to the `followers` table in `us-east-1` and manually add a few followers as test data.

4. when the deployment finished in `step 2`, you should have seen output like this

```
Serverless: Packaging service...Serverless: Excluding development dependencies...
Serverless: Tracing ENABLED for function "dashbird-demo-dev-create-post"
Serverless: Tracing ENABLED for function "dashbird-demo-dev-distribute-post"
Serverless: Tracing ENABLED for function "dashbird-demo-dev-get-followers"
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (8.25 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
...........................................................................
Serverless: Stack update finished...
Service Information
service: dashbird-demo
stage: dev
region: us-east-1
stack: dashbird-demo-dev
api keys:
  None
endpoints:
  POST - https://23p4d93et3.execute-api.us-east-1.amazonaws.com/dev/posts/create
  GET - https://23p4d93et3.execute-api.us-east-1.amazonaws.com/dev/followers/{userId}
functions:
  create-post: dashbird-demo-dev-create-post
  distribute-post: dashbird-demo-dev-distribute-post
  get-followers: dashbird-demo-dev-get-followers
layers:
  None
```

Note the `POST` endpoint in the output, you need it in the next step.

5. run `curl -d '{"userId":"yan","message":"hello"}' -X POST https://9vi2bocxyh.execute-api.us-east-1.amazonaws.com/dev/posts/create` to publish a new post.