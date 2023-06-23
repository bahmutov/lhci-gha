#!/usr/bin/env node

// @ts-check

const arg = require('arg')
const debug = require('debug')('lhci-gha')
const { postSummary } = require('../src/post-summary')

const args = arg({
  // Lighthouse performance JSON filename
  '--report-filename': String,

  // alias
  '-f': '--report-filename',
})
debug('args %o', args)

if (!args['--report-filename']) {
  console.error('Missing --report-filename')
  process.exit(1)
}

postSummary(args['--report-filename'])
