#!/usr/bin/env node

// @ts-check

const ghCore = require('@actions/core')
const results = require('./lighthouse-results.json')
const { evalEmojiUnit } = require('./utils/emoji')
const metrics = [
  'first-contentful-paint',
  'interactive',
  'speed-index',
  'total-blocking-time',
  'largest-contentful-paint',
  'cumulative-layout-shift',
]

const rows = []

metrics.forEach((key) => {
  const audit = results.audits[key]
  // be safe and always push strings
  rows.push([
    audit.title,
    String(audit.displayValue),
    evalEmojiUnit(audit.score),
  ])
})

// add the final performance score
const performanceAudit = results.categories.performance
const performance = performanceAudit.score * 100
const performanceSymbol = evalEmojiUnit(performanceAudit.score)
rows.push([performanceAudit.title, String(performance), performanceSymbol])

console.table(rows)

ghCore.summary
  .addHeading(`Lighthouse Performance ${performance} ${performanceSymbol}`)
  .addTable([
    [
      { data: 'Metric', header: true },
      { data: 'Time', header: true },
      { data: 'Eval', header: true },
    ],
    ...rows,
  ])
  .addLink(
    'Trying Lighthouse',
    'https://glebbahmutov.com/blog/trying-lighthouse/',
  )
  .write()
