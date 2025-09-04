import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { Feature } from 'geojson';
import { length } from '@turf/length';
import { parseDate, isValidDate } from '../utils';
import { ANIMATION_CONSTANTS } from '../constants';

export interface TimeFieldConfig {
    startField: string;
    endField: string;
    endFieldIndicator?: string; // Value that indicates "present" or "ongoing"
}

export interface TimeSliderConfig {
    title: string;
    yearLabel: string;
    playTooltip: string;
    pauseTooltip: string;
    statusTemplate: `${string}{count}${string}{date}${string}` | `${string}{count}${string}{date}${string}{length_km}${string}`;
    presentLabel: string;
    loadingText: string;
    errorText: string;
}

export interface TimeFilterOptions {
    fieldConfig: TimeFieldConfig;
    sliderConfig: TimeSliderConfig;
}

export function useTimeFilter(
    data: Feature[] | null,
    options: TimeFilterOptions
) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const animationRef = useRef<number | null>(null);

    const { minDate, maxDate } = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return { minDate: new Date('1850-01-01'), maxDate: new Date() };
        }

        const startDates = data
            .map(item => parseDate(item.properties?.[options.fieldConfig.startField]))
            .filter(Boolean);

        if (startDates.length === 0) {
            return { minDate: new Date('1850-01-01'), maxDate: new Date() };
        }

        const minDate = new Date(Math.min(...startDates.map(d => d?.getTime() || 0)));
        const maxDate = new Date();

        return { minDate, maxDate };
    }, [data, options.fieldConfig]);

    useEffect(() => {
        if (minDate && !currentTime) {
            setCurrentTime(minDate);
        }
    }, [minDate, currentTime]);

    // Use minDate as fallback for currentTime
    const effectiveCurrentTime = currentTime || minDate;

    // Animation logic
    useEffect(() => {
        if (isPlaying && effectiveCurrentTime) {
            let lastTime = 0;
            const animate = (timestamp: number) => {
                if (timestamp - lastTime >= ANIMATION_CONSTANTS.FRAME_INTERVAL_MS) {
                    setCurrentTime(prevTime => {
                        const current = prevTime || minDate;
                        const nextTime = new Date(current.getTime() + ANIMATION_CONSTANTS.YEAR_INCREMENT_MS);
                        if (nextTime >= maxDate) {
                            setIsPlaying(false);
                            return maxDate;
                        }
                        return nextTime;
                    });
                    lastTime = timestamp;
                }
                if (isPlaying) {
                    animationRef.current = requestAnimationFrame(animate);
                }
            };
            animationRef.current = requestAnimationFrame(animate);
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, maxDate, effectiveCurrentTime, minDate]);

    const calculateLength = useCallback((features: Feature[]) => {
        return features.reduce((total, feature) => {
            return total + length(feature, { units: 'kilometers' });
        }, 0);
    }, []);

    const filteredData = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0 || !effectiveCurrentTime) {
            return [];
        }

        return data.filter((item) => {
            const start = parseDate(item.properties?.[options.fieldConfig.startField]);
            if (!start) return false;

            const endStr = item.properties?.[options.fieldConfig.endField];
            const end = endStr === options.fieldConfig.endFieldIndicator
                ? new Date()
                : parseDate(endStr) || new Date();

            if (!isValidDate(end)) return false;

            return effectiveCurrentTime >= start && effectiveCurrentTime <= end;
        });
    }, [data, effectiveCurrentTime, options.fieldConfig]);

    const totalLength = useMemo(() => {
        return Math.round(calculateLength(filteredData));
    }, [filteredData, calculateLength]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleTimeChange = (newTime: Date) => {
        setCurrentTime(newTime);
        if (isPlaying) setIsPlaying(false);
    };

    return {
        currentTime: effectiveCurrentTime || new Date(),
        isPlaying,
        minDate: minDate || new Date(),
        maxDate: maxDate || new Date(),
        filteredData,
        totalLength,
        togglePlay,
        handleTimeChange,
        config: options.sliderConfig
    };
}
