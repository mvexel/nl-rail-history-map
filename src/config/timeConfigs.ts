import { type TimeFilterOptions } from '../hooks/useTimeFilter';

interface TimeConfigFactory {
    title: string;
    startField: string;
    endField: string;
    endFieldIndicator?: string;
    itemName: string;
    itemNamePlural: string;
    showLength?: boolean;
}

const createTimeConfig = ({
    title,
    startField,
    endField,
    endFieldIndicator,
    itemName,
    itemNamePlural,
    showLength = false
}: TimeConfigFactory): TimeFilterOptions => ({
    fieldConfig: {
        startField,
        endField,
        endFieldIndicator
    },
    sliderConfig: {
        title,
        yearLabel: 'Jaar:',
        playTooltip: 'Animatie afspelen',
        pauseTooltip: 'Animatie pauzeren',
        statusTemplate: showLength 
            ? `Je ziet {count} ${itemNamePlural} die op {date} in gebruik waren. De lengte van het netwerk was {length_km} kilometer.`
            : `Toont {count} ${itemNamePlural} actief in {date}`,
        presentLabel: 'Heden',
        loadingText: `${itemName} laden...`,
        errorText: `Fout bij laden ${itemName} data: {error}`
    }
});

export const RAILWAY_TIME_CONFIG = createTimeConfig({
    title: 'Nederlandse Spoorwegen door de jaren heen',
    startField: 'opening',
    endField: 'staking_personen_vervoer',
    endFieldIndicator: '9999-12-31T01:00:00+01:00',
    itemName: 'Kaart',
    itemNamePlural: 'spoorlijnen',
    showLength: true
});

export const MUSEUM_TIME_CONFIG = createTimeConfig({
    title: 'Museum Tijdlijn',
    startField: 'founding_date',
    endField: 'closing_date',
    itemName: 'Musea',
    itemNamePlural: 'musea'
});

export const BUILDING_TIME_CONFIG = createTimeConfig({
    title: 'Gebouw Tijdlijn',
    startField: 'construction_start',
    endField: 'demolition_date',
    itemName: 'Gebouwen',
    itemNamePlural: 'gebouwen'
});
