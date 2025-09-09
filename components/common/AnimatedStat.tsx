import React, { useState, useEffect } from 'react';

interface AnimatedStatProps {
    value: number;
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({ value }) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
        const duration = 1000; // Animation duration in ms
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsedTime = now - startTime;
            
            if (elapsedTime >= duration) {
                setCurrentValue(value);
                return;
            }

            const progress = elapsedTime / duration;
            // Ease-out function
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            setCurrentValue(Math.round(easedProgress * value));
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
        
    }, [value]);

    return <>{currentValue.toLocaleString()}</>;
};

export default AnimatedStat;