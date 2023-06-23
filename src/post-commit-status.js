const got = require('got')
const debug = require('debug')('lhci-gha')

/**
 * Sets GitHub commit status. Handles any GH errors and prints them to STDERR.
 */
async function setGitHubCommitStatus(options, envOptions) {
  if (!options.owner) {
    throw new Error('options.owner is required')
  }
  if (!options.repo) {
    throw new Error('options.repo is required')
  }
  if (!options.commit) {
    throw new Error('options.commit is required')
  }
  if (!options.status) {
    throw new Error('options.status is required')
  }

  // debug('setting commit status: %o', options)
  console.log(
    'setting %s/%s commit %s status to %s',
    options.owner,
    options.repo,
    options.commit,
    options.status,
  )

  // REST call to GitHub API
  // https://docs.github.com/en/rest/reference/commits#commit-statuses
  // https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#example-calling-the-rest-api
  // a typical request would be like:
  // curl --request POST \
  // --url https://api.github.com/repos/${{ github.repository }}/statuses/${{ github.sha }} \
  // --header 'authorization: Bearer ${{ secrets.GITHUB_TOKEN }}' \
  // --header 'content-type: application/json' \
  // --data '{
  //     "state": "success",
  //     "description": "REST commit status",
  //     "context": "a test"
  //   }'
  const url = `https://api.github.com/repos/${options.owner}/${options.repo}/statuses/${options.commit}`
  debug('url: %s', url)

  const json = {
    context: options.context,
    state: options.status,
    description: options.description,
    target_url: options.targetUrl,
  }
  try {
    // @ts-ignore
    const res = await got.post(url, {
      headers: {
        authorization: `Bearer ${envOptions.token}`,
      },
      json,
    })
    console.log(
      'set commit %s status %s with %s %s',
      options.commit,
      options.status,
      options.context,
      options.description ? options.description : '',
    )
    console.log('response status: %d %s', res.statusCode, res.statusMessage)
  } catch (err) {
    console.error('⚠️ Problem setting GitHub status')
    console.error('POST %s', url)
    console.error('%o', json)
    console.error(err)
  }
}

module.exports = { setGitHubCommitStatus }
