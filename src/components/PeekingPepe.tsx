import React, { useState, useEffect, useRef } from 'react';

// @ts-ignore
import pepe from './pepe.png';
// @ts-ignore
import chad from './chad.png';
// @ts-ignore
import harold from './harold.png';
// @ts-ignore
import troll from './troll.png';

interface PeekingPepeProps {
    children: React.ReactNode;
    averagePeekInterval: number; // in milliseconds
    standardDeviation: number;
    peekDuration: number;
}

const PeekingPepe = ({ children, averagePeekInterval, standardDeviation, peekDuration }: PeekingPepeProps) => {
    const [showPepe, setShowPepe] = useState(false);
    const [pepePosition, setPepePosition] = useState('100px');
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);


    const peekPepe = () => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const pepeWidth = 100; // Assuming Pepe's width is 100px
        const maxPosition = containerWidth - pepeWidth;
        const randomPosition = Math.floor(Math.random() * maxPosition);
        setPepePosition(`${randomPosition}px`);
        setShowPepe(true);

        setTimeout(() => setShowPepe(false), peekDuration); // Pepe will peek for 2 seconds
    };

    useEffect(() => {
        const deviation = Math.random() * standardDeviation * 2 - standardDeviation;
        const timeoutValue = averagePeekInterval + deviation;
        const timerId = setTimeout(peekPepe, timeoutValue);
        return () => clearTimeout(timerId);
    }, [showPepe]);

    useEffect(() => {
        if (!imageRef.current) return;

        if (showPepe) {
            requestAnimationFrame(() => {
                if (imageRef.current) imageRef.current.style.top = '-60px'; // Move into view to trigger the transition
            });
        } else {
            requestAnimationFrame(() => {
                if (imageRef.current) imageRef.current.style.top = '0px'; // Move into view to trigger the transition
            });
        }

        return () => {};
    }, [showPepe]);

    const [image, setImage] = useState(pepe);

    useEffect(() => {
        const images = [pepe, chad, harold, troll];
        const randomIndex = Math.floor(Math.random() * images.length);
        setImage(images[randomIndex]);
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            {true && (
                <img ref={imageRef} style={{
                    position: 'absolute',
                    top: '0px',
                    left: pepePosition,
                    // width: '80px',
                    height: '60px',
                    transition: 'top 2s',
                }} src={image} alt="Peeking Pepe" />
            )}
            {children}
        </div>
    );
};

export default PeekingPepe;
