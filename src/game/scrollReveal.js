const HIDE_DELAY_MS = 900
const hideTimers = new WeakMap()

function isScrollable(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
}

function revealScrollbar(element) {
  if (!element?.classList?.contains('game-scroll')) {
    return
  }

  element.classList.add('is-scrolling')

  const previousTimer = hideTimers.get(element)
  if (previousTimer) {
    clearTimeout(previousTimer)
  }

  hideTimers.set(
    element,
    setTimeout(() => {
      element.classList.remove('is-scrolling')
      hideTimers.delete(element)
    }, HIDE_DELAY_MS),
  )
}

function handleScroll(event) {
  const target = event.target
  if (target instanceof Element && target.classList.contains('game-scroll')) {
    revealScrollbar(target)
  }
}

function handleTouchStart(event) {
  const target = event.target.closest?.('.game-scroll')
  if (target instanceof Element && isScrollable(target)) {
    revealScrollbar(target)
  }
}

export function initGameScrollReveal(root) {
  if (!root) {
    return undefined
  }

  root.addEventListener('scroll', handleScroll, { capture: true, passive: true })
  root.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true })

  return () => {
    root.removeEventListener('scroll', handleScroll, { capture: true })
    root.removeEventListener('touchstart', handleTouchStart, { capture: true })
  }
}
