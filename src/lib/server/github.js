import { graphql } from '@octokit/graphql';
import { GH_API_TOKEN, REPO_OWNER, REPO_NAME, REPO_BRANCH } from '$env/static/private';

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GH_API_TOKEN}`,
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
      repoOwner: REPO_OWNER,
      repoName: REPO_NAME,
      branchRef: REPO_BRANCH,
    },
  );
  return repository.ref.target.history.nodes[0].oid;
}

export async function commit(oid, message, changes) {
  const commitOnBranchInput = {
    branch: {
      repositoryNameWithOwner: `${REPO_OWNER}/${REPO_NAME}`,
      branchName: REPO_BRANCH,
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
