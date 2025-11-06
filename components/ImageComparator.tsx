import React, { useState, useRef, useEffect, useCallback } from "react";

interface ImageComparatorProps {
  originalImageUrl: string;
  resultImageUrl: string;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({
  originalImageUrl,
  resultImageUrl,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.cancelable) e.preventDefault();
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  // Calculate container height based on image dimensions (desktop only)
  useEffect(() => {
    const updateHeight = () => {
      if (
        window.innerWidth < 768 ||
        !imageRef.current ||
        !containerRef.current
      ) {
        setContainerHeight(null);
        return;
      }

      const img = imageRef.current;
      if (img.naturalWidth && img.naturalHeight) {
        const containerWidth = containerRef.current.offsetWidth;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const calculatedHeight = containerWidth / aspectRatio;
        const maxHeight =
          window.innerWidth >= 1024
            ? window.innerHeight * 0.8
            : window.innerHeight * 0.75;
        const minHeight = 500;
        const finalHeight = Math.max(
          minHeight,
          Math.min(calculatedHeight, maxHeight)
        );
        setContainerHeight(finalHeight);
      }
    };

    const img = imageRef.current;
    if (img) {
      if (img.complete) {
        updateHeight();
      } else {
        img.addEventListener("load", updateHeight);
        return () => img.removeEventListener("load", updateHeight);
      }
    }

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [originalImageUrl, resultImageUrl]);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleTouchEnd = () => setIsDragging(false);
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="glass border-2 border-cyan/30 p-4 md:p-6">
      {/* Labels */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan/50 rounded-full"></div>
          <span className="text-xs md:text-sm text-cyan/70 uppercase font-bold">
            Original
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-lime/50 rounded-full"></div>
          <span className="text-xs md:text-sm text-lime/70 uppercase font-bold">
            Edited
          </span>
        </div>
      </div>

      {/* Comparison Slider */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square md:aspect-auto md:min-h-[500px] md:max-h-[75vh] lg:max-h-[80vh] mx-auto overflow-hidden group border-2 border-cyan/50 select-none cursor-col-resize rounded-sm"
        style={containerHeight ? { height: `${containerHeight}px` } : undefined}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <img
          ref={imageRef}
          src={originalImageUrl}
          alt="Original"
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none bg-dark-bg/20"
          draggable={false}
        />
        <img
          src={resultImageUrl}
          alt="Result"
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none bg-dark-bg/20"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          draggable={false}
        />
        <div
          className="absolute top-0 h-full w-1 bg-cyan pointer-events-none shadow-glow-cyan"
          style={{
            left: `calc(${sliderPosition}% - 2px)`,
            transition: isDragging ? "none" : undefined,
            willChange: isDragging ? "left" : undefined,
          }}
        >
          <div
            className={`absolute top-1/2 -translate-y-1/2 -left-6 md:-left-8 bg-cyan text-dark-bg w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 border-dark-bg text-2xl md:text-3xl font-bold rounded-full shadow-glow-cyan ${
              !isDragging
                ? "transition-transform duration-200 hover:scale-110"
                : ""
            }`}
          >
            &lt;&gt;
          </div>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs md:text-sm text-cyan/50 text-center mt-4 uppercase">
        Drag slider to compare • Click and drag anywhere
      </p>
    </div>
  );
};

export default ImageComparator;
