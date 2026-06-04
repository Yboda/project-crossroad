import { shopItems } from '../data/shopItems'
import { relics } from '../data/relics'
import { applyEventResult } from './eventSystem'
import { getShopPriceMultiplier } from './relicSystem'

const POTION_IDS = ['potion', 'ether']
const RELIC_COUNT = 4

export function createShopInventory(player, runState, count = RELIC_COUNT) {
  const priceMultiplier = getShopPriceMultiplier(player)

  const potions = POTION_IDS.map((itemId) => shopItems.find((item) => item.id === itemId)).filter(Boolean)
  const relicItems = shuffleRelics(relics, runState.totalDepth)
    .filter((relic) => !player.relics.includes(relic.id))
    .slice(0, count)
    .map((relic, index) => ({
      id: `relic-${relic.id}`,
      label: relic.name,
      price: getRelicPrice(relic, index),
      detail: relic.description,
      result: { relic: relic.id },
      relic,
      kind: 'relic',
    }))

  return [...potions, ...relicItems].map((item) => ({
      ...item,
      kind: item.kind ?? 'potion',
      price: Math.ceil(item.price * priceMultiplier),
    }))
}

export function createShopNarrative(player, runState) {
  return {
    id: `shop-${runState.totalDepth}-${runState.gold}`,
    layout: 'shop-entry',
    story: [
      '상인은 당신을 보자마자 이미 계산을 끝낸 듯 손가락을 편다. 후드 아래에는 얼굴 대신 빈 공기만 있다.',
      `지금 당신의 골드는 ${runState.gold}이다. 상자 안 물건들은 말없이 가격을 기다린다.`,
    ],
    prompt: '당신은,',
    options: [
      { id: 'open-shop', label: '상점을 이용한다.', detail: '물품을 둘러보고 구매한다.', type: 'open-shop' },
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

export function createShopScreenNarrative(runState, inventory, messages = []) {
  const items = inventory.map((item) => ({
    ...item,
    optionId: `buy-${item.id}`,
    locked: runState.gold < item.price,
  }))

  return {
    id: `shop-screen-${runState.totalDepth}-${runState.gold}-${items.length}-${messages.join('|')}`,
    layout: 'shop',
    title: '얼굴 없는 상점',
    story: messages.length
      ? messages
      : ['후드 아래의 빈 얼굴이 고개를 기울인다. 물건들은 말없이 당신을 기다린다.'],
    prompt: '물품을 고르세요.',
    shop: {
      gold: runState.gold,
      items,
    },
    options: [
      ...items.map((item) => ({
        id: item.optionId,
        label: item.label,
        detail: `${item.price}골드 / ${item.detail}`,
        type: 'shop-buy',
        item,
        locked: item.locked,
      })),
      {
        id: 'close-shop',
        label: '상점 이용을 그만한다.',
        detail: '상인 앞 선택지로 돌아간다.',
        type: 'close-shop',
      },
    ],
  }
}

export function buyShopItem(player, runState, item) {
  if (runState.gold < item.price) {
    return ['골드가 부족하다.']
  }

  if (item.result.relic && player.relics.includes(item.result.relic)) {
    return ['이미 가지고 있는 유물이다.']
  }

  runState.gold -= item.price
  return [`${item.label}을 구매했다.`, ...applyEventResult(player, runState, item.result)]
}

function shuffleRelics(items, seed) {
  return [...items].sort((left, right) => seededValue(left.id, seed) - seededValue(right.id, seed))
}

function seededValue(text, seed) {
  return [...text].reduce((total, char) => total + char.charCodeAt(0) * (seed + 17), seed)
}

function getRelicPrice(relic, index) {
  const hookPremium = relic.hooks.includes('storyFlag') ? 12 : 0
  return 42 + index * 5 + hookPremium
}
