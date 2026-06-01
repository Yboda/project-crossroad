export const shopItems = [
  { id: 'potion', label: '붉은 약초', price: 18, detail: 'HP를 12 회복한다.', result: { hp: 12 } },
  { id: 'ether', label: '푸른 약병', price: 16, detail: 'MP를 3 회복한다.', result: { mp: 3 } },
  { id: 'whetstone', label: '무딘 숫돌', price: 28, detail: '공격력 +1', result: { attack: 1 } },
  { id: 'guard-charm', label: '방어 부적', price: 28, detail: '방어력 +1', result: { defense: 1 } },
  { id: 'mist-step', label: '유물: 안개 발걸음', price: 42, detail: '전투 기습에 유리해진다.', result: { relic: 'mist-step' } },
  { id: 'broken-clock', label: '유물: 깨진 시계', price: 48, detail: '적 첫 턴을 늦출 가능성.', result: { relic: 'broken-clock' } },
  { id: 'sealed-name', label: '유물: 봉인된 이름', price: 65, detail: '중심부 단서 선택지를 돕는다.', result: { relic: 'sealed-name' } },
]
