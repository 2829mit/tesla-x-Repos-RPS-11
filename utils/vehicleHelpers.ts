
import { CONSUMPTION_OPTIONS } from '../constants';
import { TankOption, SafetyUpgradeOption } from '../types';

export const getRecommendedTankId = (consumption: string): TankOption['id'] => {
  const index = CONSUMPTION_OPTIONS.indexOf(consumption);
  if (index === 0) return '22kl'; // 50-100KL
  if (index === 1) return '30kl'; // 100-200KL
  if (index === 2) return '45kl'; // 200-300KL
  if (index === 3) return '60kl'; // 300-1000KL
  return '22kl';
};

export const getVehicleImageUrl = (
  tank: TankOption['id'],
  safetyUpgrades: SafetyUpgradeOption[]
): string => {
    const isSmallTank = tank === '22kl' || tank === '30kl';
    const isLargeTank = tank === '45kl' || tank === '60kl';
    
    // Default to Standard Visuals (No RFID logic anymore)
    let baseIndex = 13; // Default fallback

    // Determine base index based on Tank Size
    if (isSmallTank) {
      baseIndex = 13;      // Default Visual
    } else if (isLargeTank) {
      baseIndex = 29;      // Default Visual
    }

    // Apply offsets based on Safety Upgrades
    const hasFireSystem = safetyUpgrades.some(u => u.id === 'fire-suppression');
    const hasBarrier = safetyUpgrades.some(u => u.id === 'crash-barrier');

    // DEFAULT MAPPING (Matches Standard Visuals: Base 13, 29)
    // Offset 1 (+1) -> Crash Barrier
    // Offset 2 (+2) -> Fire Suppression System
    let barrierOffset = 1;
    let fireOffset = 2;

    let offset = 0;
    if (hasBarrier && !hasFireSystem) {
      offset = barrierOffset; 
    } else if (!hasBarrier && hasFireSystem) {
      offset = fireOffset; 
    } else if (hasBarrier && hasFireSystem) {
      offset = 3; 
    }

    const imageIndex = baseIndex + offset;

    const s3BaseUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/';
    return `${s3BaseUrl}${imageIndex}.png`;
};

export const getSafetyImage = (
  tank: TankOption['id'],
  upgradeId: string
): string => {
    // Simulate a configuration where only this upgrade is selected to get its thumbnail
    const dummyUpgrade = { id: upgradeId } as SafetyUpgradeOption;
    return getVehicleImageUrl(tank, [dummyUpgrade]);
};
