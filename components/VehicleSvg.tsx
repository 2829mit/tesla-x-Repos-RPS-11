import React from 'react';
import type { PaintOption, WheelOption } from '../types';

interface VehicleSvgProps extends React.SVGProps<SVGSVGElement> {
  paint: PaintOption;
  wheels: WheelOption;
}

const VehicleSvg: React.FC<VehicleSvgProps> = ({ paint, wheels, ...props }) => {
  const paintLayers = [
    { id: 'stealth-grey', fill: '#5C5D5F' },
    { id: 'pearl-white', fill: '#E5E7EB' },
    { id: 'diamond-black', fill: '#111827' },
    { id: 'ultra-red', fill: '#BF1E2E' },
  ];

  const wheelLayers = ['gemini', 'induction'];

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" {...props}>
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="5" floodColor="#000" floodOpacity="0.2" />
        </filter>
      </defs>
      
      {/* Base car shadow */}
      <path d="M120 400 Q400 380 680 400 L660 410 Q400 395 140 410 Z" fill="#000000" opacity="0.1" />

      <g id="vehicle-body" style={{ filter: 'url(#shadow)' }}>
        {/* Paint layers */}
        {paintLayers.map(layer => (
          <g key={layer.id} id={`paint-${layer.id}`} style={{ display: paint.id === layer.id ? 'block' : 'none' }}>
            <path
              d="M150,380 C 50,380 50,250 150,250 L 250,250 L 300,200 L 500,200 L 550,250 L 650,250 C 750,250 750,380 650,380 Z"
              fill={layer.fill}
              stroke="#1F2937"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Windows */}
        <g id="windows" fill="#60A5FA" opacity="0.5" stroke="#1F2937" strokeWidth="2">
          <path d="M310,210 L 320,245 L 480,245 L 490,210 Z" />
          <path d="M260,250 L 315,250 L 315,205 L 280,205 Q 260,210 260,250 Z" />
          <path d="M540,250 L 485,250 L 485,205 L 520,205 Q 540,210 540,250 Z" />
        </g>
        
        {/* Lights */}
        <g id="lights">
            <path d="M150,280 L120,280 Q 110,290 120,300 L150,300Z" fill="#FBBF24"/>
            <path d="M650,280 L680,280 Q 690,290 680,300 L650,300Z" fill="#F87171"/>
        </g>
        
        {/* Wheels */}
        <g id="wheels-gemini" style={{ display: wheels.id === 'gemini' ? 'block' : 'none' }} fill="#9CA3AF" stroke="#374151" strokeWidth="2">
            <circle cx="220" cy="360" r="40" />
            <circle cx="220" cy="360" r="20" fill="#E5E7EB"/>
            <circle cx="580" cy="360" r="40" />
            <circle cx="580" cy="360" r="20" fill="#E5E7EB"/>
        </g>

        <g id="wheels-induction" style={{ display: wheels.id === 'induction' ? 'block' : 'none' }} fill="#374151" stroke="#111827" strokeWidth="2">
            <circle cx="220" cy="360" r="42" />
            <circle cx="580" cy="360" r="42" />
            {/* Simple spokes for induction wheels */}
            <g stroke="#6B7280" strokeWidth="4">
                <line x1="220" y1="328" x2="220" y2="392" />
                <line x1="188" y1="360" x2="252" y2="360" />
                <line x1="580" y1="328" x2="580" y2="392" />
                <line x1="548" y1="360" x2="612" y2="360" />
            </g>
            <circle cx="220" cy="360" r="10" fill="#4B5563"/>
            <circle cx="580" cy="360" r="10" fill="#4B5563"/>
        </g>
      </g>
    </svg>
  );
};

export default VehicleSvg;