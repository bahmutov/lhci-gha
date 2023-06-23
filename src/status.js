const ghCommitStatuses = ['pending', 'success', 'failure', 'error']

function isValidStatus(status) {
  return validStatuses.includes(options.status)
}

module.exports = { ghCommitStatuses, isValidStatus }
