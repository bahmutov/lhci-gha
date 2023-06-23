/**
 * Returns a symbol for the score.
 * @param {number} score from 0 to 1
 */
function evalEmojiUnit(score) {
  if (score >= 0.9) {
    return '🟢'
  }
  if (score >= 0.5) {
    return '🟧'
  }
  return '🔺'
}

/**
 * Returns a symbol for the score.
 * @param {number} score from 0 to 100
 */
function evalEmoji100(score) {
  if (score >= 90) {
    return '🟢'
  }
  if (score >= 50) {
    return '🟧'
  }
  return '🔺'
}

module.exports = { evalEmojiUnit, evalEmoji100 }
