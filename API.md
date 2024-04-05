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
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.getProviderForExport">getProviderForExport</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `getProviderForExport` <a name="getProviderForExport" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.getProviderForExport"></a>

```typescript
public getProviderForExport(accountId: string, importName?: string): ManualCircleCiOidcProviderProps
```

###### `accountId`<sup>Required</sup> <a name="accountId" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.getProviderForExport.parameter.accountId"></a>

- *Type:* string

---

###### `importName`<sup>Optional</sup> <a name="importName" id="@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.getProviderForExport.parameter.importName"></a>

- *Type:* string

---

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
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider.property.provider">provider</a></code> | <code>aws-cdk-lib.aws_iam.CfnOIDCProvider</code> | *No description.* |

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
public readonly provider: CfnOIDCProvider;
```

- *Type:* aws-cdk-lib.aws_iam.CfnOIDCProvider

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
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.circleCiOidcProvider">circleCiOidcProvider</a></code> | <code><a href="#@blimmer/cdk-circleci-oidc.ManualCircleCiOidcProviderProps">ManualCircleCiOidcProviderProps</a> \| <a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider">CircleCiOidcProvider</a></code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.circleCiProjectIds">circleCiProjectIds</a></code> | <code>string[]</code> | Provide the UUID(s) of the CircleCI project(s) you want to be allowed to use this role. |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.inlinePolicies">inlinePolicies</a></code> | <code>{[ key: string ]: aws-cdk-lib.aws_iam.PolicyDocument}</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.managedPolicies">managedPolicies</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy[]</code> | *No description.* |
| <code><a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.roleName">roleName</a></code> | <code>string</code> | You can pass an explicit role name if you'd like, since you need to reference the Role ARN within your CircleCI configuration. |

---

##### `circleCiOidcProvider`<sup>Required</sup> <a name="circleCiOidcProvider" id="@blimmer/cdk-circleci-oidc.CircleCiOidcRoleProps.property.circleCiOidcProvider"></a>

```typescript
public readonly circleCiOidcProvider: ManualCircleCiOidcProviderProps | CircleCiOidcProvider;
```

- *Type:* <a href="#@blimmer/cdk-circleci-oidc.ManualCircleCiOidcProviderProps">ManualCircleCiOidcProviderProps</a> | <a href="#@blimmer/cdk-circleci-oidc.CircleCiOidcProvider">CircleCiOidcProvider</a>

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



