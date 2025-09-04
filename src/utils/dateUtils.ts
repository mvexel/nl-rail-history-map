export const isValidDate = (date: Date): boolean => !isNaN(date.getTime());

export const parseDate = (dateStr: string | undefined): Date | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isValidDate(date) ? date : null;
};

export const clampDate = (date: Date, min: Date, max: Date): Date => {
    const validMinTime = Math.min(min.getTime(), max.getTime());
    const validMaxTime = Math.max(min.getTime(), max.getTime());
    return new Date(Math.max(validMinTime, Math.min(validMaxTime, date.getTime())));
};

export const formatDate = (date: Date, locale = 'nl-NL'): string => {
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const getDateRange = (dates: (Date | null)[]): { min: Date; max: Date } => {
    const validDates = dates.filter((d): d is Date => d !== null && isValidDate(d));
    
    if (validDates.length === 0) {
        return { min: new Date('1850-01-01'), max: new Date() };
    }

    const minTime = Math.min(...validDates.map(d => d.getTime()));
    const maxTime = Math.max(...validDates.map(d => d.getTime()));
    
    const now = new Date();
    const cappedMaxTime = Math.min(maxTime, now.getTime());

    return {
        min: new Date(minTime),
        max: new Date(cappedMaxTime)
    };
};