import React, { useState, useEffect } from 'react';
import type { PaintOption, TrimOption } from '../types';

interface CarVisualizerProps {
  paint: PaintOption;
  trim: TrimOption;
  visualizerView: 'car' | 'wheels';
}

const wheelsViewImageUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png';

const CarVisualizer: React.FC<CarVisualizerProps> = ({ paint, trim, visualizerView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const carImageUrls = paint.imageUrls[trim.id] || paint.imageUrls['p-awd'];
  const finalImageUrls = visualizerView === 'wheels' ? wheelsViewImageUrl : carImageUrls;

  useEffect(() => {
    setCurrentIndex(0);
  }, [finalImageUrls]);

  const images = Array.isArray(finalImageUrls) ? finalImageUrls : [finalImageUrls];
  
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

  const currentImageUrl = images[currentIndex];

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden group">
      <img
        key={currentImageUrl}
        src={currentImageUrl}
        alt={`Model Y in ${paint.name}`}
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