import { useAtom } from 'jotai';
import {
  scatterNodeSizeStore,
  scatterIsInteractiveStore,
  scatterColorSchemeStore,
  scatterLegendPositionStore,
  scatterLegendOffsetXStore,
  scatterLegendOffsetYStore,
} from '../store';

export function useSnapshot() {
  const [nodeSize, setNodeSize] = useAtom(scatterNodeSizeStore);
  const [isInteractive, setIsInteractive] = useAtom(scatterIsInteractiveStore);
  const [colorScheme, setColorScheme] = useAtom(scatterColorSchemeStore);
  const [legendPosition, setLegendPosition] = useAtom(scatterLegendPositionStore);
  const [legendOffsetX, setLegendOffsetX] = useAtom(scatterLegendOffsetXStore);
  const [legendOffsetY, setLegendOffsetY] = useAtom(scatterLegendOffsetYStore);

  function capture(data) {
    return {
      data,
      uiState: { nodeSize, isInteractive, colorScheme, legendPosition, legendOffsetX, legendOffsetY },
    };
  }

  function restore(snapshot) {
    if (!snapshot) return null;
    const ui = snapshot.uiState;
    if (ui) {
      if (ui.nodeSize !== undefined) setNodeSize(ui.nodeSize);
      if (ui.isInteractive !== undefined) setIsInteractive(ui.isInteractive);
      if (ui.colorScheme !== undefined) setColorScheme(ui.colorScheme);
      if (ui.legendPosition !== undefined) setLegendPosition(ui.legendPosition);
      if (ui.legendOffsetX !== undefined) setLegendOffsetX(ui.legendOffsetX);
      if (ui.legendOffsetY !== undefined) setLegendOffsetY(ui.legendOffsetY);
    }
    // support both {data, uiState} format and legacy plain-data snapshots
    return snapshot.data ?? snapshot;
  }

  return { capture, restore };
}
