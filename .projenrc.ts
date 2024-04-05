import { ReleasableCommits, awscdk } from "projen";
import { ProseWrap } from "projen/lib/javascript";

const project = new awscdk.AwsCdkConstructLibrary({
  author: "Ben Limmer",
  authorAddress: "hello@benlimmer.com",
  cdkVersion: "2.73.0", // Released in April 2023
  defaultReleaseBranch: "main",
  name: "@blimmer/cdk-circleci-oidc",
  repositoryUrl: "https://github.com/blimmer/cdk-circleci-oidc.git",

  projenrcTs: true,

  jsiiVersion: "~5.0.0",

  releasableCommits: ReleasableCommits.featuresAndFixes(), // don't release "chore" commits
  python: {
    distName: "cdk-circleci-oidc",
    module: "cdk_circleci_oidc",
  },

  depsUpgrade: false,

  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
      proseWrap: ProseWrap.ALWAYS,
    },
  },

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.synth();
