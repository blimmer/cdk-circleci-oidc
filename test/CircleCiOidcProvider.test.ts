import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CircleCiOidcProvider } from "../src";

describe("CircleCiOidcProvider", () => {
  it("creates the proper URL", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    new CircleCiOidcProvider(stack, "CircleCiOidcProvider", {
      organizationId: "1234",
    });

    Template.fromStack(stack).hasResourceProperties("AWS::IAM::OIDCProvider", {
      Url: "https://oidc.circleci.com/org/1234",
    });
  });
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
});
