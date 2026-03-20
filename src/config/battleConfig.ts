export const ENTITY_CONFIG = {
  characters: {
    c01: {
      name: 'Max',
      size: { width: 64, height: 57 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 800, loop: false, damageDelay: 500 },
        damage: { duration: 500, loop: false },
        dead: { duration: 1000, loop: false },
      },
    },
    c02: {
      name: 'Sven',
      size: { width: 64, height: 57 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 800, loop: false, damageDelay: 500 },
        damage: { duration: 500, loop: false },
        dead: { duration: 1000, loop: false },
      },
    },
    c03: {
      name: 'Alex',
      size: { width: 64, height: 57 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 800, loop: false, damageDelay: 500 },
        damage: { duration: 500, loop: false },
        dead: { duration: 1000, loop: false },
      },
    },
    c04: {
      name: 'Kitty',
      size: { width: 64, height: 57 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 800, loop: false, damageDelay: 500 },
        damage: { duration: 500, loop: false },
        dead: { duration: 1000, loop: false },
      },
    },
    c05: {
      name: 'Java',
      size: { width: 64, height: 57 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 800, loop: false, damageDelay: 500 },
        damage: { duration: 500, loop: false },
        dead: { duration: 1000, loop: false },
      },
    },
    c06: {
      name: 'Kelvin',
      size: { width: 64, height: 57 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 800, loop: false, damageDelay: 500 },
        damage: { duration: 500, loop: false },
        dead: { duration: 1000, loop: false },
      },
    },
    c07: {
      name: 'Liz',
      size: { width: 64, height: 57 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 800, loop: false, damageDelay: 500 },
        damage: { duration: 500, loop: false },
        dead: { duration: 1000, loop: false },
      },
    },
    c08: {
      name: 'Mond',
      size: { width: 64, height: 57 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 800, loop: false, damageDelay: 500 },
        damage: { duration: 500, loop: false },
        dead: { duration: 1000, loop: false },
      },
    },
    c09: {
      name: 'Jenny',
      size: { width: 64, height: 57 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 800, loop: false, damageDelay: 500 },
        damage: { duration: 500, loop: false },
        dead: { duration: 1000, loop: false },
      },
    },
  },
  bosses: {
    b01: {
      name: 'Dracula',
      size: { width: 64, height: 57 },
      position: { left: '310px', bottom: '30px', zIndex: 5 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 2000, loop: false },
        damage: { duration: 1000, loop: false },
        dead: { duration: 1500, loop: false },
      },
    },
    b02: {
      name: 'Golem',
      size: { width: 128, height: 79 },
      position: { left: '280px', bottom: '30px', zIndex: 5 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 1800, loop: false },
        damage: { duration: 800, loop: false },
        dead: { duration: 1200, loop: false },
      },
    },
    b03: {
      name: 'Gnoll',
      size: { width: 64, height: 56 },
      position: { left: '320px', bottom: '30px', zIndex: 5 },
      actions: {
        idle: { loop: true },
        walk_left: { loop: true },
        walk_right: { loop: true },
        attack: { duration: 2000, loop: false },
        damage: { duration: 700, loop: false },
        dead: { duration: 600, loop: false },
      },
    },
  },
}

/** Number of boss types defined in the game (for UI like "defeated / total"). */
export const TOTAL_BOSS_COUNT = Object.keys(ENTITY_CONFIG.bosses).length

export const POSITIONS = {
  p1: { left: '180px', bottom: '30px', zIndex: 10, opacity: 1 },
  p2: { left: '140px', bottom: '30px', zIndex: 9, opacity: 1 },
  p3: { left: '100px', bottom: '30px', zIndex: 8, opacity: 1 },
  p4: { left: '60px', bottom: '30px', zIndex: 7, opacity: 1 },
  center: { left: '260px', bottom: '30px', zIndex: 50, opacity: 1 },
  offscreen_queue: { left: '-80px', bottom: '30px', zIndex: 1, opacity: 1 },
  queue_peek: {
    left: '20px',
    bottom: '30px',
    zIndex: 6,
    opacity: 1,
    transition: 'left 0.3s ease-out, bottom 1s, opacity 0.5s',
  },
  boss_spot_default: { left: '310px', bottom: '30px', zIndex: 5, opacity: 1 },
  graveyard: { left: '180px', bottom: '30px', zIndex: 0, opacity: 0 },
}
