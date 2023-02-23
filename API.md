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

---

##### `toString` <a name="toString" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

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

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.organizationId">organizationId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.provider">provider</a></code> | <code>aws-cdk-lib.aws_iam.OpenIdConnectProvider</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `organizationId`<sup>Required</sup> <a name="organizationId" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.organizationId"></a>

```typescript
public readonly organizationId: string;
```

- *Type:* string

---

##### `provider`<sup>Required</sup> <a name="provider" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.provider"></a>

```typescript
public readonly provider: OpenIdConnectProvider;
```

- *Type:* aws-cdk-lib.aws_iam.OpenIdConnectProvider

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
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.url">url</a></code> | <code>string</code> | The URL of the identity provider. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.clientIds">clientIds</a></code> | <code>string[]</code> | A list of client IDs (also known as audiences). |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.thumbprints">thumbprints</a></code> | <code>string[]</code> | A list of server certificate thumbprints for the OpenID Connect (OIDC) identity provider's server certificates. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.organizationId">organizationId</a></code> | <code>string</code> | The ID of your CircleCI organization. |

---

##### `url`<sup>Required</sup> <a name="url" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.url"></a>

```typescript
public readonly url: string;
```

- *Type:* string

The URL of the identity provider.

The URL must begin with https:// and
should correspond to the iss claim in the provider's OpenID Connect ID
tokens. Per the OIDC standard, path components are allowed but query
parameters are not. Typically the URL consists of only a hostname, like
https://server.example.org or https://example.com.

You cannot register the same provider multiple times in a single AWS
account. If you try to submit a URL that has already been used for an
OpenID Connect provider in the AWS account, you will get an error.

---

##### `clientIds`<sup>Optional</sup> <a name="clientIds" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.clientIds"></a>

```typescript
public readonly clientIds: string[];
```

- *Type:* string[]
- *Default:* no clients are allowed

A list of client IDs (also known as audiences).

When a mobile or web app
registers with an OpenID Connect provider, they establish a value that
identifies the application. (This is the value that's sent as the client_id
parameter on OAuth requests.)

You can register multiple client IDs with the same provider. For example,
you might have multiple applications that use the same OIDC provider. You
cannot register more than 100 client IDs with a single IAM OIDC provider.

Client IDs are up to 255 characters long.

---

##### `thumbprints`<sup>Optional</sup> <a name="thumbprints" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProviderProps.property.thumbprints"></a>

```typescript
public readonly thumbprints: string[];
```

- *Type:* string[]
- *Default:* If no thumbprints are specified (an empty array or `undefined`), the thumbprint of the root certificate authority will be obtained from the provider's server as described in https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html

A list of server certificate thumbprints for the OpenID Connect (OIDC) identity provider's server certificates.

Typically this list includes only one entry. However, IAM lets you have up
to five thumbprints for an OIDC provider. This lets you maintain multiple
thumbprints if the identity provider is rotating certificates.

The server certificate thumbprint is the hex-encoded SHA-1 hash value of
the X.509 certificate used by the domain where the OpenID Connect provider
makes its keys available. It is always a 40-character string.

You must provide at least one thumbprint when creating an IAM OIDC
provider. For example, assume that the OIDC provider is server.example.com
and the provider stores its keys at
https://keys.server.example.com/openid-connect. In that case, the
thumbprint string would be the hex-encoded SHA-1 hash value of the
certificate used by https://keys.server.example.com.

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

### CircleCiOidcRoleProps <a name="CircleCiOidcRoleProps" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps"></a>

#### Initializer <a name="Initializer" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.Initializer"></a>

```typescript
import { CircleCiOidcRoleProps } from '@blimmer/cdk-circleci-oidc'

const circleCiOidcRoleProps: CircleCiOidcRoleProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.assumedBy">assumedBy</a></code> | <code>aws-cdk-lib.aws_iam.IPrincipal</code> | The IAM principal (i.e. `new ServicePrincipal('sns.amazonaws.com')`) which can assume this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.description">description</a></code> | <code>string</code> | A description of the role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.externalIds">externalIds</a></code> | <code>string[]</code> | List of IDs that the role assumer needs to provide one of when assuming this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.inlinePolicies">inlinePolicies</a></code> | <code>{[ key: string ]: aws-cdk-lib.aws_iam.PolicyDocument}</code> | A list of named policies to inline into this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.managedPolicies">managedPolicies</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy[]</code> | A list of managed policies associated with this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.maxSessionDuration">maxSessionDuration</a></code> | <code>aws-cdk-lib.Duration</code> | The maximum session duration that you want to set for the specified role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.path">path</a></code> | <code>string</code> | The path associated with this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.permissionsBoundary">permissionsBoundary</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy</code> | AWS supports permissions boundaries for IAM entities (users or roles). |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.roleName">roleName</a></code> | <code>string</code> | A name for the IAM role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.circleCiOidcProvider">circleCiOidcProvider</a></code> | <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider">CircleCiOidcProvider</a> \| <a href="#@blimmer/cdk-circleci-oidc.ManualCircleCiOidcProviderProps">ManualCircleCiOidcProviderProps</a></code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.circleCiProjectIds">circleCiProjectIds</a></code> | <code>string[]</code> | Provide the UUID(s) of the CircleCI project(s) you want to be allowed to use this role. |

---

##### `assumedBy`<sup>Required</sup> <a name="assumedBy" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.assumedBy"></a>

```typescript
public readonly assumedBy: IPrincipal;
```

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

The IAM principal (i.e. `new ServicePrincipal('sns.amazonaws.com')`) which can assume this role.

You can later modify the assume role policy document by accessing it via
the `assumeRolePolicy` property.

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



