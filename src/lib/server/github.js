import { graphql } from '@octokit/graphql';
import { env } from '$env/dynamic/private';

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${env.GH_API_TOKEN}`,
  },
});

export async function getOid() {
  const { repository } = await graphqlWithAuth(
    `
    query ($repoOwner: String!, $repoName: String!, $branchRef: String!) {
      repository(owner: $repoOwner, name: $repoName) {
        ref(qualifiedName: $branchRef) {
          target {
            ... on Commit {
              history(first: 1) {
                nodes {
                  oid
                }
              }
            }
          }
        }
      }
    }
    `,
    {
      repoOwner: env.REPO_OWNER,
      repoName: env.REPO_NAME,
      branchRef: env.REPO_BRANCH,
    },
  );
  return repository.ref.target.history.nodes[0].oid;
}

export async function commit(oid, message, changes) {
  const commitOnBranchInput = {
    branch: {
      repositoryNameWithOwner: `${env.REPO_OWNER}/${env.REPO_NAME}`,
      branchName: env.REPO_BRANCH,
    },
    message: {
      headline: message,
    },
    fileChanges: {
      additions: changes,
    },
    expectedHeadOid: oid,
  };

  const { commit } = await graphqlWithAuth(
    `
      mutation ($input: CreateCommitOnBranchInput!) {
        createCommitOnBranch(input: $input) {
          commit {
            url
          }
        }
      }
    `,
    {
      input: commitOnBranchInput,
    },
  );

  return commit;
}
