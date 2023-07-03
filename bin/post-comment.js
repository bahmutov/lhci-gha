#!/usr/bin/env node

// @ts-check

const arg = require('arg')
const debug = require('debug')('lhci-gha')
const { postPerformanceComment } = require('../src/post-comment')

const args = arg({
  // Lighthouse performance JSON filename
  '--report-filename': String,
  // comment summary title
  '--title': String,
  // issue or pull request number
  '--issue': Number,

  // GitHub owner and repo
  '--owner': String,
  '--repo': String,

  // alias
  '-f': '--report-filename',
  '--pr': '--issue',
})
debug('args %o', args)

if (!args['--report-filename']) {
  console.error('Missing --report-filename')
  process.exit(1)
}

const options = {
  owner: args['--owner'],
  repo: args['--repo'],
  issue: args['--issue'],
  reportFilename: args['--report-filename'],
  title: args['--title'] || 'Lighthouse performance',
  body: 'comment body',
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

const envOptions = {
  token: process.env.GITHUB_TOKEN || process.env.PERSONAL_GH_TOKEN,
}

postPerformanceComment(options, envOptions)
