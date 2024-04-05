import { CfnOIDCProvider } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface CircleCiOidcProviderProps {
  /**
   * The ID of your CircleCI organization. This is typically in a UUID format. You can find this ID in the CircleCI
   * dashboard UI under the "Organization Settings" tab.
   */
  readonly organizationId: string;

  /**
   * The OIDC thumbprints used by the provider. You should not need to provide this value unless CircleCI suddenly
   * rotates their OIDC thumbprints (e.g., in response to a security incident).
   *
   * If you do need to generate this thumbprint, you can follow the instructions here:
   * https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html
   */
  readonly circleCiOidcThumbprints?: string[];
}

/**
 * This construct creates a CircleCI ODIC provider to allow AWS access from CircleCI jobs. You'll need to instantiate
 * this construct once per AWS account you want to use CircleCI OIDC with.
 *
 * To create a role that can be assumed by CircleCI jobs, use the `CircleCiOidcRole` construct.
 */
export class CircleCiOidcProvider extends CfnOIDCProvider {
  public readonly organizationId: string;

  constructor(scope: Construct, id: string, props: CircleCiOidcProviderProps) {
    super(scope, id, {
      url: `https://oidc.circleci.com/org/${props.organizationId}`,
      clientIdList: [props.organizationId],
      thumbprintList: props.circleCiOidcThumbprints ?? ["9e99a48a9960b14926bb7f3b02e22da2b0ab7280"],
    });

    this.organizationId = props.organizationId;
  }
}
