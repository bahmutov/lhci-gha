const fs = require('fs')

/**
 * Reads the overall performance score and returns it from 1 to 100,
 * rounded to the nearest whole number.
 * @param {string} filename Lighthouse JSON report filename
 * @returns
 */
function getPerformance(filename) {
  const results = JSON.parse(fs.readFileSync(filename))
  const performanceAudit = results.categories.performance
  const performance = Math.round(performanceAudit.score * 100)
  return performance
}

module.exports = { getPerformance }
