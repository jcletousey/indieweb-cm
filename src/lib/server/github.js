import { graphql } from '@octokit/graphql';
import { env } from '$env/dynamic/private';

export class GHGraphQl {
  constructor(token) {
    this.gql = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });
  }

  async getOid() {
    const { repository } = await this.gql(
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

  async commit(oid, message, changes) {
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

    const { commit } = await this.gql(
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
}
