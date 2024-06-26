# CircleCI OIDC

This repository contains constructs to communicate between CircleCI and AWS via an Open ID Connect (OIDC) provider. The
process is described in [this CircleCI blog post](https://circleci.com/blog/openid-connect-identity-tokens/).

## Security Benefits

By using the OpenID Connect provider, you can communicate with AWS from CircleCI without saving static credentials
(e.g., `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) in your CircleCI project settings or a context. Removing static
credentials, especially in light of the early 2023 [breach](https://circleci.com/blog/jan-4-2023-incident-report/), is a
best practice for security.

## Quick Start

Install the package:

```bash
npm install @blimmer/cdk-circleci-oidc

or

yarn add @blimmer/cdk-circleci-oidc
```

Then, create the provider and role(s).

```typescript
import { Stack, StackProps } from "aws-cdk-lib";
import { CircleCiOidcProvider, CircleCiOidcRole } from "@blimmer/cdk-circleci-oidc";
import { Construct } from "constructs";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class CircleCiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The provider is only created _once per AWS account_. It might make sense to define this in a separate stack
    // that defines more global resources. See below for how to use import the provider in stacks that don't define it.
    const provider = new CircleCiOidcProvider(this, "OidcProvider", {
      // Find your organization ID in the CircleCI dashboard under "Organization Settings"
      organizationId: "11111111-2222-3333-4444-555555555555",
    });

    const myCircleCiRole = new CircleCiOidcRole(this, "MyCircleCiRole", {
      provider,
      roleName: "MyCircleCiRole",

      // Pass some managed policies to the role
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("AmazonS3ReadOnlyAccess")],
    });

    // You can work with the CircleCI role like any other role
    myCircleCiRole.addToPolicy(
      new PolicyStatement({
        actions: ["s3:ListAllMyBuckets"],
        resources: ["*"],
      }),
    );

    // Including using `.grant` convenience methods
    const bucket = new Bucket(this, "MyBucket");
    bucket.grantRead(myCircleCiRole);
  }
}
```

Now, in your `.circleci/config.yml` file, you can use the
[AWS CLI Orb](https://circleci.com/developer/orbs/orb/circleci/aws-cli) to assume your new role.

```yaml
version: 2.1

orbs:
  aws-cli: circleci/aws-cli@4.1.0 # https://circleci.com/developer/orbs/orb/circleci/aws-cli

workflows:
  version: 2
  build:
    jobs:
      - oidc-job:
          context: oidc-assumption # You _must_ use a context, even if it doesn't contain any secrets (see https://circleci.com/docs/openid-connect-tokens/#openid-connect-id-token-availability)

jobs:
  oidc-job:
    docker:
      - image: cimg/base:stable
    steps:
      - checkout
      # https://circleci.com/developer/orbs/orb/circleci/aws-cli#commands-setup
      - aws-cli/setup:
          role_arn: "arn:aws:iam::123456789101:role/MyCircleCiRole"
      - run:
          name: List S3 Buckets
          command: aws s3 ls
```

## Usage in Stacks that Don't Define the Provider

The `CircleCiOidcProvider` is only created **once per account**. You can use the
`CircleCiOidcProvider.fromOrganizationId` method to import a previously created provider into any stack.

```typescript
import { Stack, StackProps } from "aws-cdk-lib";
import { CircleCiOidcRole, CircleCiOidcProvider } from "@blimmer/cdk-circleci-oidc";
import { Construct } from "constructs";

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myCircleCiRole = new CircleCiOidcRole(this, "MyCircleCiRole", {
      provider: CircleCiOidcProvider.fromOrganizationId(this, "11111111-2222-3333-4444-555555555555"),
      roleName: "MyCircleCiRole",
    });
  }
}
```

## Usage

For detailed API docs, see [API.md](/API.md).

## Python

This package is available for Python as `cdk-circleci-oidc`.

```bash
pip install cdk-circleci-oidc
```

## Upgrading Between Major Versions

The API can be expected to change between major versions. Please consult the [UPGRADING docs](/UPGRADING.md) for for
information.

## Contributing

Contributions, issues, and feedback are welcome!
