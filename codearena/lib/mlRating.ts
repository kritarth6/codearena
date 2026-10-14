export interface RatingResult {
  oldRating: number;
  newRating: number;
  delta: number;
  accuracyPercentage: number;
  timeEfficiencyBonusPercentage: number;
  performanceIndex: string;
  tier: string;
}

export const calculateNewRating = ({
  oldRating = 1500,
  contestScore = 100,
  timeSpentMinutes = 35,
  totalDurationMinutes = 120
}: {
  oldRating: number;
  contestScore: number;
  timeSpentMinutes: number;
  totalDurationMinutes: number;
}): RatingResult => {
  const K_FACTOR = 40;

  const accuracy = Math.max(0, Math.min(1, contestScore / 100));
  const timeRatio = Math.max(0.1, Math.min(1, timeSpentMinutes / totalDurationMinutes));
  const timeEfficiencyBonus = (1 - timeRatio) * 0.2;
  const difficultyFactor = 1.15;

  const performanceIndex = (accuracy * (1 + timeEfficiencyBonus)) * difficultyFactor;
  const expectedIndex = Math.min(1.2, oldRating / 1600);

  const rawDelta = Math.round(K_FACTOR * (performanceIndex - expectedIndex));
  const delta = rawDelta >= 0 ? Math.max(5, rawDelta) : rawDelta;
  const newRating = Math.max(1000, oldRating + delta);

  let tier = 'Specialist';
  if (newRating >= 2100) tier = 'Grandmaster';
  else if (newRating >= 1900) tier = 'Master';
  else if (newRating >= 1700) tier = 'Knight';

  return {
    oldRating,
    newRating,
    delta,
    accuracyPercentage: Math.round(accuracy * 100),
    timeEfficiencyBonusPercentage: Math.round(timeEfficiencyBonus * 100),
    performanceIndex: performanceIndex.toFixed(2),
    tier
  };
};
