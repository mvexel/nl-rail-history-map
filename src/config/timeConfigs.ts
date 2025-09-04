import { type TimeFilterOptions } from '../hooks/useTimeFilter';

export const RAILWAY_TIME_CONFIG: TimeFilterOptions = {
    fieldConfig: {
        startField: 'opening',
        endField: 'staking_personen_vervoer',
        endFieldIndicator: '9999-12-31T01:00:00+01:00'
    },
    sliderConfig: {
        title: 'Nederlandse Spoorwegen door de jaren heen',
        yearLabel: 'Jaar:',
        playTooltip: 'Animatie afspelen',
        pauseTooltip: 'Animatie pauzeren',
        statusTemplate: 'Je ziet {count} spoorlijnen die op {date} in gebruik waren',
        presentLabel: 'Heden',
        loadingText: 'Kaart laden...',
        errorText: 'Fout bij laden GeoJSON: {error}'
    }
};

// Example configuration for other datasets:

export const MUSEUM_TIME_CONFIG: TimeFilterOptions = {
    fieldConfig: {
        startField: 'founding_date',
        endField: 'closing_date',
        endFieldIndicator: undefined // No special indicator for ongoing museums
    },
    sliderConfig: {
        title: 'Museum Tijdlijn',
        yearLabel: 'Jaar:',
        playTooltip: 'Animatie afspelen',
        pauseTooltip: 'Animatie pauzeren',
        statusTemplate: 'Toont {count} musea actief in {date}',
        presentLabel: 'Heden',
        loadingText: 'Musea laden...',
        errorText: 'Fout bij laden museum data: {error}'
    }
};

export const BUILDING_TIME_CONFIG: TimeFilterOptions = {
    fieldConfig: {
        startField: 'construction_start',
        endField: 'demolition_date',
        endFieldIndicator: undefined
    },
    sliderConfig: {
        title: 'Gebouw Tijdlijn',
        yearLabel: 'Jaar:',
        playTooltip: 'Animatie afspelen',
        pauseTooltip: 'Animatie pauzeren',
        statusTemplate: 'Toont {count} gebouwen staand in {date}',
        presentLabel: 'Heden',
        loadingText: 'Gebouwen laden...',
        errorText: 'Fout bij laden gebouw data: {error}'
    }
};
