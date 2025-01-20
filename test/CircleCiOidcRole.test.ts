import { App, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
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
      provider,
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
                "Fn::GetAtt": ["CircleCiOidcProvider", "Arn"],
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
      provider: CircleCiOidcProvider.fromOrganizationId(stack, "1234"),
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
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      Ref: "AWS::Partition",
                    },
                    ":iam::",
                    {
                      Ref: "AWS::AccountId",
                    },
                    ":oidc-provider/oidc.circleci.com/org/1234",
                  ],
                ],
              },
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
      provider: provider,
      projectIds: ["1234", "5678"],
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

  it("passes through other RoleProps", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    const provider = new CircleCiOidcProvider(stack, "CircleCiOidcProvider", {
      organizationId: "1234",
    });
    new CircleCiOidcRole(stack, "CircleCiOidcRole", {
      provider,
      roleName: "MyRole",
      description: "My Role",
    });

    Template.fromStack(stack).hasResourceProperties("AWS::IAM::Role", {
      RoleName: "MyRole",
      Description: "My Role",
    });
  });

  it("allows adding to the role", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    const provider = new CircleCiOidcProvider(stack, "CircleCiOidcProvider", {
      organizationId: "1234",
    });
    const role = new CircleCiOidcRole(stack, "CircleCiOidcRole", {
      provider,
    });

    const queue = new Queue(stack, "Queue");
    queue.grantConsumeMessages(role);

    Template.fromStack(stack).hasResourceProperties("AWS::IAM::Policy", {
      // Attached to the role
      Roles: [
        {
          Ref: "CircleCiOidcRoleC059EF20",
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
