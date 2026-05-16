import { ProjenStruct, Struct } from "@mrgrain/jsii-struct-builder";
import { ReleasableCommits, awscdk } from "projen";
import { NodePackageManager, NpmAccess, ProseWrap } from "projen/lib/javascript";

const project = new awscdk.AwsCdkConstructLibrary({
  author: "Ben Limmer",
  authorAddress: "hello@benlimmer.com",
  cdkVersion: "2.73.0", // Released in April 2023
  defaultReleaseBranch: "main",
  name: "@blimmer/cdk-circleci-oidc",
  repositoryUrl: "https://github.com/blimmer/cdk-circleci-oidc.git",
  description: "AWS CDK construct to create OIDC roles for CircleCI jobs",
  keywords: ["cdk", "aws-cdk", "awscdk", "aws", "iam", "circleci", "oidc", "openid-connect"],
  majorVersion: 1,

  projenrcTs: true,
  projenVersion: "^0.99.55",

  packageManager: NodePackageManager.PNPM,
  workflowNodeVersion: "24",
  workflowPackageCache: true,

  releasableCommits: ReleasableCommits.featuresAndFixes(), // don't release "chore" commits
  npmAccess: NpmAccess.PUBLIC,
  npmTrustedPublishing: true,
  python: {
    distName: "cdk-circleci-oidc",
    module: "cdk_circleci_oidc",
    trustedPublishing: true,
  },

  // deps: [],
  devDeps: ["@mrgrain/jsii-struct-builder"],
  depsUpgradeOptions: {
    cooldown: 5,
  },

  eslintOptions: {
    dirs: ["src"],
    ignorePatterns: ["src/generated/*.ts"], // ignore generated files
  },
  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
      proseWrap: ProseWrap.ALWAYS,
    },
  },
});

new ProjenStruct(project, { name: "RoleProps", filePath: "src/generated/IamRoleProps.ts" }).mixin(
  Struct.fromFqn("aws-cdk-lib.aws_iam.RoleProps").omit("assumedBy").withoutDeprecated(),
);

project.synth();
