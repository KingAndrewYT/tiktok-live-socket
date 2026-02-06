// Canonical TikTok LIVE events from tiktok-live-connector documentation + commonly emitted events.
export const DEFAULT_TIKTOK_EVENTS = [
  'chat',
  'member',
  'gift',
  'roomUser',
  'like',
  'social',
  'follow',
  'share',
  'subscribe',
  'emote',
  'envelope',
  'questionNew',
  'linkMicBattle',
  'linkMicArmies',
  'liveIntro',
  'streamEnd',
  'disconnected',
  'websocketConnected',
  'error',
  // Additional frequently surfaced internal events from newer connector builds.
  'linkMicFanTicketMethod',
  'linkMicBattleItemCard',
  'linkMicBattleCombo',
  'linkMicBattlePunishFinish',
  'linkMicBattlePunishStart',
  'linkMicBattleScoreUpdate',
  'linkMicBattleTask',
  'linkMicBattleVictoryLap',
  'roomVerify',
  'liveRoomStats',
];

export const parseExtraEvents = (rawValue) => {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(',')
    .map((eventName) => eventName.trim())
    .filter(Boolean);
};
