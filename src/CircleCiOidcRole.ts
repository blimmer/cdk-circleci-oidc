import {
  Condition,
  IManagedPolicy,
  IOpenIdConnectProvider,
  OpenIdConnectPrincipal,
  OpenIdConnectProvider,
  PolicyDocument,
  Role,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { CircleCiOidcProvider } from "./CircleCiOidcProvider";

/**
 * If you're using the {@link CircleCiOidcProvider} construct, pass it instead of these manually-defined props.
 */
export interface ManualCircleCiOidcProviderProps {
  /**
   * The CircleCI OIDC provider. You can either manually create it or import it.
   */
  readonly provider: IOpenIdConnectProvider;

  /**
   * The ID of your CircleCI organization. This is typically in a UUID format. You can find this ID in the CircleCI
   * dashboard UI under the "Organization Settings" tab.
   */
  readonly organizationId: string;
}

export interface CircleCiOidcRoleProps {
  readonly circleCiOidcProvider:
    | CircleCiOidcProvider
    | ManualCircleCiOidcProviderProps;

  /**
   * Provide the UUID(s) of the CircleCI project(s) you want to be allowed to use this role. If you don't provide this
   * value, the role will be allowed to be assumed by any CircleCI project in your organization. You can find a
   * project's ID in the CircleCI dashboard UI under the "Project Settings" tab. It's usually in a UUID format.
   *
   * @default - All CircleCI projects in the provider's organization
   */
  readonly circleCiProjectIds?: string[];

  /**
   * You can pass an explicit role name if you'd like, since you need to reference the Role ARN within your CircleCI
   * configuration.
   *
   * @default - CloudFormation will auto-generate you a role name
   */
  readonly roleName?: string;

  readonly managedPolicies?: IManagedPolicy[];
  readonly inlinePolicies?: {
    [name: string]: PolicyDocument;
  };
  readonly description?: string;
}

/**
 * This construct creates a CircleCI ODIC provider to allow AWS access from CircleCI jobs. You'll need to instantiate
 * this construct once per AWS account you want to use CircleCI OIDC with.
 *
 * To create a role that can be assumed by CircleCI jobs, use the `CircleCiOidcRole` construct.
 */
export class CircleCiOidcRole extends Construct {
  readonly role: Role;

  constructor(scope: Construct, id: string, props: CircleCiOidcRoleProps) {
    super(scope, id);

    const { circleCiProjectIds, circleCiOidcProvider, ...roleProps } = props;
    const { provider, organizationId } =
      this.extractOpenIdConnectProvider(circleCiOidcProvider);
    const oidcUrl = `oidc.circleci.com/org/${organizationId}`;

    this.role = new Role(this, "CircleCiOidcRole", {
      assumedBy: new OpenIdConnectPrincipal(provider, {
        StringEquals: { [`${oidcUrl}:aud`]: organizationId },
        ...this.generateProjectCondition(
          oidcUrl,
          organizationId,
          circleCiProjectIds,
        ),
      }),
      ...roleProps,
    });
  }

  private extractOpenIdConnectProvider(
    provider: CircleCiOidcProvider | ManualCircleCiOidcProviderProps,
  ) {
    if (provider instanceof CircleCiOidcProvider) {
      return {
        provider: OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          this,
          "ImportOidcProvider",
          provider.provider.attrArn,
        ),
        organizationId: provider.organizationId,
      };
    } else {
      return provider;
    }
  }

  private generateProjectCondition(
    oidcUrl: string,
    organizationId: string,
    circleCiProjectIds?: string[],
  ): Condition {
    if (!circleCiProjectIds || circleCiProjectIds.length === 0) {
      return {};
    }

    return {
      StringLike: {
        [`${oidcUrl}:sub`]: circleCiProjectIds.map(
          (projectId) => `org/${organizationId}/project/${projectId}/*`,
        ),
      },
    };
  }
}
