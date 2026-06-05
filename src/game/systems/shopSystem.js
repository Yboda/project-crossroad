import { getFloorByIndex } from '../data/floors'
import { formatMerchantStory, getFloorMerchant } from '../data/floorMerchants'
import { shopItems } from '../data/shopItems'
import { getRelicById } from '../data/relics'
import { applyEventResult } from './eventSystem'
import { getShopPriceMultiplier } from './relicSystem'

const DEFAULT_RELIC_COUNT = 4
const DEFAULT_POTION_IDS = ['potion', 'ether']

export function resolveFloorMerchant(runState, room = null) {
  const floorId = room?.floorId ?? getFloorByIndex(runState.floorIndex).id
  return getFloorMerchant(floorId)
}

export function createShopInventory(player, runState, merchant = resolveFloorMerchant(runState)) {
  const priceMultiplier = getShopPriceMultiplier(player)
  const potionIds = merchant.potionIds ?? DEFAULT_POTION_IDS
  const relicCount = merchant.relicCount ?? DEFAULT_RELIC_COUNT
  const relicPool = merchant.relicPool ?? []

  const potions = potionIds
    .map((itemId) => shopItems.find((item) => item.id === itemId))
    .filter(Boolean)
  const relicItems = shuffleRelics(
    relicPool.map((relicId) => getRelicById(relicId)).filter(Boolean),
    runState.totalDepth,
  )
    .filter((relic) => !player.relics.includes(relic.id))
    .slice(0, relicCount)
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

export function createShopNarrative(player, runState, merchant = resolveFloorMerchant(runState)) {
  return {
    id: `shop-${merchant.id}-${runState.totalDepth}-${runState.gold}`,
    layout: 'shop-entry',
    title: merchant.title,
    story: formatMerchantStory(merchant.entryStory, { gold: runState.gold }),
    prompt: '당신은,',
    options: [
      { id: 'open-shop', label: '상점을 이용한다.', detail: '물품을 둘러보고 구매한다.', type: 'open-shop' },
      {
        id: 'shop-talk',
        label: '상인과 대화한다.',
        detail: merchant.talkDetail,
        type: 'message',
        response: merchant.talkResponse,
      },
      { id: 'leave-shop', label: '상점을 떠난다.', detail: '다음 장소로 향한다.', type: 'continue-run' },
    ],
  }
}

export function createShopScreenNarrative(
  runState,
  inventory,
  merchant = resolveFloorMerchant(runState),
  messages = [],
) {
  const items = inventory.map((item) => ({
    ...item,
    optionId: `buy-${item.id}`,
    locked: runState.gold < item.price,
  }))

  return {
    id: `shop-screen-${merchant.id}-${runState.totalDepth}-${runState.gold}-${items.length}-${messages.join('|')}`,
    layout: 'shop',
    title: merchant.title,
    story: messages.length ? messages : merchant.shopScreenStory,
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
    return ['골드가 부족해 구매하지 못했다.']
  }

  if (item.result.relic && player.relics.includes(item.result.relic)) {
    return ['이미 가지고 있는 유물이라 구매하지 않았다.']
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
  const hookPremium = relic.hooks?.includes('storyFlag') ? 12 : 0
  return 42 + index * 5 + hookPremium
}
