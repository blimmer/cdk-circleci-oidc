# Upgrading

## 0.x to 1.x

The API underwent breaking changes between the 0.x and 1.x releases.

### Minimum CDK Version

This construct is only tested with CDK 2.73.0 and later. You should upgrade to at least this version before upgrading to
1.x.

### Simpler Import of Existing Providers

Previously, using an existing `CircleCiOidcProvider` was confusing and complicated. Now, you can very easily import an
existing provider (e.g., one that's created in another stack or repo) by using the
`CircleCiOidcProvider.fromOrganizationId` static method.

Before:

```typescript
const provider: ManualCircleCiOidcProviderProps = {
  provider: OpenIdConnectProvider.fromOpenIdConnectProviderArn(
    this,
    "CircleCiOidcProviderImport",
    "arn:aws:iam::12345678910:oidc-provider/oidc.circleci.com/org/123e4567-e89b-12d3-a456-426614174000",
  ),
  organizationId: "123e4567-e89b-12d3-a456-426614174000",
};

const role = new CircleCiOidcRole(this, "CircleCiOidcRole", {
  circleCiOidcProvider: provider,
});
```

After:

```typescript
const provider = CircleCiOidcProvider.fromOrganizationId(this, "123e4567-e89b-12d3-a456-426614174000");
const role = new CircleCiOidcRole(this, "CircleCiOidcRole", {
  provider,
});
```

Much better!

### Constructor Property Changes

#### `CircleCiOidcProvider`

The property `circleCiOidcThumbprints` has been renamed to `thumbprints` for brevity.

#### `CircleCiOidcRole`

The properties `circleCiOidcProvider` and `circleCiProjectIds` have been renamed to `provider` and `projectIds` for
brevity.

Before:

```typescript
const role = new CircleCiOidcRole(this, "CircleCiOidcRole", {
  circleCiOidcProvider: provider,
  circleCiProjectIds: ["b4f04e57-c8b2-4d80-9526-dc9b1b7a63ad"],
});
```

After:

```typescript
const role = new CircleCiOidcRole(this, "CircleCiOidcRole", {
  provider,
  projectIds: ["b4f04e57-c8b2-4d80-9526-dc9b1b7a63ad"],
});
```

### Removal of Outer Constructs

`CircleCiOidcProvider` and `CircleCiOidcRole` now _extend_ `CfnOIDCProvider` and `Role`, respectively. This makes them
simpler to work with and more idiomatic to the CDK.

Before:

```typescript
const role = new CircleCiOidcRole(this, "CircleCiOidcRole", {
  circleCiOidcProvider: provider,
  circleCiProjectIds: ["b4f04e57-c8b2-4d80-9526-dc9b1b7a63ad"],
});

// It was annoying to have to access role.role to add permissions
role.role.addToPolicy(
  new PolicyStatement({
    actions: ["s3:GetObject"],
    resources: ["arn:aws:s3:::my-bucket/*"],
  }),
);
bucket.grantRead(role.role);
```

After:

```typescript
const role = new CircleCiOidcRole(this, "CircleCiOidcRole", {
  provider,
  projectIds: ["b4f04e57-c8b2-4d80-9526-dc9b1b7a63ad"],
});

// Now the `CircleCiOidcRole` is a `Role` and you can add permissions directly
role.addToPolicy(
  new PolicyStatement({
    actions: ["s3:GetObject"],
    resources: ["arn:aws:s3:::my-bucket/*"],
  }),
);
```

### `cdk diff` Caused by Internal Refactoring

Because of the [removal of outer constructs](#removal-of-outer-constructs), you might see changes like this in your CDK
diff when upgrading:

```shell
Resources
[-] AWS::IAM::OIDCProvider CircleCiOidcProvider/CircleCiOidcProvider CircleCiOidcProviderBE49A2E7 destroy
[-] AWS::IAM::Role CircleCiOidcRole/CircleCiOidcRole CircleCiOidcRoleDC0C8DDB destroy
[+] AWS::IAM::OIDCProvider CircleCiOidcProvider CircleCiOidcProvider
[+] AWS::IAM::Role CircleCiOidcRole CircleCiOidcRoleC059EF20
```

If applied, this diff will destroy the old `CircleCiOidcProvider` and `CircleCiOidcRole` and create new ones. You have
two options to deal with this internal refactoring.

1. Destroy and recreate the affected providers and roles.
2. Prevent the destroy by overriding the logical ID of the new providers and roles.

#### Destroy and Recreate

This is the "cleanest" option because your CDK code won't contain overrides to work around the internal refactoring.
However, you'll likely have to issue two separate `cdk deploy` commands to destroy, then recreate the resources.

1. Delete the old resource from your stack and run a `cdk deploy`. This will destroy the old resource.
1. Add the new resource to your stack and run a `cdk deploy`. This will create the new resource. Note that if you're not
   passing the `roleName` property, you will likely get a new role name generated by CloudFormation.

NOTE: If you didn't specify an explicit `roleName` when creating the `CircleCiOidcRole`, you don't need to trigger two
deploys. The role name will be generated by CloudFormation and will be different from the old role name, so the new role
will be created, then the old one will be destroyed. You _must_ trigger two deploys with the `CircleCiOidcProvider`
because the name is static.

#### Prevent Destroy by Overriding Logical ID

If it would be disruptive to recreate your `CircleCiOidcProvider` or `CircleCiOidcRole`s, you can use the
`.overrideLogicalId` property to keep the old logical ID and prevent the destroy.

1. Run a `cdk diff` on your stack to see the logical IDs of the old resources that would be destroyed. You'll see output
   like this:

   ```shell
   Resources
   [-] AWS::IAM::OIDCProvider CircleCiOidcProvider/CircleCiOidcProvider CircleCiOidcProviderBE49A2E7 destroy
   [-] AWS::IAM::Role CircleCiOidcRole/CircleCiOidcRole CircleCiOidcRoleDC0C8DDB destroy
   [+] AWS::IAM::OIDCProvider CircleCiOidcProvider CircleCiOidcProvider
   [+] AWS::IAM::Role CircleCiOidcRole CircleCiOidcRoleC059EF20
   ```

1. Grab the old logical IDs and use them to override the logical IDs of the new resources. For example:

   ```typescript
   const provider = new CircleCiOidcProvider(this, "CircleCiOidcProvider", {
     organizationId: "123e4567-e89b-12d3-a456-426614174000",
   });
   provider.overrideLogicalId("CircleCiOidcProviderBE49A2E7");

   const role = new CircleCiOidcRole(this, "CircleCiOidcRole", {
     provider: provider,
   });
   (role.node.defaultChild as unknown as CfnResource).overrideLogicalId("CircleCiOidcRoleDC0C8DDB");
   ```

   By specifying the old logical IDs, you prevent the destroy of the old resources while still using the new underlying
   constructs.

1. Validate that the resources will not be destroyed by running another `cdk diff`. You should see that the old
   resources are no longer marked for destruction.

   ```shell
   There were no differences
   ```
