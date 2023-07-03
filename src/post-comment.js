// @ts-check

const debug = require('debug')('lhci-gha')
const { Octokit } = require('octokit')
const { evalEmojiUnit } = require('./emoji')
const fs = require('fs')

const metrics = [
  'first-contentful-paint',
  'interactive',
  'speed-index',
  'total-blocking-time',
  'largest-contentful-paint',
  'cumulative-layout-shift',
]

/**
 * Posts a comment with Lighthouse performance results
 * @see https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28
 */
async function postComment(options, envOptions) {
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
  if (!options.body) {
    throw new Error('options.body is required')
  }

  console.log(
    'performance comment on %s/%s %d',
    options.owner,
    options.repo,
    options.issue,
  )

  if (!envOptions) {
    throw new Error('Missing env options')
  }
  if (!envOptions.token) {
    throw new Error('Missing GH token')
  }

  const octokit = new Octokit({ auth: envOptions.token })
  const result = await octokit.rest.issues.createComment({
    owner: options.owner,
    repo: options.repo,
    issue_number: options.issue,
    body: options.body,
  })
  if (result.status === 201) {
    console.log('Comment posted %s', result.data.html_url)
  } else {
    console.error('problem posting a comment')
    console.error(result)
  }
}

async function postPerformanceComment(options, envOptions) {
  if (!options) {
    throw new Error('Missing options')
  }
  if (!options.reportFilename) {
    throw new Error('Missing report filename')
  }
  const results = JSON.parse(fs.readFileSync(options.reportFilename, 'utf8'))
  const title = options.title || 'Lighthouse performance'

  const performanceAudit = results.categories.performance
  const performance = Math.round(performanceAudit.score * 100)
  const performanceSymbol = evalEmojiUnit(performanceAudit.score)
  let body = `**${title} ${performance} ${performanceSymbol}**`

  body += '\n\nMetric | Time | Eval\n---|---|---\n'
  metrics.forEach((key) => {
    const audit = results.audits[key]
    body += `${audit.title} | ${audit.displayValue} | ${evalEmojiUnit(
      audit.score,
    )}\n`
  })

  // add the final performance score
  body += `${performanceAudit.title} | ${performance} | ${performanceSymbol}\n`
  body +=
    '\n[Trying Lighthouse](https://glebbahmutov.com/blog/trying-lighthouse/)'

  const commentOptions = {
    ...options,
    body,
  }
  return postComment(commentOptions, envOptions)
}

module.exports = { postComment, postPerformanceComment }
