import { atom } from 'jotai';

// project management — list of {id, name, createdAt, updatedAt, lastBackedUpAt}
export const projectListAtom = atom([]);
// full project object currently open, null when no project is active
export const activeProjectAtom = atom(null);

export const activeChapterIdStore = atom('what-is-scifr');
export const scatterNodeSizeStore = atom(8);
export const scatterIsInteractiveStore = atom(true);
export const scatterColorSchemeStore = atom('nivo');
export const scatterLegendPositionStore = atom('bottom-right');
export const scatterLegendOffsetXStore = atom(120);
export const scatterLegendOffsetYStore = atom(0);
