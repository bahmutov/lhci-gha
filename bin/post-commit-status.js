#!/usr/bin/env node

// @ts-check

const arg = require('arg')
const debug = require('debug')('lhci-gha')
const { getPerformance } = require('../src/read-report')
const { evalEmoji100 } = require('../src/emoji')
const { setGitHubCommitStatus } = require('../src/post-commit-status')
const { isValidStatus } = require('../src/status')

const args = arg({
  '--owner': String,
  '--repo': String,
  '--commit': String,
  // Lighthouse performance JSON filename
  '--report-filename': String,

  // minimum performance number (1-100)
  '--min': Number,

  // commit status fields
  // https://docs.github.com/en/rest/reference/commits#commit-statuses
  '--status': String,
  '--description': String,
  '--target-url': String,
  '--context': String,

  // aliases
  '-o': '--owner',
  '-r': '--repo',
  '-c': '--commit',
  '--sha': '--commit',
  '-s': '--status',
})
debug('args %o', args)

if (!args['--report-filename']) {
  console.error('Missing --report-filename')
  process.exit(1)
}

if (!args['--min']) {
  args['--min'] = 70
  console.log('Set minimum performance number to 70')
}

function checkEnvVariables(env) {
  if (!env.GITHUB_TOKEN && !env.PERSONAL_GH_TOKEN) {
    console.error(
      'Cannot find environment variable GITHUB_TOKEN or PERSONAL_GH_TOKEN',
    )
    process.exit(1)
  }
}
checkEnvVariables(process.env)

console.log('reading Lighthouse report from %s', args['--report-filename'])
const performance = getPerformance(args['--report-filename'])
console.log('posting performance score %d', performance)

const commitSha = process.env.GITHUB_SHA

const options = {
  owner: args['--owner'],
  repo: args['--repo'],
  commit: args['--commit'] || commitSha,
  // status fields
  status: args['--status'],
  description: args['--description'] || 'Fast enough',
  targetUrl: args['--target-url'],
  context: args['--context'] || 'Lighthouse',
}

if (process.env.GITHUB_REPOSITORY) {
  // read the owner and the repo from the environment variable
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')
  if (!options.owner) {
    options.owner = owner
  }
  if (!options.repo) {
    options.repo = repo
  }
}

const envOptions = {
  token: process.env.GITHUB_TOKEN || process.env.PERSONAL_GH_TOKEN,
}

if (performance < args['--min']) {
  options.status = 'failure'
  options.description = `Performance ${performance} is worse than minimum ${args['--min']}`
} else {
  options.status = 'success'
  options.description = `Performance ${performance}`
}

const performanceEmoji = evalEmoji100(performance)
console.log(`%s %s`, options.description, performanceEmoji)

if (!isValidStatus(options.status)) {
  throw new Error(`invalid status ${options.status}`)
}
setGitHubCommitStatus(options, envOptions)
