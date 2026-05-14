import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { useAtomValue } from 'jotai';
import {
    scatterInputDataStore, scatterNodeSizeStore, scatterIsInteractiveStore, scatterColorSchemeStore,
    scatterLegendPositionStore, scatterLegendOffsetXStore, scatterLegendOffsetYStore
} from '../store';

export default function NivoScatterPlot() {
    const scatterInputData = useAtomValue(scatterInputDataStore);
    const scatterNodeSize = useAtomValue(scatterNodeSizeStore);
    const scatterIsInteractive = useAtomValue(scatterIsInteractiveStore);
    const scatterColorScheme = useAtomValue(scatterColorSchemeStore);
    const scatterLegendPosition = useAtomValue(scatterLegendPositionStore);
    const scatterLegendOffsetX = useAtomValue(scatterLegendOffsetXStore);
    const scatterLegendOffsetY = useAtomValue(scatterLegendOffsetYStore);

    return (
        <ResponsiveScatterPlot
            data={scatterInputData}
            margin={{ top: 30, right: 100, bottom: 70, left: 70 }}
            xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            xFormat=">-.2f"
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            yFormat=">-.2f"
            blendMode="multiply"
            nodeSize={scatterNodeSize}
            axisTop={null}
            colors={{ scheme: scatterColorScheme }}
            axisRight={null}
            isInteractive={scatterIsInteractive}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Sepal Width',
                legendPosition: 'middle',
                legendOffset: 46,
                truncateTickAt: 0
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Sepal Length',
                legendPosition: 'middle',
                legendOffset: -60,
                truncateTickAt: 0
            }}
            legends={[
                {
                    anchor: scatterLegendPosition,
                    direction: 'column',
                    justify: false,
                    translateX: scatterLegendOffsetX,
                    translateY: scatterLegendOffsetY,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemsSpacing: 0,
                    symbolSize: 20,
                    itemDirection: 'left-to-right'
                }
            ]}
        />

    );
}
