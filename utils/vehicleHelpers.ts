
import { CONSUMPTION_OPTIONS } from '../constants';
import { TrimOption, TankOption, SafetyUpgradeOption } from '../types';

export const getRecommendedTankId = (consumption: string): TankOption['id'] => {
  const index = CONSUMPTION_OPTIONS.indexOf(consumption);
  if (index === 0) return '22kl'; // 50-100KL
  if (index === 1) return '30kl'; // 100-200KL
  if (index === 2) return '45kl'; // 200-300KL
  if (index === 3) return '60kl'; // 300-1000KL
  return '22kl';
};

export const getVehicleImageUrl = (
  trim: TrimOption | null,
  tank: TankOption['id'],
  safetyUpgrades: SafetyUpgradeOption[]
): string => {
    const isSmallTank = tank === '22kl' || tank === '30kl';
    const isLargeTank = tank === '45kl' || tank === '60kl';
    
    // Handle null trim (default to standard look)
    const isDuWithoutRfid = !trim || trim.id === 'rwd'; // 3 RFID Nozzle (Default)
    const isDuWith1Rfid = trim?.id === 'lr';    // 1 RFID Nozzle
    const isDuWith2Rfid = trim?.id === 'lr-awd'; // 2 RFID Nozzle
    
    // Check for IDs matching the new Sane Constants
    const hasFireSystem = safetyUpgrades.some(u => u.id === 'fire-suppression');
    const hasBarrier = safetyUpgrades.some(u => u.id === 'crash-barrier');

    let baseIndex = 13; // Default fallback

    // Determine base index based on Tank Size and RFID selection
    if (isSmallTank) {
      if (isDuWithoutRfid) baseIndex = 13;     // 3 RFID (Default)
      else if (isDuWith1Rfid) baseIndex = 5;   // 1 RFID
      else if (isDuWith2Rfid) baseIndex = 9;   // 2 RFID
      else baseIndex = 1;                      // Fallback
    } else if (isLargeTank) {
      if (isDuWithoutRfid) baseIndex = 29;     // 3 RFID
      else if (isDuWith1Rfid) baseIndex = 21;  // 1 RFID
      else if (isDuWith2Rfid) baseIndex = 25;  // 2 RFID
      else baseIndex = 17;                     // Fallback
    }

    // Apply offsets based on Safety Upgrades
    // Offset 1: Barrier Only (Image ...2.png)
    // Offset 2: Fire Only (Image ...3.png)
    // Offset 3: Both (Image ...4.png)
    
    let offset = 0;
    if (hasBarrier && !hasFireSystem) {
      offset = 1; // Barrier only
    } else if (!hasBarrier && hasFireSystem) {
      offset = 2; // Fire only
    } else if (hasBarrier && hasFireSystem) {
      offset = 3; // Both
    }

    const imageIndex = baseIndex + offset;

    const s3BaseUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/';
    return `${s3BaseUrl}${imageIndex}.png`;
};

export const getSafetyImage = (
  trim: TrimOption | null,
  tank: TankOption['id'],
  upgradeId: string
): string => {
    // Simulate a configuration where only this upgrade is selected to get its thumbnail
    // We pass a dummy upgrade object with the ID
    const dummyUpgrade = { id: upgradeId } as SafetyUpgradeOption;
    return getVehicleImageUrl(trim, tank, [dummyUpgrade]);
};
