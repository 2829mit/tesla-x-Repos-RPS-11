
import React from 'react';
import type { TankOption, SafetyUpgradeOption } from '../types';
import { getVehicleImageUrl } from '../utils/vehicleHelpers';

interface CarVisualizerProps {
  tank: TankOption['id'];
  safetyUpgrades: SafetyUpgradeOption[];
}

const CarVisualizer: React.FC<CarVisualizerProps> = ({ tank, safetyUpgrades }) => {
  const imageUrl = getVehicleImageUrl(tank, safetyUpgrades);

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
