# CircleCI OIDC

This repository contains constructs to communicate between CircleCI and AWS via an Open ID Connect (OIDC) provider.
The process is described in [this CircleCI blog post](https://circleci.com/blog/openid-connect-identity-tokens/).

## Security Benefits

By using the OpenID Connect provider, you can communicate with AWS from CircleCI without saving static credentials
(e.g., `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) in your CircleCI project settings or a context. Removing
static credentials, especially in light of the early 2023 [breach](https://circleci.com/blog/jan-4-2023-incident-report/),
is a best practice for security.

## Quick Start

Install the package:

```bash
npm install @blimmer/cdk-circleci-oidc

or

yarn add @blimmer/cdk-circleci-oidc
```

Then, create the provider and role(s).

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import { CircleCiOidcProvider, CircleCiOidcRole } from '@blimmer/cdk-circleci-oidc';
import { Construct } from 'constructs';
import { ManagedPolicy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class CircleCiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const provider = new CircleCiOidcProvider(this, 'OidcProvider', {
      // Find your organization ID in the CircleCI dashboard under "Organization Settings"
      organizationId: '11111111-2222-3333-4444-555555555555',
    });

    const myCircleCiRole = new CircleCiOidcRole(this, 'MyCircleCiRole', {
      circleCiOidcProvider: provider,
      roleName: "MyCircleCiRole",

      // Pass some managed policies to the role
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
      ],
    })

    // You can also access the role from the construct. This allows adding roles and using `grant` methods after the
    // construct has been created.
    myCircleCiRole.role.addToPolicy(new PolicyStatement({
      actions: ['s3:ListAllMyBuckets'],
      resources: ['*'],
    }));

    const bucket = new Bucket(this, 'MyBucket');
    bucket.grantRead(myCircleCiRole.role);
  }
}
```

Now, in your `.circleci/config.yml` file, you can use the [AWS CLI Orb](https://circleci.com/developer/orbs/orb/circleci/aws-cli)
to assume your new role.

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
          role_arn: 'arn:aws:iam::123456789101:role/MyCircleCiRole'
      - run:
          name: List S3 Buckets
          command: aws s3 ls
```

## Cross Stack Usage

If you want to use the OIDC provider in another stack, you can use the `getProviderForExport` method.

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import { CircleCiOidcProvider } from '@blimmer/cdk-circleci-oidc';
import { Construct } from 'constructs';

export class CircleCiStack extends Stack {
  readonly circleCiOidcProvider: ManualCircleCiOidcProviderProps; // export for use in other stacks

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const provider = new CircleCiOidcProvider(this, 'OidcProvider', {
      // Find your organization ID in the CircleCI dashboard under "Organization Settings"
      organizationId: '11111111-2222-3333-4444-555555555555',
    });

    this.circleCiOidcProvider = provider.getProviderForExport(this.account);
  }
}
```

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import { CircleCiOidcRole } from '@blimmer/cdk-circleci-oidc';
import { Construct } from 'constructs';
import type { CircleCiStack } from './CircleCiStack';

interface ConsumingStackProps {
  circleci: CircleCi;
}

export class ConsumingStack extends Stack {
  constructor(scope: Construct, id: string, props: ConsumingStackProps) {
    super(scope, id, props);
    const { circleCiOidcProvider } = props.circleci;

    const myCircleCiRole = new CircleCiOidcRole(this, 'MyCircleCiRole', {
      circleCiOidcProvider,
      roleName: "MyCircleCiRole",
    })
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

## Contributing

Contributions, issues, and feedback are welcome!

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### CircleCiOidcProvider <a name="CircleCiOidcProvider" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider"></a>

This construct creates a CircleCI ODIC provider to allow AWS access from CircleCI jobs.

You'll need to instantiate
this construct once per AWS account you want to use CircleCI OIDC with.

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

This construct creates a CircleCI ODIC provider to allow AWS access from CircleCI jobs.

You'll need to instantiate
this construct once per AWS account you want to use CircleCI OIDC with.

To create a role that can be assumed by CircleCI jobs, use the `CircleCiOidcRole` construct.

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

---

##### `toString` <a name="toString" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

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

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.Role</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `role`<sup>Required</sup> <a name="role" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRole.property.role"></a>

```typescript
public readonly role: Role;
```

- *Type:* aws-cdk-lib.aws_iam.Role

---


## Structs <a name="Structs" id="Structs"></a>

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
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.circleCiOidcThumbprints">circleCiOidcThumbprints</a></code> | <code>string[]</code> | The OIDC thumbprints used by the provider. |

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

##### `circleCiOidcThumbprints`<sup>Optional</sup> <a name="circleCiOidcThumbprints" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.circleCiOidcThumbprints"></a>

```typescript
public readonly circleCiOidcThumbprints: string[];
```

- *Type:* string[]

The OIDC thumbprints used by the provider.

You should not need to provide this value unless CircleCI suddenly
rotates their OIDC thumbprints (e.g., in response to a security incident).

If you do need to generate this thumbprint, you can follow the instructions here:
https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html

---

### CircleCiOidcRoleProps <a name="CircleCiOidcRoleProps" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps"></a>

#### Initializer <a name="Initializer" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.Initializer"></a>

```typescript
import { CircleCiOidcRoleProps } from '@blimmer/cdk-circleci-oidc'

const circleCiOidcRoleProps: CircleCiOidcRoleProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.circleCiOidcProvider">circleCiOidcProvider</a></code> | <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider">CircleCiOidcProvider</a> \| <a href="#@blimmer/cdk-circleci-oidc.ManualCircleCiOidcProviderProps">ManualCircleCiOidcProviderProps</a></code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.circleCiProjectIds">circleCiProjectIds</a></code> | <code>string[]</code> | Provide the UUID(s) of the CircleCI project(s) you want to be allowed to use this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.inlinePolicies">inlinePolicies</a></code> | <code>{[ key: string ]: aws-cdk-lib.aws_iam.PolicyDocument}</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.managedPolicies">managedPolicies</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy[]</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.roleName">roleName</a></code> | <code>string</code> | You can pass an explicit role name if you'd like, since you need to reference the Role ARN within your CircleCI configuration. |

---

##### `circleCiOidcProvider`<sup>Required</sup> <a name="circleCiOidcProvider" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.circleCiOidcProvider"></a>

```typescript
public readonly circleCiOidcProvider: CircleCiOidcProvider | ManualCircleCiOidcProviderProps;
```

- *Type:* <a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider">CircleCiOidcProvider</a> | <a href="#@blimmer/cdk-circleci-oidc.ManualCircleCiOidcProviderProps">ManualCircleCiOidcProviderProps</a>

---

##### `circleCiProjectIds`<sup>Optional</sup> <a name="circleCiProjectIds" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.circleCiProjectIds"></a>

```typescript
public readonly circleCiProjectIds: string[];
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

---

##### `inlinePolicies`<sup>Optional</sup> <a name="inlinePolicies" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.inlinePolicies"></a>

```typescript
public readonly inlinePolicies: {[ key: string ]: PolicyDocument};
```

- *Type:* {[ key: string ]: aws-cdk-lib.aws_iam.PolicyDocument}

---

##### `managedPolicies`<sup>Optional</sup> <a name="managedPolicies" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.managedPolicies"></a>

```typescript
public readonly managedPolicies: IManagedPolicy[];
```

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy[]

---

##### `roleName`<sup>Optional</sup> <a name="roleName" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.roleName"></a>

```typescript
public readonly roleName: string;
```

- *Type:* string
- *Default:* CloudFormation will auto-generate you a role name

You can pass an explicit role name if you'd like, since you need to reference the Role ARN within your CircleCI configuration.

---

### ManualCircleCiOidcProviderProps <a name="ManualCircleCiOidcProviderProps" id="@blimmer/cdk-circleci-oidc.ManualCircleCiOidcProviderProps"></a>

If you're using the {@link CircleCiOidcProvider} construct, pass it instead of these manually-defined props.

#### Initializer <a name="Initializer" id="@blimmer/cdk-circleci-oidc.ManualCircleCiOidcProviderProps.Initializer"></a>

```typescript
import { ManualCircleCiOidcProviderProps } from '@blimmer/cdk-circleci-oidc'

const manualCircleCiOidcProviderProps: ManualCircleCiOidcProviderProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.ManualCircleCiOidcProviderProps.property.organizationId">organizationId</a></code> | <code>string</code> | The ID of your CircleCI organization. |
| <code><a href="#@blimmer/cdk-circleci-oidc.ManualCircleCiOidcProviderProps.property.provider">provider</a></code> | <code>aws-cdk-lib.aws_iam.IOpenIdConnectProvider</code> | The CircleCI OIDC provider. |

---

##### `organizationId`<sup>Required</sup> <a name="organizationId" id="@blimmer/cdk-circleci-oidc.ManualCircleCiOidcProviderProps.property.organizationId"></a>

```typescript
public readonly organizationId: string;
```

- *Type:* string

The ID of your CircleCI organization.

This is typically in a UUID format. You can find this ID in the CircleCI
dashboard UI under the "Organization Settings" tab.

---

##### `provider`<sup>Required</sup> <a name="provider" id="@blimmer/cdk-circleci-oidc.ManualCircleCiOidcProviderProps.property.provider"></a>

```typescript
public readonly provider: IOpenIdConnectProvider;
```

- *Type:* aws-cdk-lib.aws_iam.IOpenIdConnectProvider

The CircleCI OIDC provider.

You can either manually create it or import it.

---



