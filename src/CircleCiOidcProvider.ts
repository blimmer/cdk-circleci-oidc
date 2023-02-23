import { OpenIdConnectProvider, OpenIdConnectProviderProps } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface CircleCiOidcProviderProps extends OpenIdConnectProviderProps {
  /**
   * The ID of your CircleCI organization. This is typically in a UUID format. You can find this ID in the CircleCI
   * dashboard UI under the "Organization Settings" tab.
   */
  readonly organizationId: string;
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

    const { organizationId, url, clientIds, ...oidcProviderProps } = props;

    this.provider = new OpenIdConnectProvider(this, 'CircleCiOidcProvider', {
      url: `https://oidc.circleci.com/org/${organizationId}`,
      clientIds: [organizationId],
      ...oidcProviderProps,
    });

    this.organizationId = organizationId;
  }
}
