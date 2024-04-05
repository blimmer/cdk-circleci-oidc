import { awscdk } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Ben Limmer',
  authorAddress: 'hello@benlimmer.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: '@blimmer/cdk-circleci-oidc',
  repositoryUrl: 'https://github.com/blimmer/cdk-circleci-oidc.git',

  projenrcTs: true,

  jsiiVersion: "~5.0.0",

  python: {
    distName: 'cdk-circleci-oidc',
    module: 'cdk_circleci_oidc',
  },

  depsUpgrade: false,

  prettier: true,

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.synth();
