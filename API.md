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

The API can be expected to change between major versions. Please consult the [UPGRADING docs](/UPGRADING.md.md) for for
information.

## Contributing

Contributions, issues, and feedback are welcome!

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### CircleCiOidcProvider <a name="CircleCiOidcProvider" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider"></a>

- *Implements:* <a href="#@blimmer/cdk-circleci-oidc.ICircleCiOidcProvider">ICircleCiOidcProvider</a>

This construct creates a CircleCI ODIC provider to allow AWS access from CircleCI jobs.

You'll need to instantiate
this construct once per AWS account you want to use CircleCI OIDC with.

You can import a existing provider using `CircleCiOidcProvider.fromOrganizationId`.

To create a role that can be assumed by CircleCI jobs, use the `CircleCiOidcRole` construct.

#### Initializers <a name="Initializers" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.Initializer"></a>

```typescript
import { CircleCiOidcProvider } from '@blimmer/cdk-circleci-oidc'

new CircleCiOidcProvider(scope: Construct, id: string, props: CircleCiOidcProviderProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.Initializer.parameter.props">props</a></code> | <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps">CircleCiOidcProviderProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.Initializer.parameter.props"></a>

- *Type:* <a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps">CircleCiOidcProviderProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.overrideLogicalId">overrideLogicalId</a></code> | Overrides the auto-generated logical ID with a specific ID. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addDeletionOverride">addDeletionOverride</a></code> | Syntactic sugar for `addOverride(path, undefined)`. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addDependency">addDependency</a></code> | Indicates that this resource depends on another resource and cannot be provisioned unless the other resource has been successfully provisioned. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addDependsOn">addDependsOn</a></code> | Indicates that this resource depends on another resource and cannot be provisioned unless the other resource has been successfully provisioned. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addMetadata">addMetadata</a></code> | Add a value to the CloudFormation Resource Metadata. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addOverride">addOverride</a></code> | Adds an override to the synthesized CloudFormation resource. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addPropertyDeletionOverride">addPropertyDeletionOverride</a></code> | Adds an override that deletes the value of a property from the resource definition. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addPropertyOverride">addPropertyOverride</a></code> | Adds an override to a resource property. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.applyRemovalPolicy">applyRemovalPolicy</a></code> | Sets the deletion policy of the resource based on the removal policy specified. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.getAtt">getAtt</a></code> | Returns a token for an runtime attribute of this resource. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.getMetadata">getMetadata</a></code> | Retrieve a value value from the CloudFormation Resource Metadata. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.obtainDependencies">obtainDependencies</a></code> | Retrieves an array of resources this resource depends on. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.obtainResourceDependencies">obtainResourceDependencies</a></code> | Get a shallow copy of dependencies between this resource and other resources in the same stack. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.removeDependency">removeDependency</a></code> | Indicates that this resource no longer depends on another resource. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.replaceDependency">replaceDependency</a></code> | Replaces one dependency with another. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.inspect">inspect</a></code> | Examines the CloudFormation resource and discloses attributes. |

---

##### `toString` <a name="toString" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `overrideLogicalId` <a name="overrideLogicalId" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.overrideLogicalId"></a>

```typescript
public overrideLogicalId(newLogicalId: string): void
```

Overrides the auto-generated logical ID with a specific ID.

###### `newLogicalId`<sup>Required</sup> <a name="newLogicalId" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.overrideLogicalId.parameter.newLogicalId"></a>

- *Type:* string

The new logical ID to use for this stack element.

---

##### `addDeletionOverride` <a name="addDeletionOverride" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addDeletionOverride"></a>

```typescript
public addDeletionOverride(path: string): void
```

Syntactic sugar for `addOverride(path, undefined)`.

###### `path`<sup>Required</sup> <a name="path" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addDeletionOverride.parameter.path"></a>

- *Type:* string

The path of the value to delete.

---

##### `addDependency` <a name="addDependency" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addDependency"></a>

```typescript
public addDependency(target: CfnResource): void
```

Indicates that this resource depends on another resource and cannot be provisioned unless the other resource has been successfully provisioned.

This can be used for resources across stacks (or nested stack) boundaries
and the dependency will automatically be transferred to the relevant scope.

###### `target`<sup>Required</sup> <a name="target" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addDependency.parameter.target"></a>

- *Type:* aws-cdk-lib.CfnResource

---

##### ~~`addDependsOn`~~ <a name="addDependsOn" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addDependsOn"></a>

```typescript
public addDependsOn(target: CfnResource): void
```

Indicates that this resource depends on another resource and cannot be provisioned unless the other resource has been successfully provisioned.

###### `target`<sup>Required</sup> <a name="target" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addDependsOn.parameter.target"></a>

- *Type:* aws-cdk-lib.CfnResource

---

##### `addMetadata` <a name="addMetadata" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addMetadata"></a>

```typescript
public addMetadata(key: string, value: any): void
```

Add a value to the CloudFormation Resource Metadata.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html

Note that this is a different set of metadata from CDK node metadata; this
metadata ends up in the stack template under the resource, whereas CDK
node metadata ends up in the Cloud Assembly.](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html

Note that this is a different set of metadata from CDK node metadata; this
metadata ends up in the stack template under the resource, whereas CDK
node metadata ends up in the Cloud Assembly.)

###### `key`<sup>Required</sup> <a name="key" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addMetadata.parameter.key"></a>

- *Type:* string

---

###### `value`<sup>Required</sup> <a name="value" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addMetadata.parameter.value"></a>

- *Type:* any

---

##### `addOverride` <a name="addOverride" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addOverride"></a>

```typescript
public addOverride(path: string, value: any): void
```

Adds an override to the synthesized CloudFormation resource.

To add a
property override, either use `addPropertyOverride` or prefix `path` with
"Properties." (i.e. `Properties.TopicName`).

If the override is nested, separate each nested level using a dot (.) in the path parameter.
If there is an array as part of the nesting, specify the index in the path.

To include a literal `.` in the property name, prefix with a `\`. In most
programming languages you will need to write this as `"\\."` because the
`\` itself will need to be escaped.

For example,
```typescript
cfnResource.addOverride('Properties.GlobalSecondaryIndexes.0.Projection.NonKeyAttributes', ['myattribute']);
cfnResource.addOverride('Properties.GlobalSecondaryIndexes.1.ProjectionType', 'INCLUDE');
```
would add the overrides
```json
"Properties": {
  "GlobalSecondaryIndexes": [
    {
      "Projection": {
        "NonKeyAttributes": [ "myattribute" ]
        ...
      }
      ...
    },
    {
      "ProjectionType": "INCLUDE"
      ...
    },
  ]
  ...
}
```

The `value` argument to `addOverride` will not be processed or translated
in any way. Pass raw JSON values in here with the correct capitalization
for CloudFormation. If you pass CDK classes or structs, they will be
rendered with lowercased key names, and CloudFormation will reject the
template.

###### `path`<sup>Required</sup> <a name="path" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addOverride.parameter.path"></a>

- *Type:* string

The path of the property, you can use dot notation to override values in complex types.

Any intermediate keys
will be created as needed.

---

###### `value`<sup>Required</sup> <a name="value" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addOverride.parameter.value"></a>

- *Type:* any

The value.

Could be primitive or complex.

---

##### `addPropertyDeletionOverride` <a name="addPropertyDeletionOverride" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addPropertyDeletionOverride"></a>

```typescript
public addPropertyDeletionOverride(propertyPath: string): void
```

Adds an override that deletes the value of a property from the resource definition.

###### `propertyPath`<sup>Required</sup> <a name="propertyPath" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addPropertyDeletionOverride.parameter.propertyPath"></a>

- *Type:* string

The path to the property.

---

##### `addPropertyOverride` <a name="addPropertyOverride" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addPropertyOverride"></a>

```typescript
public addPropertyOverride(propertyPath: string, value: any): void
```

Adds an override to a resource property.

Syntactic sugar for `addOverride("Properties.<...>", value)`.

###### `propertyPath`<sup>Required</sup> <a name="propertyPath" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addPropertyOverride.parameter.propertyPath"></a>

- *Type:* string

The path of the property.

---

###### `value`<sup>Required</sup> <a name="value" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.addPropertyOverride.parameter.value"></a>

- *Type:* any

The value.

---

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy?: RemovalPolicy, options?: RemovalPolicyOptions): void
```

Sets the deletion policy of the resource based on the removal policy specified.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`). In some
cases, a snapshot can be taken of the resource prior to deletion
(`RemovalPolicy.SNAPSHOT`). A list of resources that support this policy
can be found in the following link:

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options)

###### `policy`<sup>Optional</sup> <a name="policy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

###### `options`<sup>Optional</sup> <a name="options" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.applyRemovalPolicy.parameter.options"></a>

- *Type:* aws-cdk-lib.RemovalPolicyOptions

---

##### `getAtt` <a name="getAtt" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.getAtt"></a>

```typescript
public getAtt(attributeName: string, typeHint?: ResolutionTypeHint): Reference
```

Returns a token for an runtime attribute of this resource.

Ideally, use generated attribute accessors (e.g. `resource.arn`), but this can be used for future compatibility
in case there is no generated attribute.

###### `attributeName`<sup>Required</sup> <a name="attributeName" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.getAtt.parameter.attributeName"></a>

- *Type:* string

The name of the attribute.

---

###### `typeHint`<sup>Optional</sup> <a name="typeHint" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.getAtt.parameter.typeHint"></a>

- *Type:* aws-cdk-lib.ResolutionTypeHint

---

##### `getMetadata` <a name="getMetadata" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.getMetadata"></a>

```typescript
public getMetadata(key: string): any
```

Retrieve a value value from the CloudFormation Resource Metadata.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html

Note that this is a different set of metadata from CDK node metadata; this
metadata ends up in the stack template under the resource, whereas CDK
node metadata ends up in the Cloud Assembly.](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html

Note that this is a different set of metadata from CDK node metadata; this
metadata ends up in the stack template under the resource, whereas CDK
node metadata ends up in the Cloud Assembly.)

###### `key`<sup>Required</sup> <a name="key" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.getMetadata.parameter.key"></a>

- *Type:* string

---

##### `obtainDependencies` <a name="obtainDependencies" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.obtainDependencies"></a>

```typescript
public obtainDependencies(): Stack | CfnResource[]
```

Retrieves an array of resources this resource depends on.

This assembles dependencies on resources across stacks (including nested stacks)
automatically.

##### `obtainResourceDependencies` <a name="obtainResourceDependencies" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.obtainResourceDependencies"></a>

```typescript
public obtainResourceDependencies(): CfnResource[]
```

Get a shallow copy of dependencies between this resource and other resources in the same stack.

##### `removeDependency` <a name="removeDependency" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.removeDependency"></a>

```typescript
public removeDependency(target: CfnResource): void
```

Indicates that this resource no longer depends on another resource.

This can be used for resources across stacks (including nested stacks)
and the dependency will automatically be removed from the relevant scope.

###### `target`<sup>Required</sup> <a name="target" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.removeDependency.parameter.target"></a>

- *Type:* aws-cdk-lib.CfnResource

---

##### `replaceDependency` <a name="replaceDependency" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.replaceDependency"></a>

```typescript
public replaceDependency(target: CfnResource, newTarget: CfnResource): void
```

Replaces one dependency with another.

###### `target`<sup>Required</sup> <a name="target" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.replaceDependency.parameter.target"></a>

- *Type:* aws-cdk-lib.CfnResource

The dependency to replace.

---

###### `newTarget`<sup>Required</sup> <a name="newTarget" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.replaceDependency.parameter.newTarget"></a>

- *Type:* aws-cdk-lib.CfnResource

The new dependency to add.

---

##### `inspect` <a name="inspect" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.inspect"></a>

```typescript
public inspect(inspector: TreeInspector): void
```

Examines the CloudFormation resource and discloses attributes.

###### `inspector`<sup>Required</sup> <a name="inspector" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.inspect.parameter.inspector"></a>

- *Type:* aws-cdk-lib.TreeInspector

tree inspector to collect and process attributes.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.isCfnElement">isCfnElement</a></code> | Returns `true` if a construct is a stack element (i.e. part of the synthesized cloudformation template). |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.isCfnResource">isCfnResource</a></code> | Check whether the given construct is a CfnResource. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.fromOrganizationId">fromOrganizationId</a></code> | *No description.* |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.isConstruct"></a>

```typescript
import { CircleCiOidcProvider } from '@blimmer/cdk-circleci-oidc'

CircleCiOidcProvider.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isCfnElement` <a name="isCfnElement" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.isCfnElement"></a>

```typescript
import { CircleCiOidcProvider } from '@blimmer/cdk-circleci-oidc'

CircleCiOidcProvider.isCfnElement(x: any)
```

Returns `true` if a construct is a stack element (i.e. part of the synthesized cloudformation template).

Uses duck-typing instead of `instanceof` to allow stack elements from different
versions of this library to be included in the same stack.

###### `x`<sup>Required</sup> <a name="x" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.isCfnElement.parameter.x"></a>

- *Type:* any

---

##### `isCfnResource` <a name="isCfnResource" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.isCfnResource"></a>

```typescript
import { CircleCiOidcProvider } from '@blimmer/cdk-circleci-oidc'

CircleCiOidcProvider.isCfnResource(construct: IConstruct)
```

Check whether the given construct is a CfnResource.

###### `construct`<sup>Required</sup> <a name="construct" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.isCfnResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromOrganizationId` <a name="fromOrganizationId" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.fromOrganizationId"></a>

```typescript
import { CircleCiOidcProvider } from '@blimmer/cdk-circleci-oidc'

CircleCiOidcProvider.fromOrganizationId(scope: Construct, organizationId: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.fromOrganizationId.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `organizationId`<sup>Required</sup> <a name="organizationId" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.fromOrganizationId.parameter.organizationId"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.creationStack">creationStack</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.logicalId">logicalId</a></code> | <code>string</code> | The logical ID for this CloudFormation stack element. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this element is defined. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.ref">ref</a></code> | <code>string</code> | Return a string that will be resolved to a CloudFormation `{ Ref }` for this element. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.cfnOptions">cfnOptions</a></code> | <code>aws-cdk-lib.ICfnResourceOptions</code> | Options for this resource, such as condition, update policy etc. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.cfnResourceType">cfnResourceType</a></code> | <code>string</code> | AWS resource type. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.attrArn">attrArn</a></code> | <code>string</code> | Returns the Amazon Resource Name (ARN) for the specified `AWS::IAM::OIDCProvider` resource. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.tags">tags</a></code> | <code>aws-cdk-lib.TagManager</code> | A list of tags that are attached to the specified IAM OIDC provider. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.thumbprintList">thumbprintList</a></code> | <code>string[]</code> | A list of certificate thumbprints that are associated with the specified IAM OIDC provider resource object. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.clientIdList">clientIdList</a></code> | <code>string[]</code> | A list of client IDs (also known as audiences) that are associated with the specified IAM OIDC provider resource object. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.url">url</a></code> | <code>string</code> | The URL that the IAM OIDC provider resource object is associated with. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.arn">arn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.organizationId">organizationId</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `creationStack`<sup>Required</sup> <a name="creationStack" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.creationStack"></a>

```typescript
public readonly creationStack: string[];
```

- *Type:* string[]

---

##### `logicalId`<sup>Required</sup> <a name="logicalId" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.logicalId"></a>

```typescript
public readonly logicalId: string;
```

- *Type:* string

The logical ID for this CloudFormation stack element.

The logical ID of the element
is calculated from the path of the resource node in the construct tree.

To override this value, use `overrideLogicalId(newLogicalId)`.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this element is defined.

CfnElements must be defined within a stack scope (directly or indirectly).

---

##### `ref`<sup>Required</sup> <a name="ref" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.ref"></a>

```typescript
public readonly ref: string;
```

- *Type:* string

Return a string that will be resolved to a CloudFormation `{ Ref }` for this element.

If, by any chance, the intrinsic reference of a resource is not a string, you could
coerce it to an IResolvable through `Lazy.any({ produce: resource.ref })`.

---

##### `cfnOptions`<sup>Required</sup> <a name="cfnOptions" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.cfnOptions"></a>

```typescript
public readonly cfnOptions: ICfnResourceOptions;
```

- *Type:* aws-cdk-lib.ICfnResourceOptions

Options for this resource, such as condition, update policy etc.

---

##### `cfnResourceType`<sup>Required</sup> <a name="cfnResourceType" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.cfnResourceType"></a>

```typescript
public readonly cfnResourceType: string;
```

- *Type:* string

AWS resource type.

---

##### `attrArn`<sup>Required</sup> <a name="attrArn" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.attrArn"></a>

```typescript
public readonly attrArn: string;
```

- *Type:* string

Returns the Amazon Resource Name (ARN) for the specified `AWS::IAM::OIDCProvider` resource.

---

##### `tags`<sup>Required</sup> <a name="tags" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.tags"></a>

```typescript
public readonly tags: TagManager;
```

- *Type:* aws-cdk-lib.TagManager

A list of tags that are attached to the specified IAM OIDC provider.

The returned list of tags is sorted by tag key. For more information about tagging, see [Tagging IAM resources](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_tags.html) in the *IAM User Guide* .

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-tags](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-tags)

---

##### `thumbprintList`<sup>Required</sup> <a name="thumbprintList" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.thumbprintList"></a>

```typescript
public readonly thumbprintList: string[];
```

- *Type:* string[]

A list of certificate thumbprints that are associated with the specified IAM OIDC provider resource object.

For more information, see [CreateOpenIDConnectProvider](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateOpenIDConnectProvider.html) .

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-thumbprintlist](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-thumbprintlist)

---

##### `clientIdList`<sup>Optional</sup> <a name="clientIdList" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.clientIdList"></a>

```typescript
public readonly clientIdList: string[];
```

- *Type:* string[]

A list of client IDs (also known as audiences) that are associated with the specified IAM OIDC provider resource object.

For more information, see [CreateOpenIDConnectProvider](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateOpenIDConnectProvider.html) .

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-clientidlist](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-clientidlist)

---

##### `url`<sup>Optional</sup> <a name="url" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.url"></a>

```typescript
public readonly url: string;
```

- *Type:* string

The URL that the IAM OIDC provider resource object is associated with.

For more information, see [CreateOpenIDConnectProvider](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateOpenIDConnectProvider.html) .

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-url](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html#cfn-iam-oidcprovider-url)

---

##### `arn`<sup>Required</sup> <a name="arn" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.arn"></a>

```typescript
public readonly arn: string;
```

- *Type:* string

---

##### `organizationId`<sup>Required</sup> <a name="organizationId" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.organizationId"></a>

```typescript
public readonly organizationId: string;
```

- *Type:* string

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.CFN_RESOURCE_TYPE_NAME">CFN_RESOURCE_TYPE_NAME</a></code> | <code>string</code> | The CloudFormation resource type name for this resource class. |

---

##### `CFN_RESOURCE_TYPE_NAME`<sup>Required</sup> <a name="CFN_RESOURCE_TYPE_NAME" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.CFN_RESOURCE_TYPE_NAME"></a>

```typescript
public readonly CFN_RESOURCE_TYPE_NAME: string;
```

- *Type:* string

The CloudFormation resource type name for this resource class.

---

### CircleCiOidcRole <a name="CircleCiOidcRole" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole"></a>

Define an IAM Role that can be assumed by a CircleCI Job via the CircleCI OpenID Connect Identity Provider.

#### Initializers <a name="Initializers" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.Initializer"></a>

```typescript
import { CircleCiOidcRole } from '@blimmer/cdk-circleci-oidc'

new CircleCiOidcRole(scope: Construct, id: string, props: CircleCiOidcRoleProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.Initializer.parameter.props">props</a></code> | <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps">CircleCiOidcRoleProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.Initializer.parameter.props"></a>

- *Type:* <a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps">CircleCiOidcRoleProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.addManagedPolicy">addManagedPolicy</a></code> | Attaches a managed policy to this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.addToPolicy">addToPolicy</a></code> | Add to the policy of this principal. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.addToPrincipalPolicy">addToPrincipalPolicy</a></code> | Adds a permission to the role's default policy document. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.attachInlinePolicy">attachInlinePolicy</a></code> | Attaches a policy to this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.grant">grant</a></code> | Grant the actions defined in actions to the identity Principal on this resource. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.grantAssumeRole">grantAssumeRole</a></code> | Grant permissions to the given principal to assume this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.grantPassRole">grantPassRole</a></code> | Grant permissions to the given principal to pass this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.withoutPolicyUpdates">withoutPolicyUpdates</a></code> | Return a copy of this Role object whose Policies will not be updated. |

---

##### `toString` <a name="toString" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addManagedPolicy` <a name="addManagedPolicy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.addManagedPolicy"></a>

```typescript
public addManagedPolicy(policy: IManagedPolicy): void
```

Attaches a managed policy to this role.

###### `policy`<sup>Required</sup> <a name="policy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.addManagedPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy

The the managed policy to attach.

---

##### `addToPolicy` <a name="addToPolicy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.addToPolicy"></a>

```typescript
public addToPolicy(statement: PolicyStatement): boolean
```

Add to the policy of this principal.

###### `statement`<sup>Required</sup> <a name="statement" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.addToPolicy.parameter.statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

---

##### `addToPrincipalPolicy` <a name="addToPrincipalPolicy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.addToPrincipalPolicy"></a>

```typescript
public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult
```

Adds a permission to the role's default policy document.

If there is no default policy attached to this role, it will be created.

###### `statement`<sup>Required</sup> <a name="statement" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.addToPrincipalPolicy.parameter.statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

The permission statement to add to the policy document.

---

##### `attachInlinePolicy` <a name="attachInlinePolicy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.attachInlinePolicy"></a>

```typescript
public attachInlinePolicy(policy: Policy): void
```

Attaches a policy to this role.

###### `policy`<sup>Required</sup> <a name="policy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.attachInlinePolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.aws_iam.Policy

The policy to attach.

---

##### `grant` <a name="grant" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.grant"></a>

```typescript
public grant(grantee: IPrincipal, actions: string): Grant
```

Grant the actions defined in actions to the identity Principal on this resource.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.grant.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

---

###### `actions`<sup>Required</sup> <a name="actions" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.grant.parameter.actions"></a>

- *Type:* string

---

##### `grantAssumeRole` <a name="grantAssumeRole" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.grantAssumeRole"></a>

```typescript
public grantAssumeRole(identity: IPrincipal): Grant
```

Grant permissions to the given principal to assume this role.

###### `identity`<sup>Required</sup> <a name="identity" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.grantAssumeRole.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

---

##### `grantPassRole` <a name="grantPassRole" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.grantPassRole"></a>

```typescript
public grantPassRole(identity: IPrincipal): Grant
```

Grant permissions to the given principal to pass this role.

###### `identity`<sup>Required</sup> <a name="identity" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.grantPassRole.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

---

##### `withoutPolicyUpdates` <a name="withoutPolicyUpdates" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.withoutPolicyUpdates"></a>

```typescript
public withoutPolicyUpdates(options?: WithoutPolicyUpdatesOptions): IRole
```

Return a copy of this Role object whose Policies will not be updated.

Use the object returned by this method if you want this Role to be used by
a construct without it automatically updating the Role's Policies.

If you do, you are responsible for adding the correct statements to the
Role's policies yourself.

###### `options`<sup>Optional</sup> <a name="options" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.withoutPolicyUpdates.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_iam.WithoutPolicyUpdatesOptions

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.customizeRoles">customizeRoles</a></code> | Customize the creation of IAM roles within the given scope. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleArn">fromRoleArn</a></code> | Import an external role by ARN. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleName">fromRoleName</a></code> | Import an external role by name. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isRole">isRole</a></code> | Return whether the given object is a Role. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isConstruct"></a>

```typescript
import { CircleCiOidcRole } from '@blimmer/cdk-circleci-oidc'

CircleCiOidcRole.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isOwnedResource"></a>

```typescript
import { CircleCiOidcRole } from '@blimmer/cdk-circleci-oidc'

CircleCiOidcRole.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isResource"></a>

```typescript
import { CircleCiOidcRole } from '@blimmer/cdk-circleci-oidc'

CircleCiOidcRole.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `customizeRoles` <a name="customizeRoles" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.customizeRoles"></a>

```typescript
import { CircleCiOidcRole } from '@blimmer/cdk-circleci-oidc'

CircleCiOidcRole.customizeRoles(scope: Construct, options?: CustomizeRolesOptions)
```

Customize the creation of IAM roles within the given scope.

It is recommended that you **do not** use this method and instead allow
CDK to manage role creation. This should only be used
in environments where CDK applications are not allowed to created IAM roles.

This can be used to prevent the CDK application from creating roles
within the given scope and instead replace the references to the roles with
precreated role names. A report will be synthesized in the cloud assembly (i.e. cdk.out)
that will contain the list of IAM roles that would have been created along with the
IAM policy statements that the role should contain. This report can then be used
to create the IAM roles outside of CDK and then the created role names can be provided
in `usePrecreatedRoles`.

*Example*

```typescript
declare const app: App;
Role.customizeRoles(app, {
  usePrecreatedRoles: {
    'ConstructPath/To/Role': 'my-precreated-role-name',
  },
});
```


###### `scope`<sup>Required</sup> <a name="scope" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.customizeRoles.parameter.scope"></a>

- *Type:* constructs.Construct

construct scope to customize role creation.

---

###### `options`<sup>Optional</sup> <a name="options" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.customizeRoles.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_iam.CustomizeRolesOptions

options for configuring role creation.

---

##### `fromRoleArn` <a name="fromRoleArn" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleArn"></a>

```typescript
import { CircleCiOidcRole } from '@blimmer/cdk-circleci-oidc'

CircleCiOidcRole.fromRoleArn(scope: Construct, id: string, roleArn: string, options?: FromRoleArnOptions)
```

Import an external role by ARN.

If the imported Role ARN is a Token (such as a
`CfnParameter.valueAsString` or a `Fn.importValue()`) *and* the referenced
role has a `path` (like `arn:...:role/AdminRoles/Alice`), the
`roleName` property will not resolve to the correct value. Instead it
will resolve to the first path component. We unfortunately cannot express
the correct calculation of the full path name as a CloudFormation
expression. In this scenario the Role ARN should be supplied without the
`path` in order to resolve the correct role resource.

###### `scope`<sup>Required</sup> <a name="scope" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleArn.parameter.scope"></a>

- *Type:* constructs.Construct

construct scope.

---

###### `id`<sup>Required</sup> <a name="id" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleArn.parameter.id"></a>

- *Type:* string

construct id.

---

###### `roleArn`<sup>Required</sup> <a name="roleArn" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleArn.parameter.roleArn"></a>

- *Type:* string

the ARN of the role to import.

---

###### `options`<sup>Optional</sup> <a name="options" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleArn.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_iam.FromRoleArnOptions

allow customizing the behavior of the returned role.

---

##### `fromRoleName` <a name="fromRoleName" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleName"></a>

```typescript
import { CircleCiOidcRole } from '@blimmer/cdk-circleci-oidc'

CircleCiOidcRole.fromRoleName(scope: Construct, id: string, roleName: string, options?: FromRoleNameOptions)
```

Import an external role by name.

The imported role is assumed to exist in the same account as the account
the scope's containing Stack is being deployed to.

###### `scope`<sup>Required</sup> <a name="scope" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleName.parameter.scope"></a>

- *Type:* constructs.Construct

construct scope.

---

###### `id`<sup>Required</sup> <a name="id" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleName.parameter.id"></a>

- *Type:* string

construct id.

---

###### `roleName`<sup>Required</sup> <a name="roleName" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleName.parameter.roleName"></a>

- *Type:* string

the name of the role to import.

---

###### `options`<sup>Optional</sup> <a name="options" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.fromRoleName.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_iam.FromRoleNameOptions

allow customizing the behavior of the returned role.

---

##### `isRole` <a name="isRole" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isRole"></a>

```typescript
import { CircleCiOidcRole } from '@blimmer/cdk-circleci-oidc'

CircleCiOidcRole.isRole(x: any)
```

Return whether the given object is a Role.

###### `x`<sup>Required</sup> <a name="x" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isRole.parameter.x"></a>

- *Type:* any

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.assumeRoleAction">assumeRoleAction</a></code> | <code>string</code> | When this Principal is used in an AssumeRole policy, the action to use. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.grantPrincipal">grantPrincipal</a></code> | <code>aws-cdk-lib.aws_iam.IPrincipal</code> | The principal to grant permissions to. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.policyFragment">policyFragment</a></code> | <code>aws-cdk-lib.aws_iam.PrincipalPolicyFragment</code> | Returns the role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.roleArn">roleArn</a></code> | <code>string</code> | Returns the ARN of this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.roleId">roleId</a></code> | <code>string</code> | Returns the stable and unique string identifying the role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.roleName">roleName</a></code> | <code>string</code> | Returns the name of the role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.assumeRolePolicy">assumeRolePolicy</a></code> | <code>aws-cdk-lib.aws_iam.PolicyDocument</code> | The assume role policy document associated with this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.permissionsBoundary">permissionsBoundary</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy</code> | Returns the permissions boundary attached to this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.principalAccount">principalAccount</a></code> | <code>string</code> | The AWS account ID of this principal. |

---

##### `node`<sup>Required</sup> <a name="node" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `assumeRoleAction`<sup>Required</sup> <a name="assumeRoleAction" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.assumeRoleAction"></a>

```typescript
public readonly assumeRoleAction: string;
```

- *Type:* string

When this Principal is used in an AssumeRole policy, the action to use.

---

##### `grantPrincipal`<sup>Required</sup> <a name="grantPrincipal" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.grantPrincipal"></a>

```typescript
public readonly grantPrincipal: IPrincipal;
```

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

The principal to grant permissions to.

---

##### `policyFragment`<sup>Required</sup> <a name="policyFragment" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.policyFragment"></a>

```typescript
public readonly policyFragment: PrincipalPolicyFragment;
```

- *Type:* aws-cdk-lib.aws_iam.PrincipalPolicyFragment

Returns the role.

---

##### `roleArn`<sup>Required</sup> <a name="roleArn" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.roleArn"></a>

```typescript
public readonly roleArn: string;
```

- *Type:* string

Returns the ARN of this role.

---

##### `roleId`<sup>Required</sup> <a name="roleId" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.roleId"></a>

```typescript
public readonly roleId: string;
```

- *Type:* string

Returns the stable and unique string identifying the role.

For example,
AIDAJQABLZS4A3QDU576Q.

---

##### `roleName`<sup>Required</sup> <a name="roleName" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.roleName"></a>

```typescript
public readonly roleName: string;
```

- *Type:* string

Returns the name of the role.

---

##### `assumeRolePolicy`<sup>Optional</sup> <a name="assumeRolePolicy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.assumeRolePolicy"></a>

```typescript
public readonly assumeRolePolicy: PolicyDocument;
```

- *Type:* aws-cdk-lib.aws_iam.PolicyDocument

The assume role policy document associated with this role.

---

##### `permissionsBoundary`<sup>Optional</sup> <a name="permissionsBoundary" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.permissionsBoundary"></a>

```typescript
public readonly permissionsBoundary: IManagedPolicy;
```

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy

Returns the permissions boundary attached to this role.

---

##### `principalAccount`<sup>Optional</sup> <a name="principalAccount" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.principalAccount"></a>

```typescript
public readonly principalAccount: string;
```

- *Type:* string

The AWS account ID of this principal.

Can be undefined when the account is not known
(for example, for service principals).
Can be a Token - in that case,
it's assumed to be AWS::AccountId.

---


## Structs <a name="Structs" id="Structs"></a>

### CircleCiConfiguration <a name="CircleCiConfiguration" id="@blimmer/cdk-circleci-oidc.CircleCiConfiguration"></a>

#### Initializer <a name="Initializer" id="@blimmer/cdk-circleci-oidc.CircleCiConfiguration.Initializer"></a>

```typescript
import { CircleCiConfiguration } from '@blimmer/cdk-circleci-oidc'

const circleCiConfiguration: CircleCiConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiConfiguration.property.provider">provider</a></code> | <code><a href="#@blimmer/cdk-circleci-oidc.ICircleCiOidcProvider">ICircleCiOidcProvider</a></code> | Reference to CircleCI OpenID Connect Provider configured in AWS IAM. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiConfiguration.property.projectIds">projectIds</a></code> | <code>string[]</code> | Provide the UUID(s) of the CircleCI project(s) you want to be allowed to use this role. |

---

##### `provider`<sup>Required</sup> <a name="provider" id="@blimmer/cdk-circleci-oidc.CircleCiConfiguration.property.provider"></a>

```typescript
public readonly provider: ICircleCiOidcProvider;
```

- *Type:* <a href="#@blimmer/cdk-circleci-oidc.ICircleCiOidcProvider">ICircleCiOidcProvider</a>

Reference to CircleCI OpenID Connect Provider configured in AWS IAM.

Either pass an construct defined by `new CircleCiOidcProvider`
or a retrieved reference from `CircleCiOidcProvider.fromOrganizationId`.
There can be only one (per AWS Account).

---

##### `projectIds`<sup>Optional</sup> <a name="projectIds" id="@blimmer/cdk-circleci-oidc.CircleCiConfiguration.property.projectIds"></a>

```typescript
public readonly projectIds: string[];
```

- *Type:* string[]
- *Default:* All CircleCI projects in the provider's organization

Provide the UUID(s) of the CircleCI project(s) you want to be allowed to use this role.

If you don't provide this
value, the role will be allowed to be assumed by any CircleCI project in your organization. You can find a
project's ID in the CircleCI dashboard UI under the "Project Settings" tab. It's usually in a UUID format.

---

### CircleCiOidcProviderProps <a name="CircleCiOidcProviderProps" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps"></a>

#### Initializer <a name="Initializer" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.Initializer"></a>

```typescript
import { CircleCiOidcProviderProps } from '@blimmer/cdk-circleci-oidc'

const circleCiOidcProviderProps: CircleCiOidcProviderProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.organizationId">organizationId</a></code> | <code>string</code> | The ID of your CircleCI organization. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.thumbprints">thumbprints</a></code> | <code>string[]</code> | The OIDC thumbprints used by the provider. |

---

##### `organizationId`<sup>Required</sup> <a name="organizationId" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.organizationId"></a>

```typescript
public readonly organizationId: string;
```

- *Type:* string

The ID of your CircleCI organization.

This is typically in a UUID format. You can find this ID in the CircleCI
dashboard UI under the "Organization Settings" tab.

---

##### `thumbprints`<sup>Optional</sup> <a name="thumbprints" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.thumbprints"></a>

```typescript
public readonly thumbprints: string[];
```

- *Type:* string[]

The OIDC thumbprints used by the provider.

You should not need to provide this value unless CircleCI suddenly
rotates their OIDC thumbprints (e.g., in response to a security incident).

If you do need to generate this thumbprint, you can follow the instructions here:
https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html

---

### CircleCiOidcRoleProps <a name="CircleCiOidcRoleProps" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps"></a>

Props that define the IAM Role that can be assumed by a CircleCI job via the CircleCI OpenID Connect Identity Provider.

Besides {@link CircleCiConfiguration}, you may pass in any {@link RoleProps} except `assumedBy`
which will be defined by this construct.

#### Initializer <a name="Initializer" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.Initializer"></a>

```typescript
import { CircleCiOidcRoleProps } from '@blimmer/cdk-circleci-oidc'

const circleCiOidcRoleProps: CircleCiOidcRoleProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.provider">provider</a></code> | <code><a href="#@blimmer/cdk-circleci-oidc.ICircleCiOidcProvider">ICircleCiOidcProvider</a></code> | Reference to CircleCI OpenID Connect Provider configured in AWS IAM. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.projectIds">projectIds</a></code> | <code>string[]</code> | Provide the UUID(s) of the CircleCI project(s) you want to be allowed to use this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.description">description</a></code> | <code>string</code> | A description of the role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.externalIds">externalIds</a></code> | <code>string[]</code> | List of IDs that the role assumer needs to provide one of when assuming this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.inlinePolicies">inlinePolicies</a></code> | <code>{[ key: string ]: aws-cdk-lib.aws_iam.PolicyDocument}</code> | A list of named policies to inline into this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.managedPolicies">managedPolicies</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy[]</code> | A list of managed policies associated with this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.maxSessionDuration">maxSessionDuration</a></code> | <code>aws-cdk-lib.Duration</code> | The maximum session duration that you want to set for the specified role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.path">path</a></code> | <code>string</code> | The path associated with this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.permissionsBoundary">permissionsBoundary</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy</code> | AWS supports permissions boundaries for IAM entities (users or roles). |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.roleName">roleName</a></code> | <code>string</code> | A name for the IAM role. |

---

##### `provider`<sup>Required</sup> <a name="provider" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.provider"></a>

```typescript
public readonly provider: ICircleCiOidcProvider;
```

- *Type:* <a href="#@blimmer/cdk-circleci-oidc.ICircleCiOidcProvider">ICircleCiOidcProvider</a>

Reference to CircleCI OpenID Connect Provider configured in AWS IAM.

Either pass an construct defined by `new CircleCiOidcProvider`
or a retrieved reference from `CircleCiOidcProvider.fromOrganizationId`.
There can be only one (per AWS Account).

---

##### `projectIds`<sup>Optional</sup> <a name="projectIds" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.projectIds"></a>

```typescript
public readonly projectIds: string[];
```

- *Type:* string[]
- *Default:* All CircleCI projects in the provider's organization

Provide the UUID(s) of the CircleCI project(s) you want to be allowed to use this role.

If you don't provide this
value, the role will be allowed to be assumed by any CircleCI project in your organization. You can find a
project's ID in the CircleCI dashboard UI under the "Project Settings" tab. It's usually in a UUID format.

---

##### `description`<sup>Optional</sup> <a name="description" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* No description.

A description of the role.

It can be up to 1000 characters long.

---

##### `externalIds`<sup>Optional</sup> <a name="externalIds" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.externalIds"></a>

```typescript
public readonly externalIds: string[];
```

- *Type:* string[]
- *Default:* No external ID required

List of IDs that the role assumer needs to provide one of when assuming this role.

If the configured and provided external IDs do not match, the
AssumeRole operation will fail.

---

##### `inlinePolicies`<sup>Optional</sup> <a name="inlinePolicies" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.inlinePolicies"></a>

```typescript
public readonly inlinePolicies: {[ key: string ]: PolicyDocument};
```

- *Type:* {[ key: string ]: aws-cdk-lib.aws_iam.PolicyDocument}
- *Default:* No policy is inlined in the Role resource.

A list of named policies to inline into this role.

These policies will be
created with the role, whereas those added by ``addToPolicy`` are added
using a separate CloudFormation resource (allowing a way around circular
dependencies that could otherwise be introduced).

---

##### `managedPolicies`<sup>Optional</sup> <a name="managedPolicies" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.managedPolicies"></a>

```typescript
public readonly managedPolicies: IManagedPolicy[];
```

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy[]
- *Default:* No managed policies.

A list of managed policies associated with this role.

You can add managed policies later using
`addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName(policyName))`.

---

##### `maxSessionDuration`<sup>Optional</sup> <a name="maxSessionDuration" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.maxSessionDuration"></a>

```typescript
public readonly maxSessionDuration: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.hours(1)

The maximum session duration that you want to set for the specified role.

This setting can have a value from 1 hour (3600sec) to 12 (43200sec) hours.

Anyone who assumes the role from the AWS CLI or API can use the
DurationSeconds API parameter or the duration-seconds CLI parameter to
request a longer session. The MaxSessionDuration setting determines the
maximum duration that can be requested using the DurationSeconds
parameter.

If users don't specify a value for the DurationSeconds parameter, their
security credentials are valid for one hour by default. This applies when
you use the AssumeRole* API operations or the assume-role* CLI operations
but does not apply when you use those operations to create a console URL.

> [https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html)

---

##### `path`<sup>Optional</sup> <a name="path" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.path"></a>

```typescript
public readonly path: string;
```

- *Type:* string
- *Default:* /

The path associated with this role.

For information about IAM paths, see
Friendly Names and Paths in IAM User Guide.

---

##### `permissionsBoundary`<sup>Optional</sup> <a name="permissionsBoundary" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.permissionsBoundary"></a>

```typescript
public readonly permissionsBoundary: IManagedPolicy;
```

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy
- *Default:* No permissions boundary.

AWS supports permissions boundaries for IAM entities (users or roles).

A permissions boundary is an advanced feature for using a managed policy
to set the maximum permissions that an identity-based policy can grant to
an IAM entity. An entity's permissions boundary allows it to perform only
the actions that are allowed by both its identity-based policies and its
permissions boundaries.

> [https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html)

---

##### `roleName`<sup>Optional</sup> <a name="roleName" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.roleName"></a>

```typescript
public readonly roleName: string;
```

- *Type:* string
- *Default:* AWS CloudFormation generates a unique physical ID and uses that ID for the role name.

A name for the IAM role.

For valid values, see the RoleName parameter for
the CreateRole action in the IAM API Reference.

IMPORTANT: If you specify a name, you cannot perform updates that require
replacement of this resource. You can perform updates that require no or
some interruption. If you must replace the resource, specify a new name.

If you specify a name, you must specify the CAPABILITY_NAMED_IAM value to
acknowledge your template's capabilities. For more information, see
Acknowledging IAM Resources in AWS CloudFormation Templates.

---

### RoleProps <a name="RoleProps" id="@blimmer/cdk-circleci-oidc.RoleProps"></a>

RoleProps.

#### Initializer <a name="Initializer" id="@blimmer/cdk-circleci-oidc.RoleProps.Initializer"></a>

```typescript
import { RoleProps } from '@blimmer/cdk-circleci-oidc'

const roleProps: RoleProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.RoleProps.property.description">description</a></code> | <code>string</code> | A description of the role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.RoleProps.property.externalIds">externalIds</a></code> | <code>string[]</code> | List of IDs that the role assumer needs to provide one of when assuming this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.RoleProps.property.inlinePolicies">inlinePolicies</a></code> | <code>{[ key: string ]: aws-cdk-lib.aws_iam.PolicyDocument}</code> | A list of named policies to inline into this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.RoleProps.property.managedPolicies">managedPolicies</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy[]</code> | A list of managed policies associated with this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.RoleProps.property.maxSessionDuration">maxSessionDuration</a></code> | <code>aws-cdk-lib.Duration</code> | The maximum session duration that you want to set for the specified role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.RoleProps.property.path">path</a></code> | <code>string</code> | The path associated with this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.RoleProps.property.permissionsBoundary">permissionsBoundary</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy</code> | AWS supports permissions boundaries for IAM entities (users or roles). |
| <code><a href="#@blimmer/cdk-circleci-oidc.RoleProps.property.roleName">roleName</a></code> | <code>string</code> | A name for the IAM role. |

---

##### `description`<sup>Optional</sup> <a name="description" id="@blimmer/cdk-circleci-oidc.RoleProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* No description.

A description of the role.

It can be up to 1000 characters long.

---

##### `externalIds`<sup>Optional</sup> <a name="externalIds" id="@blimmer/cdk-circleci-oidc.RoleProps.property.externalIds"></a>

```typescript
public readonly externalIds: string[];
```

- *Type:* string[]
- *Default:* No external ID required

List of IDs that the role assumer needs to provide one of when assuming this role.

If the configured and provided external IDs do not match, the
AssumeRole operation will fail.

---

##### `inlinePolicies`<sup>Optional</sup> <a name="inlinePolicies" id="@blimmer/cdk-circleci-oidc.RoleProps.property.inlinePolicies"></a>

```typescript
public readonly inlinePolicies: {[ key: string ]: PolicyDocument};
```

- *Type:* {[ key: string ]: aws-cdk-lib.aws_iam.PolicyDocument}
- *Default:* No policy is inlined in the Role resource.

A list of named policies to inline into this role.

These policies will be
created with the role, whereas those added by ``addToPolicy`` are added
using a separate CloudFormation resource (allowing a way around circular
dependencies that could otherwise be introduced).

---

##### `managedPolicies`<sup>Optional</sup> <a name="managedPolicies" id="@blimmer/cdk-circleci-oidc.RoleProps.property.managedPolicies"></a>

```typescript
public readonly managedPolicies: IManagedPolicy[];
```

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy[]
- *Default:* No managed policies.

A list of managed policies associated with this role.

You can add managed policies later using
`addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName(policyName))`.

---

##### `maxSessionDuration`<sup>Optional</sup> <a name="maxSessionDuration" id="@blimmer/cdk-circleci-oidc.RoleProps.property.maxSessionDuration"></a>

```typescript
public readonly maxSessionDuration: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.hours(1)

The maximum session duration that you want to set for the specified role.

This setting can have a value from 1 hour (3600sec) to 12 (43200sec) hours.

Anyone who assumes the role from the AWS CLI or API can use the
DurationSeconds API parameter or the duration-seconds CLI parameter to
request a longer session. The MaxSessionDuration setting determines the
maximum duration that can be requested using the DurationSeconds
parameter.

If users don't specify a value for the DurationSeconds parameter, their
security credentials are valid for one hour by default. This applies when
you use the AssumeRole* API operations or the assume-role* CLI operations
but does not apply when you use those operations to create a console URL.

> [https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html)

---

##### `path`<sup>Optional</sup> <a name="path" id="@blimmer/cdk-circleci-oidc.RoleProps.property.path"></a>

```typescript
public readonly path: string;
```

- *Type:* string
- *Default:* /

The path associated with this role.

For information about IAM paths, see
Friendly Names and Paths in IAM User Guide.

---

##### `permissionsBoundary`<sup>Optional</sup> <a name="permissionsBoundary" id="@blimmer/cdk-circleci-oidc.RoleProps.property.permissionsBoundary"></a>

```typescript
public readonly permissionsBoundary: IManagedPolicy;
```

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy
- *Default:* No permissions boundary.

AWS supports permissions boundaries for IAM entities (users or roles).

A permissions boundary is an advanced feature for using a managed policy
to set the maximum permissions that an identity-based policy can grant to
an IAM entity. An entity's permissions boundary allows it to perform only
the actions that are allowed by both its identity-based policies and its
permissions boundaries.

> [https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html)

---

##### `roleName`<sup>Optional</sup> <a name="roleName" id="@blimmer/cdk-circleci-oidc.RoleProps.property.roleName"></a>

```typescript
public readonly roleName: string;
```

- *Type:* string
- *Default:* AWS CloudFormation generates a unique physical ID and uses that ID for the role name.

A name for the IAM role.

For valid values, see the RoleName parameter for
the CreateRole action in the IAM API Reference.

IMPORTANT: If you specify a name, you cannot perform updates that require
replacement of this resource. You can perform updates that require no or
some interruption. If you must replace the resource, specify a new name.

If you specify a name, you must specify the CAPABILITY_NAMED_IAM value to
acknowledge your template's capabilities. For more information, see
Acknowledging IAM Resources in AWS CloudFormation Templates.

---


## Protocols <a name="Protocols" id="Protocols"></a>

### ICircleCiOidcProvider <a name="ICircleCiOidcProvider" id="@blimmer/cdk-circleci-oidc.ICircleCiOidcProvider"></a>

- *Implemented By:* <a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider">CircleCiOidcProvider</a>, <a href="#@blimmer/cdk-circleci-oidc.ICircleCiOidcProvider">ICircleCiOidcProvider</a>

Describes a CircleCI OpenID Connect Identity Provider for AWS IAM.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.ICircleCiOidcProvider.property.arn">arn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.ICircleCiOidcProvider.property.organizationId">organizationId</a></code> | <code>string</code> | *No description.* |

---

##### `arn`<sup>Required</sup> <a name="arn" id="@blimmer/cdk-circleci-oidc.ICircleCiOidcProvider.property.arn"></a>

```typescript
public readonly arn: string;
```

- *Type:* string

---

##### `organizationId`<sup>Required</sup> <a name="organizationId" id="@blimmer/cdk-circleci-oidc.ICircleCiOidcProvider.property.organizationId"></a>

```typescript
public readonly organizationId: string;
```

- *Type:* string

---

