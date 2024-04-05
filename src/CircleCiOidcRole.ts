import { OpenIdConnectPrincipal, OpenIdConnectProvider, Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { type ICircleCiOidcProvider } from "./CircleCiOidcProvider";
import type { RoleProps } from "./generated/IamRoleProps";

export interface CircleCiConfiguration {
  /**
   * Reference to CircleCI OpenID Connect Provider configured in AWS IAM.
   *
   * Either pass an construct defined by `new CircleCiOidcProvider`
   * or a retrieved reference from `CircleCiOidcProvider.fromOrganizationId`.
   * There can be only one (per AWS Account).
   */
  readonly provider: ICircleCiOidcProvider;

  /**
   * Provide the UUID(s) of the CircleCI project(s) you want to be allowed to use this role. If you don't provide this
   * value, the role will be allowed to be assumed by any CircleCI project in your organization. You can find a
   * project's ID in the CircleCI dashboard UI under the "Project Settings" tab. It's usually in a UUID format.
   *
   * @default - All CircleCI projects in the provider's organization
   */
  readonly projectIds?: string[];
}

export interface CircleCiOidcRoleProps extends CircleCiConfiguration, RoleProps {}

/**
 * This construct creates a CircleCI ODIC provider to allow AWS access from CircleCI jobs. You'll need to instantiate
 * this construct once per AWS account you want to use CircleCI OIDC with.
 *
 * To create a role that can be assumed by CircleCI jobs, use the `CircleCiOidcRole` construct.
 */
export class CircleCiOidcRole extends Role {
  constructor(scope: Construct, id: string, props: CircleCiOidcRoleProps) {
    super(scope, id, {
      assumedBy: new OpenIdConnectPrincipal(
        // We use the CfnOIDCProvider instead of the OpenIdConnectProvider since it's overly complex
        // See https://github.com/aws/aws-cdk/issues/21197
        // However, the OpenIdConnectPrincipal still expects the L2 OpenIdConnectProvider, so we "import" it here to
        // make TypeScript happy with the types.
        OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          scope,
          `CircleCiOidcProviderImport${id}`,
          props.provider.arn,
        ),
        {
          StringEquals: {
            [`oidc.circleci.com/org/${props.provider.organizationId}:aud`]: props.provider.organizationId,
            ...generateProjectCondition(
              `oidc.circleci.com/org/${props.provider.organizationId}`,
              props.provider.organizationId,
            ),
          },
        },
      ),
    });
  }
}

function generateProjectCondition(oidcUrl: string, organizationId: string, projectIds?: string[]) {
  if (!projectIds || projectIds.length === 0) {
    return {};
  }

  return {
    StringLike: {
      [`${oidcUrl}:sub`]: projectIds.map((projectId) => `org/${organizationId}/project/${projectId}/*`),
    },
  };
}
