import React, { useState, useEffect } from 'react';
import type { PaintOption, TrimOption, AccessoryPackOption, TankOption } from '../types';

interface CarVisualizerProps {
  paint: PaintOption | null;
  trim: TrimOption | null;
  tank: TankOption['id'] | null;
  packs: AccessoryPackOption[];
  visualizerView: 'car' | 'wheels';
}

const wheelsViewImageUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png';

const CarVisualizer: React.FC<CarVisualizerProps> = ({ paint, trim, tank, packs, visualizerView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const getImageUrl = (): string | string[] => {
    const hasFirePack = packs.some(p => p.id === 'fire-extinguisher-pack');
    const hasCrashPack = packs.some(p => p.id === 'crash-barrier-pack');
    const isSmallTank = tank === '22kl' || tank === '30kl';
    const isLargeTank = tank === '45kl' || tank === '60kl';
    const isDuWithoutRfid = trim?.id === 'rwd';
    const isDuWith1Rfid = trim?.id === 'lr';
    const isDuWith2Rfid = trim?.id === 'lr-awd';
    const s3BaseUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/';

    // Tank: Large (45KL, 60KL)
    if (isLargeTank) {
      // With Dispensing Unit
      if (trim) {
        // DU: 2 RFID
        if (isDuWith2Rfid) {
          if (hasFirePack && hasCrashPack) return `${s3BaseUrl}28.png`;
          if (hasCrashPack) return `${s3BaseUrl}27.png`;
          if (hasFirePack) return `${s3BaseUrl}26.png`;
          return `${s3BaseUrl}25.png`;
        }
        // DU: 1 RFID
        if (isDuWith1Rfid) {
          if (hasFirePack && hasCrashPack) return `${s3BaseUrl}24.png`;
          if (hasCrashPack) return `${s3BaseUrl}23.png`;
          if (hasFirePack) return `${s3BaseUrl}22.png`;
          return `${s3BaseUrl}21.png`;
        }
        // DU: Without RFID
        if (isDuWithoutRfid) {
          if (hasFirePack && hasCrashPack) return `${s3BaseUrl}20.png`;
          if (hasCrashPack) return `${s3BaseUrl}19.png`;
          if (hasFirePack) return `${s3BaseUrl}18.png`;
          return `${s3BaseUrl}17.png`;
        }
      }
      // Without Dispensing Unit
      else {
        if (hasFirePack && hasCrashPack) return `${s3BaseUrl}31.png`;
        if (hasFirePack) return `${s3BaseUrl}31.png`;
        if (hasCrashPack) return `${s3BaseUrl}30.png`;
        return `${s3BaseUrl}29.png`;
      }
    }

    // Tank: Small (22KL, 30KL)
    if (isSmallTank) {
      // With Dispensing Unit
      if (trim) {
        // DU: 2 RFID
        if (isDuWith2Rfid) {
          if (hasFirePack && hasCrashPack) return `${s3BaseUrl}12.png`;
          if (hasCrashPack) return `${s3BaseUrl}11.png`;
          if (hasFirePack) return `${s3BaseUrl}10.png`;
          return `${s3BaseUrl}9.png`;
        }
        // DU: 1 RFID
        if (isDuWith1Rfid) {
          if (hasFirePack && hasCrashPack) return `${s3BaseUrl}8.png`;
          if (hasCrashPack) return `${s3BaseUrl}7.png`;
          if (hasFirePack) return `${s3BaseUrl}6.png`;
          return `${s3BaseUrl}5.png`;
        }
        // DU: Without RFID
        if (isDuWithoutRfid) {
          if (hasFirePack && hasCrashPack) return `${s3BaseUrl}4.png`;
          if (hasCrashPack) return `${s3BaseUrl}3.png`;
          if (hasFirePack) return `${s3BaseUrl}2.png`;
          return `${s3BaseUrl}1.png`;
        }
      }
      // Without Dispensing Unit
      else {
        if (hasFirePack && hasCrashPack) return `${s3BaseUrl}16.png`;
        if (hasCrashPack) return `${s3BaseUrl}14.png`;
        if (hasFirePack) return `${s3BaseUrl}15.png`;
        return `${s3BaseUrl}13.png`;
      }
    }

    // General case for paint (if uncommented in configurator)
    if (paint && trim) {
      return paint.imageUrls[trim.id] || paint.imageUrls['p-awd'];
    }

    // Default image if no specific configuration matches
    return `${s3BaseUrl}13.png`;
  };
  
  const imageUrl = getImageUrl();
  const finalImageUrls = visualizerView === 'wheels' ? wheelsViewImageUrl : imageUrl;
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [finalImageUrls]);

  const images = Array.isArray(finalImageUrls) ? finalImageUrls : (finalImageUrls ? [finalImageUrls] : []);

  const targetImageUrl = images[currentIndex] || '';
  const [renderedImageUrl, setRenderedImageUrl] = useState(targetImageUrl);

  useEffect(() => {
    if (targetImageUrl && targetImageUrl !== renderedImageUrl) {
      const img = new Image();
      img.src = targetImageUrl;
      img.onload = () => {
        setRenderedImageUrl(targetImageUrl);
      };
    } else if (!targetImageUrl && renderedImageUrl) {
      // Handles clearing the image when selections are removed
      setRenderedImageUrl('');
    }
  }, [targetImageUrl, renderedImageUrl]);
  
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (!renderedImageUrl) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden group">
        <div className="text-center text-gray-500 p-8">
          <h2 className="text-2xl font-semibold mb-2">Your Vehicle Preview</h2>
          <p>Select options on the right to see your configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden group">
      <img
        key={renderedImageUrl}
        src={renderedImageUrl}
        alt={`Model Y in ${paint?.name ?? 'your configuration'}`}
        className="object-contain w-5/6 h-5/6 animate-fade-in"
      />
      {images.length > 1 && (
        <>
          {/* Left Arrow */}
          <button 
            onClick={goToPrevious}
            className="absolute top-1/2 left-5 -translate-y-1/2 bg-gray-700 bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus:outline-none z-10"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          {/* Right Arrow */}
          <button 
            onClick={goToNext}
            className="absolute top-1/2 right-5 -translate-y-1/2 bg-gray-700 bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus:outline-none z-10"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentIndex === slideIndex ? 'bg-white' : 'bg-gray-400 bg-opacity-50 hover:bg-white'}`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarVisualizer;