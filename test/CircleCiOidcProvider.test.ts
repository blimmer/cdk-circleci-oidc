import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CircleCiOidcProvider } from "../src";

describe("CircleCiOidcProvider", () => {
  it("uses the organization ID as the client ID", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    new CircleCiOidcProvider(stack, "CircleCiOidcProvider", {
      organizationId: "1234",
    });

    Template.fromStack(stack).hasResourceProperties("AWS::IAM::OIDCProvider", {
      ClientIdList: ["1234"],
    });
  });
  it("uses a default thumbprint list", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    new CircleCiOidcProvider(stack, "CircleCiOidcProvider", {
      organizationId: "1234",
    });

    Template.fromStack(stack).hasResourceProperties("AWS::IAM::OIDCProvider", {
      ThumbprintList: ["9e99a48a9960b14926bb7f3b02e22da2b0ab7280"],
    });
  });

  it("can export a provider for use in other stacks", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    const provider = new CircleCiOidcProvider(stack, "CircleCiOidcProvider", {
      organizationId: "1234",
    });

    const accountId = "123456789012";
    const providerForExport = provider.getProviderForExport(accountId);

    expect(providerForExport.organizationId).toEqual("1234");
    expect(providerForExport.provider.openIdConnectProviderArn).toEqual(
      "arn:aws:iam::123456789012:oidc-provider/oidc.circleci.com/org/1234",
    );
    expect(providerForExport.provider.openIdConnectProviderIssuer).toEqual(
      "oidc.circleci.com/org/1234",
    );
  });
});
