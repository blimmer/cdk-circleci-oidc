import { App, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { OpenIdConnectProvider } from "aws-cdk-lib/aws-iam";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { CircleCiOidcProvider, CircleCiOidcRole } from "../src";

describe("CircleCiOidcRole", () => {
  it("uses the organization ID and arn from the CircleCiOidcProvider construct", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    const provider = new CircleCiOidcProvider(stack, "CircleCiOidcProvider", {
      organizationId: "1234",
    });
    new CircleCiOidcRole(stack, "CircleCiOidcRole", {
      circleCiOidcProvider: provider,
    });

    Template.fromStack(stack).hasResourceProperties("AWS::IAM::Role", {
      AssumeRolePolicyDocument: {
        Statement: [
          Match.objectLike({
            Effect: "Allow",
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                "oidc.circleci.com/org/1234:aud": "1234",
              },
            },
            Principal: {
              Federated: {
                "Fn::GetAtt": ["CircleCiOidcProviderBE49A2E7", "Arn"],
              },
            },
          }),
        ],
      },
    });
  });

  it("allows passing a provider arn and organization id", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    new CircleCiOidcRole(stack, "CircleCiOidcRole", {
      circleCiOidcProvider: {
        provider: OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          stack,
          "ImportProvider",
          "arn:aws:iam::12345678910:oidc-provider/circleci",
        ),
        organizationId: "1234",
      },
    });

    Template.fromStack(stack).hasResourceProperties("AWS::IAM::Role", {
      AssumeRolePolicyDocument: {
        Statement: [
          Match.objectLike({
            Effect: "Allow",
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                "oidc.circleci.com/org/1234:aud": "1234",
              },
            },
            Principal: {
              Federated: "arn:aws:iam::12345678910:oidc-provider/circleci",
            },
          }),
        ],
      },
    });
  });

  it("allows limiting the role to specific CircleCI projects", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    const provider = new CircleCiOidcProvider(stack, "CircleCiOidcProvider", {
      organizationId: "1234",
    });
    new CircleCiOidcRole(stack, "CircleCiOidcRole", {
      circleCiOidcProvider: provider,
      circleCiProjectIds: ["1234", "5678"],
    });

    Template.fromStack(stack).hasResourceProperties("AWS::IAM::Role", {
      AssumeRolePolicyDocument: {
        Statement: [
          Match.objectLike({
            Effect: "Allow",
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                "oidc.circleci.com/org/1234:aud": "1234",
              },
              StringLike: {
                "oidc.circleci.com/org/1234:sub": ["org/1234/project/1234/*", "org/1234/project/5678/*"],
              },
            },
          }),
        ],
      },
    });
  });

  it("allows adding to the role", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    const provider = new CircleCiOidcProvider(stack, "CircleCiOidcProvider", {
      organizationId: "1234",
    });
    const { role } = new CircleCiOidcRole(stack, "CircleCiOidcRole", {
      circleCiOidcProvider: provider,
    });

    const queue = new Queue(stack, "Queue");
    queue.grantConsumeMessages(role);

    Template.fromStack(stack).hasResourceProperties("AWS::IAM::Policy", {
      // Attached to the role
      Roles: [
        {
          Ref: "CircleCiOidcRoleDC0C8DDB",
        },
      ],
      PolicyDocument: {
        Statement: [
          // Granted access to the queue
          {
            Effect: "Allow",
            Action: [
              "sqs:ReceiveMessage",
              "sqs:ChangeMessageVisibility",
              "sqs:GetQueueUrl",
              "sqs:DeleteMessage",
              "sqs:GetQueueAttributes",
            ],
            Resource: {
              "Fn::GetAtt": ["Queue4A7E3555", "Arn"],
            },
          },
        ],
      },
    });
  });
});
