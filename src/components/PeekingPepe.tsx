import React, { useState, useEffect, useRef } from 'react';

import pepe from './pepe.png';

interface PeekingPepeProps {
  children: React.ReactNode;
}

const PeekingPepe = ({ children }: PeekingPepeProps) => {
  const [showPepe, setShowPepe] = useState(false);
  const [pepePosition, setPepePosition] = useState('0%');
  const [pepeOpacity, setPepeOpacity] = useState(0); // Added state for controlling opacity
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const peekPepe = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const pepeWidth = 100; // Assuming Pepe's width is 100px
        const maxPosition = containerWidth - pepeWidth;
        const randomPosition = Math.floor(Math.random() * maxPosition);
        setPepePosition(`${randomPosition}px`);

        setShowPepe(true);
        setPepeOpacity(0); // Reset opacity to 0 before showing Pepe
        setTimeout(() => setPepeOpacity(1), 100); // Gradually show Pepe by changing opacity
        console.log("show pepe");
        setTimeout(() => {
          setPepeOpacity(0); // Gradually hide Pepe by changing opacity
          setTimeout(() => {
            setShowPepe(false);
            // Schedule next peek
            setTimeout(peekPepe, Math.random() * (60000 - 10000) + 10000); // Pepe peeks at a random time between 10 and 60 seconds
          }, 2000); // Wait for fade-out effect to finish before hiding Pepe
        }, 2000); // Pepe will peek for 2 seconds, then start fading out
      }
    };

    // Initial call to start the sequence
    setTimeout(peekPepe, Math.random() * (60000 - 10000) + 10000);

    // Cleanup function to prevent memory leaks or unexpected behavior
    return () => {
      // Since there's no interval or timeout ID to clear, we rely on component unmount logic
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {showPepe && (
          <img style={{
            position: 'absolute',
            top: '-60px', // Adjusted to match the top of the child component
            left: pepePosition, // Pepe appears at a random position on the x axis
            width: '80px', // Adjust based on your pepe image size
            height: '60px', // Adjust based on your pepe image size
            opacity: pepeOpacity, // Use state-controlled opacity for the fade-in and fade-out effects
            transition: 'opacity 2s ease-in-out', // Adjust transition to control the fade-in and fade-out effects
          }} src={pepe} alt="Peeking Pepe" />
      )}
      {children}
    </div>
  );
};

export default PeekingPepe;

