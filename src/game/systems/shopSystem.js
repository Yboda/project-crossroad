import { shopItems } from '../data/shopItems'
import { applyEventResult } from './eventSystem'
import { getShopPriceMultiplier } from './relicSystem'

export function createShopInventory(player, runState, count = 4) {
  const priceMultiplier = getShopPriceMultiplier(player)
  return shopItems
    .filter((item) => !item.result.relic || !player.relics.includes(item.result.relic))
    .slice((runState.totalDepth - 1) % 3)
    .concat(shopItems)
    .slice(0, count)
    .map((item) => ({
      ...item,
      price: Math.ceil(item.price * priceMultiplier),
    }))
}

export function createShopNarrative(player, runState) {
  const inventory = createShopInventory(player, runState)
  return {
    id: `shop-${runState.totalDepth}-${runState.gold}`,
    title: '얼굴 없는 상인',
    story: [
      '상인은 당신을 보자마자 이미 계산을 끝낸 듯 손가락을 편다.',
      `현재 골드: ${runState.gold}`,
    ],
    prompt: '당신은,',
    options: [
      ...inventory.map((item) => ({
        id: `buy-${item.id}`,
        label: item.label,
        detail: `${item.price}골드 / ${item.detail}`,
        type: 'shop-buy',
        item,
        locked: runState.gold < item.price,
      })),
      {
        id: 'shop-talk',
        label: '상인과 대화한다.',
        detail: '그는 미궁의 감시자처럼 보인다.',
        type: 'message',
        response: [
          '"너는 계속 오른다고 생각하지. 하지만 네가 오르는 것은 계단이 아니라 반복이야."',
          '상인은 더 말하지 않고 빈 얼굴을 숙인다.',
        ],
      },
      { id: 'leave-shop', label: '상점을 떠난다.', detail: '다음 장소로 향한다.', type: 'continue-run' },
    ],
  }
}

export function buyShopItem(player, runState, item) {
  if (runState.gold < item.price) {
    return ['골드가 부족하다.']
  }

  runState.gold -= item.price
  return [`${item.label}을 구매했다.`, ...applyEventResult(player, runState, item.result)]
}
