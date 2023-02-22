import { OpenIdConnectProvider } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface CircleCiOidcProviderProps {
  /**
   * The ID of your CircleCI organization. This is typically in a UUID format. You can find this ID in the CircleCI
   * dashboard UI under the "Organization Settings" tab.
   */
  organizationId: string;

  /**
   * The OIDC thumbprints used by the provider. You should not need to provide this value unless CircleCI suddenly
   * rotates their OIDC thumbprints (e.g., in response to a security incident).
   *
   * If you do need to generate this thumbprint, you can follow the instructions here:
   * https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html
   */
  circleCiOidcThumbprints?: string[];
}

/**
 * This construct creates a CircleCI ODIC provider to allow AWS access from CircleCI jobs. You'll need to instantiate
 * this construct once per AWS account you want to use CircleCI OIDC with.
 *
 * To create a role that can be assumed by CircleCI jobs, use the `CircleCiOidcRole` construct.
 */
export class CircleCiOidcProvider extends Construct {
  public readonly provider: OpenIdConnectProvider;
  public readonly organizationId: string;

  constructor(scope: Construct, id: string, props: CircleCiOidcProviderProps) {
    super(scope, id);

    const { organizationId, circleCiOidcThumbprints } = props;

    this.provider = new OpenIdConnectProvider(this, 'CircleCiOidcProvider', {
      url: `https://oidc.circleci.com/org/${organizationId}`,
      clientIds: [organizationId],
      thumbprints: circleCiOidcThumbprints,
    });
  }
}
