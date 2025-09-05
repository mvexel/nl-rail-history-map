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

