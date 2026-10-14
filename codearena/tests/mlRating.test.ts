import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calculateNewRating } from '../lib/mlRating';

describe('ML Algorithmic Rating Suite', () => {
  test('calculates correct rating increase for high accuracy and fast completion', () => {
    const result = calculateNewRating({
      oldRating: 1500,
      contestScore: 100,
      timeSpentMinutes: 30,
      totalDurationMinutes: 120
    });

    assert.ok(result.newRating > 1500, 'Rating should increase for 100% accuracy');
    assert.ok(result.delta > 0, 'Delta should be positive');
    assert.strictEqual(result.accuracyPercentage, 100);
    assert.ok(result.timeEfficiencyBonusPercentage > 0, 'Should have positive time efficiency bonus');
  });

  test('calculates rating decrease or penalty for 0% accuracy', () => {
    const result = calculateNewRating({
      oldRating: 1600,
      contestScore: 0,
      timeSpentMinutes: 120,
      totalDurationMinutes: 120
    });

    assert.ok(result.newRating <= 1600, 'Rating should not increase for 0% accuracy');
    assert.ok(result.delta <= 0, 'Delta should be zero or negative');
    assert.strictEqual(result.accuracyPercentage, 0);
  });

  test('assigns appropriate competitive tiers according to rating scale', () => {
    const grandmaster = calculateNewRating({
      oldRating: 2150,
      contestScore: 100,
      timeSpentMinutes: 20,
      totalDurationMinutes: 120
    });
    assert.strictEqual(grandmaster.tier, 'Grandmaster');

    const master = calculateNewRating({
      oldRating: 1920,
      contestScore: 100,
      timeSpentMinutes: 30,
      totalDurationMinutes: 120
    });
    assert.strictEqual(master.tier, 'Master');

    const knight = calculateNewRating({
      oldRating: 1720,
      contestScore: 100,
      timeSpentMinutes: 40,
      totalDurationMinutes: 120
    });
    assert.strictEqual(knight.tier, 'Knight');
  });
});
