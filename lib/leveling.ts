export const MAX_DUCK_LEVEL = 10;

export function getRequiredXpForLevel(level: number) {
  const xpByLevel: Record<number, number> = {
    1: 0,
    2: 100,
    3: 250,
    4: 500,
    5: 800,
    6: 1200,
    7: 1700,
    8: 2300,
    9: 3000,
    10: 4000,
  };

  return xpByLevel[level] ?? 4000;
}

export function calculateLevelFromXp(totalXp: number) {
  let level = 1;

  for (let currentLevel = 2; currentLevel <= MAX_DUCK_LEVEL; currentLevel++) {
    if (totalXp >= getRequiredXpForLevel(currentLevel)) {
      level = currentLevel;
    }
  }

  return level;
}

export function getXpToNextLevel(currentLevel: number, totalXp: number) {
  if (currentLevel >= MAX_DUCK_LEVEL) {
    return {
      currentLevelXp: totalXp,
      nextLevelXp: totalXp,
      percentage: 100,
    };
  }

  const currentLevelRequiredXp = getRequiredXpForLevel(currentLevel);
  const nextLevelRequiredXp = getRequiredXpForLevel(currentLevel + 1);

  const currentLevelXp = Math.max(totalXp - currentLevelRequiredXp, 0);
  const nextLevelXp = nextLevelRequiredXp - currentLevelRequiredXp;

  return {
    currentLevelXp,
    nextLevelXp,
    percentage: Math.min((currentLevelXp / nextLevelXp) * 100, 100),
  };
}
