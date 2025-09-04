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
        <div className="absolute bottom-11 left-4 right-4 bg-white bg-opacity-95 p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center mb-2">
                <span className="text-lg font-bold text-gray-800">{config.title}</span>
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
            <div className="mt-3 text-xs text-gray-400 text-center">
                <span>Gemaakt door </span>
                <a href="https://ma.rtijn.org/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">Martijn van Exel</a>
                <span> </span>
                <a 
                    href="https://github.com/mvexel/nl-rail-history-map" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors ml-1"
                    title="View source on GitHub"
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                </a>
                <span> · Data afkomstig van de </span>
                <a href="https://data.overheid.nl/en/dataset/33110-historische-spoorwegen#metadata" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">Rijksdienst voor het Cultureel Erfgoed</a>
            </div>
        </div>
    );
};

export default TimeSlider;
