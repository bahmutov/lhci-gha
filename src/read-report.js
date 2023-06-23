const fs = require('fs')

function getPerformance(filename) {
  const results = JSON.parse(fs.readFileSync(filename))
  const performanceAudit = results.categories.performance
  const performance = performanceAudit.score * 100
  return performance
}

module.exports = { getPerformance }
