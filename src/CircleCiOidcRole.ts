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

/**
 * Props that define the IAM Role that can be assumed by a CircleCI job
 * via the CircleCI OpenID Connect Identity Provider.
 *
 * Besides {@link CircleCiConfiguration}, you may pass in any {@link RoleProps} except `assumedBy`
 * which will be defined by this construct.
 */
export interface CircleCiOidcRoleProps extends CircleCiConfiguration, RoleProps {}

/** Define an IAM Role that can be assumed by a CircleCI Job via the CircleCI OpenID Connect Identity Provider. */
export class CircleCiOidcRole extends Role {
  constructor(scope: Construct, id: string, props: CircleCiOidcRoleProps) {
    const { provider, projectIds, ...roleProps } = props;
    super(scope, id, {
      assumedBy: new OpenIdConnectPrincipal(
        // We use the CfnOIDCProvider instead of the OpenIdConnectProvider since it's overly complex
        // See https://github.com/aws/aws-cdk/issues/21197
        // However, the OpenIdConnectPrincipal still expects the L2 OpenIdConnectProvider, so we "import" it here to
        // make TypeScript happy with the types.
        OpenIdConnectProvider.fromOpenIdConnectProviderArn(scope, `CircleCiOidcProviderImport${id}`, provider.arn),
        {
          StringEquals: {
            [`oidc.circleci.com/org/${provider.organizationId}:aud`]: provider.organizationId,
          },
          ...generateProjectCondition(
            `oidc.circleci.com/org/${provider.organizationId}`,
            provider.organizationId,
            projectIds,
          ),
        },
      ),
      ...roleProps,
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
