// @ts-check
const ghCore = require('@actions/core')
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
 * Reads Lighthouse JSON report and posts the main metrics
 * to GitHub job summary
 * @param {string} filename The path to the JSON report file
 * @param {string|undefined} title Optional summary title to use
 */
function postSummary(filename, title) {
  title = title || 'Lighthouse Performance'
  const results = JSON.parse(fs.readFileSync(filename, 'utf8'))
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
  const performance = Math.round(performanceAudit.score * 100)
  const performanceSymbol = evalEmojiUnit(performanceAudit.score)
  rows.push([performanceAudit.title, String(performance), performanceSymbol])

  console.table(rows)

  ghCore.summary
    .addHeading(`${title} ${performance} ${performanceSymbol}`)
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
}

module.exports = { postSummary }
