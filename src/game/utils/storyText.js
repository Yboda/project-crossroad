/**
 * 스토리 줄 형식
 * - 문자열: 위치(첫 줄/둘째 줄…)에 따라 기본 톤 적용
 * - 객체: { text, emphasis?, tier? }
 *   - emphasis: 줄 전체 또는 인라인 강조 프리셋 (예: 'dramatic')
 *   - tier: 'main' | 'sub' | 'extra' — 위치와 무관하게 톤 지정
 *
 * 인라인 강조: '앞문장 {{dramatic:강조할 텍스트}} 뒷문장'
 */
export const STORY_EMPHASIS_CLASS = {
  dramatic: 'story-emphasis-dramatic',
}

export function normalizeStoryLine(line) {
  if (typeof line === 'string') {
    return { text: line }
  }

  if (line && typeof line === 'object' && typeof line.text === 'string') {
    return line
  }

  return { text: String(line ?? '') }
}

export function getStoryLineTier(index, line) {
  const normalized = normalizeStoryLine(line)
  if (normalized.tier === 'main' || normalized.tier === 'sub' || normalized.tier === 'extra') {
    return normalized.tier
  }
  if (index === 0) return 'main'
  if (index === 1) return 'sub'
  return 'extra'
}

export function getStoryLineTierClass(tier) {
  if (tier === 'main') return 'exploration-main-text'
  if (tier === 'sub') return 'exploration-sub-text'
  return 'exploration-extra-text'
}

export function getStoryEmphasisClass(emphasis) {
  return STORY_EMPHASIS_CLASS[emphasis] ?? `story-emphasis-${emphasis}`
}

const INLINE_EMPHASIS_PATTERN = /\{\{(\w+):([^}]+)\}\}/g

export function parseInlineStoryEmphasis(text) {
  const parts = []
  let lastIndex = 0
  let match = INLINE_EMPHASIS_PATTERN.exec(text)

  while (match) {
    if (match.index > lastIndex) {
      parts.push({ type: 'plain', text: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'emphasis', emphasis: match[1], text: match[2] })
    lastIndex = match.index + match[0].length
    match = INLINE_EMPHASIS_PATTERN.exec(text)
  }

  INLINE_EMPHASIS_PATTERN.lastIndex = 0

  if (lastIndex < text.length) {
    parts.push({ type: 'plain', text: text.slice(lastIndex) })
  }

  return parts.length ? parts : [{ type: 'plain', text }]
}
