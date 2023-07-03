#!/usr/bin/env node

// @ts-check

const arg = require('arg')
const debug = require('debug')('lhci-gha')
const { postComment } = require('../src/post-comment')

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
  reportFilename: args['--report-filename'],
  title: args['--title'],
  issue: args['--issue'],
}
postComment(options)
