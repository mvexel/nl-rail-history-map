import { useState, useMemo, useEffect, useRef } from 'react';
import type { Feature } from 'geojson';
import { length } from '@turf/length';

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
    statusTemplate: string; // Template string like "Toont {count} items actief op {date}"
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
            return { minDate: new Date('1950-01-01'), maxDate: new Date() };
        }

        let min = new Date();
        let max = new Date('1800-01-01');

        data.forEach((item) => {
            const startStr = item.properties?.[options.fieldConfig.startField];
            if (startStr) {
                const startDate = new Date(startStr);
                if (!isNaN(startDate.getTime())) {
                    if (startDate < min) {
                        min = startDate;
                    }
                    if (startDate > max) {
                        max = startDate;
                    }
                }
            }
        });

        return { minDate: min, maxDate: max };
    }, [data, options.fieldConfig]);

    useEffect(() => {
        if (minDate && !currentTime) {
            setCurrentTime(minDate);
        }
    }, [minDate]);

    // Use minDate as fallback for currentTime
    const effectiveCurrentTime = currentTime || minDate;

    // Animation logic
    useEffect(() => {
        if (isPlaying && effectiveCurrentTime) {
            animationRef.current = setInterval(() => {
                setCurrentTime(prevTime => {
                    const current = prevTime || minDate;
                    const nextTime = new Date(current.getTime() + (365 * 24 * 60 * 60 * 1000));
                    if (nextTime >= maxDate) {
                        setIsPlaying(false);
                        return maxDate;
                    }
                    return nextTime;
                });
            }, 200);
        } else {
            if (animationRef.current) {
                clearInterval(animationRef.current);
                animationRef.current = null;
            }
        }

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [isPlaying, maxDate, effectiveCurrentTime, minDate]);

    const { filteredData, totalLength } = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0 || !effectiveCurrentTime) {
            return { filteredData: [], totalLength: 0 };
        }

        const filtered = data.filter((item) => {
            const startStr = item.properties?.[options.fieldConfig.startField];
            const endStr = item.properties?.[options.fieldConfig.endField];

            if (!startStr) return false;

            const start = new Date(startStr);
            if (isNaN(start.getTime())) return false;

            const end = endStr === options.fieldConfig.endFieldIndicator
                ? new Date()
                : endStr ? new Date(endStr) : new Date();

            if (isNaN(end.getTime())) return false;

            return effectiveCurrentTime >= start && effectiveCurrentTime <= end;
        });

        // Calculate total length using Turf.js
        const totalKm = filtered.reduce((total, feature) => {
            return total + length(feature, { units: 'kilometers' });
        }, 0);

        return { filteredData: filtered, totalLength: Math.round(totalKm) };
    }, [data, effectiveCurrentTime, options.fieldConfig]);

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
