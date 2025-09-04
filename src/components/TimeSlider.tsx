import { type FC } from 'react';

interface TimeSliderProps {
    currentTime: Date;
    isPlaying: boolean;
    minDate: Date;
    maxDate: Date;
    itemCount: number;
    totalLength?: number;
    onTimeChange: (date: Date) => void;
    onTogglePlay: () => void;
    config: {
        title: string;
        yearLabel: string;
        playTooltip: string;
        pauseTooltip: string;
        statusTemplate: string;
        presentLabel: string;
    };
    locale?: string;
}

const TimeSlider: FC<TimeSliderProps> = ({
    currentTime,
    isPlaying,
    minDate,
    maxDate,
    itemCount,
    totalLength,
    onTimeChange,
    onTogglePlay,
    config,
    locale = 'nl-NL'
}) => {
    // Ensure currentTime is within the valid range
    const validMinTime = Math.min(minDate.getTime(), maxDate.getTime());
    const validMaxTime = Math.max(minDate.getTime(), maxDate.getTime());
    const clampedCurrentTime = new Date(Math.max(validMinTime, Math.min(validMaxTime, currentTime.getTime())));
    const formatDate = (date: Date) => {
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const interpolateStatus = (template: string, count: number, date: string, lengthKm?: number) => {
        return template
            .replace('{count}', count.toString())
            .replace('{date}', date)
            .replace('{length_km}', lengthKm?.toLocaleString() || '0');
    };

    return (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{config.title}</span>
                <span className="text-xs text-gray-500 ml-4">
                    {Math.min(minDate.getFullYear(), maxDate.getFullYear())} - {maxDate.getFullYear() === new Date().getFullYear() ? config.presentLabel : Math.max(minDate.getFullYear(), maxDate.getFullYear())}
                </span>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 min-w-[60px]">{config.yearLabel}</span>
                <input
                    type="range"
                    min={Math.min(minDate.getTime(), maxDate.getTime())}
                    max={Math.max(minDate.getTime(), maxDate.getTime())}
                    value={clampedCurrentTime.getTime()}
                    onChange={(e) => onTimeChange(new Date(parseInt(e.target.value)))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <button
                    onClick={onTogglePlay}
                    className={`flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200 shadow-md ${isPlaying ? 'playing-button' : ''}`}
                    title={isPlaying ? config.pauseTooltip : config.playTooltip}
                >
                    {isPlaying ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 4a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H6zM12 4a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 5.14v9.72a1 1 0 001.555.832l6-4.5a1 1 0 000-1.664l-6-4.5A1 1 0 008 5.14z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
                <span className="text-sm font-semibold text-blue-600 min-w-[80px]">
                    {clampedCurrentTime.getFullYear()}
                </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
                {interpolateStatus(config.statusTemplate, itemCount, formatDate(clampedCurrentTime), totalLength)}
            </div>
        </div>
    );
};

export default TimeSlider;
