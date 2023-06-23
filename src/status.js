// @ts-check

const ghCommitStatuses = ['pending', 'success', 'failure', 'error']

function isValidStatus(status) {
  return ghCommitStatuses.includes(status)
}

module.exports = { ghCommitStatuses, isValidStatus }
