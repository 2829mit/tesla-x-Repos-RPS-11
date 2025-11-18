
import React from 'react';
import type { TrimOption, TankOption, SafetyUpgradeOption } from '../types';

interface CarVisualizerProps {
  trim: TrimOption;
  tank: TankOption['id'];
  safetyUpgrades: SafetyUpgradeOption[];
}

const CarVisualizer: React.FC<CarVisualizerProps> = ({ trim, tank, safetyUpgrades }) => {
  
  const getImageUrl = (): string => {
    const isSmallTank = tank === '22kl' || tank === '30kl';
    const isLargeTank = tank === '45kl' || tank === '60kl';
    const isDuWithoutRfid = trim.id === 'rwd'; // 3 RFID Nozzle (Default)
    const isDuWith1Rfid = trim.id === 'lr';    // 1 RFID Nozzle
    const isDuWith2Rfid = trim.id === 'lr-awd'; // 2 RFID Nozzle
    
    const hasBarrier = safetyUpgrades.some(u => u.id === 'crash-barrier');
    const hasFireSystem = safetyUpgrades.some(u => u.id === 'fire-suppression');

    let baseIndex = 13; // Default fallback to the requested default image

    // Determine base index based on Tank Size and RFID selection
    // Swapped logic: 3 RFID (Default) now maps to 13 (Small) and 29 (Large)
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
    // Fire System adds 1 (matches image 2.png series)
    // Barrier adds 2 (matches image 3.png series)
    // Both adds 3 (matches image 4.png series)
    let offset = 0;
    if (!hasBarrier && hasFireSystem) {
      offset = 1;
    } else if (hasBarrier && !hasFireSystem) {
      offset = 2;
    } else if (hasBarrier && hasFireSystem) {
      offset = 3;
    }

    const imageIndex = baseIndex + offset;

    const s3BaseUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/';
    return `${s3BaseUrl}${imageIndex}.png`;
  };
  
  const imageUrl = getImageUrl();

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden group">
      <img
        key={imageUrl}
        src={imageUrl}
        alt={`Your configuration`}
        className="object-contain w-5/6 h-5/6 animate-fade-in"
      />
    </div>
  );
};

export default CarVisualizer;
