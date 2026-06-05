/** 개발자 도구에서 미리볼 수 있는 화면 목록 */
export const DEV_SCREEN_GROUPS = [
  {
    id: 'lobby',
    label: '로비',
    screens: [
      { id: 'lobby-main', label: '시체더미의 방' },
      { id: 'body-select', label: '육체 선택' },
      { id: 'soul-nodes', label: '영혼 각인' },
    ],
  },
  {
    id: 'exploration',
    label: '탐험',
    screens: [
      { id: 'exploration-travel', label: '경로 선택 (3방향)' },
      { id: 'exploration-battle-intro', label: '전투 직전' },
      { id: 'exploration-rest', label: '휴식처' },
      { id: 'exploration-event', label: '이벤트 (제단)' },
      { id: 'exploration-relic-modal', label: '탐험 + 유물 모달' },
    ],
  },
  {
    id: 'combat',
    label: '전투',
    screens: [
      { id: 'combat', label: '전투 턴' },
      { id: 'combat-skills', label: '스킬 선택' },
      { id: 'victory', label: '승리 · 보상' },
      { id: 'victory-relic', label: '승리 · 유물 획득' },
      { id: 'victory-boss-relic', label: '승리 · 보스 유물' },
      { id: 'level-up', label: '레벨업' },
      { id: 'death', label: '사망' },
    ],
  },
  {
    id: 'shop',
    label: '상점',
    screens: [
      { id: 'shop-entry', label: '상점 입구' },
      { id: 'shop', label: '상점 구매' },
    ],
  },
  {
    id: 'ui',
    label: 'UI 오버레이',
    screens: [{ id: 'character-modal', label: '캐릭터 정보 모달' }],
  },
]

export const DEV_SCREEN_IDS = DEV_SCREEN_GROUPS.flatMap((group) =>
  group.screens.map((screen) => screen.id),
)

/** 전투 미리보기에서 적 선택이 의미 있는 화면 */
export const DEV_COMBAT_SCREEN_IDS = new Set([
  'combat',
  'combat-skills',
  'victory',
  'victory-relic',
  'victory-boss-relic',
])
