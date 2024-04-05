# Upgrading

## From 0.x to 1.0

The API underwent breaking changes between the 0.x and 1.x lines. The API changes make it easier to use the library by
_extending_ familiar constructs instead of creating new `Constructs` you have to learn.

### `CircleCiOidcProvider`

`CircleCiOidcProvider` now _extends_ `CfnOIDCProvider`. So, you might see changes like this in your CDK diff when
upgrading:

```shell
Resources
[-] AWS::IAM::OIDCProvider CircleCiOidcProvider/CircleCiOidcProvider CircleCiOidcProviderBE49A2E7 destroy
[+] AWS::IAM::OIDCProvider CircleCiOidcProvider CircleCiOidcProvider
```

This diff means that the provider will be recreated because of the incompatible changes. You have two options to fix
this.

1. Remove the old `CircleCiOidcProvider`, `cdk deploy`, re-add the `CircleCiOidcProvider`, and `cdk deploy` again.
1. If it would be disruptive to recreate the provider, you can use the `.overrideLogicalId` property to keep the old
   logical ID and prevent the destroy. Grab the old logical ID (e.g., `CircleCiOidcProviderBE49A2E7` from the example
   above) and use it like this:

   ```typescript
   const provider = new CircleCiOidcProvider(this, "CircleCiOidcProvider", {
     organizationId: "123e4567-e89b-12d3-a456-426614174000",
   });
   provider.overrideLogicalId("CircleCiOidcProviderBE49A2E7"); // This will prevent the old provider from being destroyed
   ```
