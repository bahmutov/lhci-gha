const got = require('got')
const debug = require('debug')('lhci-gha')

/**
 * Posts a comment with Lighthouse performance results
 */
async function postComment(options) {
  if (!options) {
    throw new Error('Missing options')
  }
  debug('posting performance comment %o', options)

  if (!options.owner) {
    throw new Error('options.owner is required')
  }
  if (!options.repo) {
    throw new Error('options.repo is required')
  }
  if (!options.issue) {
    throw new Error('options.issue is required')
  }

  console.log(
    'performance comment on %s/%s %d',
    options.owner,
    options.repo,
    options.issue,
  )
}

module.exports = { postComment }
