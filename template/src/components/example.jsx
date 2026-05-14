import NivoScatterPlot from "./nivoScatterPlot";
import { useAtom, useSetAtom } from 'jotai';
import {
    scatterInputDataStore, scatterNodeSizeStore, scatterIsInteractiveStore, scatterColorSchemeStore,
    scatterLegendPositionStore, scatterLegendOffsetXStore, scatterLegendOffsetYStore
} from '../store';

const inputDataJSON = require('../input.json');

export default function Example() {
    const [scatterInputData, setScatterInputData] = useAtom(scatterInputDataStore);
    const setScatterNodeSize = useSetAtom(scatterNodeSizeStore);
    const [scatterIsInteractive, setScatterIsInteractive] = useAtom(scatterIsInteractiveStore);
    const setScatterColorScheme = useSetAtom(scatterColorSchemeStore);
    const setScatterLegendPosition = useSetAtom(scatterLegendPositionStore);
    const setScatterLegendOffsetX = useSetAtom(scatterLegendOffsetXStore);
    const setScatterLegendOffsetY = useSetAtom(scatterLegendOffsetYStore);

    const colorPallete = ['nivo', 'paired', 'category10', 'accent', 'dark2'];

    if (scatterInputData === null) {
        const irisDataset = inputDataJSON.scifrExampleInputJSON.irisData
        const irisNivoScatterData = irisDataset.reduce((acc, curr) => {
            const species = curr.species;
            const dataPoint = { x: curr.sepalLength, y: curr.sepalWidth };
            const groupIndex = acc.findIndex(group => group.id === species);
            if (groupIndex === -1) {
                acc.push({ id: species, data: [dataPoint] });
            } else {
                acc[groupIndex].data.push(dataPoint);
            }
            return acc;
        }, []);
        setScatterInputData(irisNivoScatterData);
    }

    return (
        <div id="example" className="relative rounded-lg sm:rounded-none py-8 mt-4 sm:mt-0 mx-2 sm:mx-auto bg-gradient-to-r">
            <div className="w-full sm:w-5/6 mx-auto border-gray-300 border-2 rounded-xl p-2">
                <div className="flex flex-col lg:flex-row lg:space-x-10">
                    <div className="bg-gray-300 block lg:max-w-xs lg:w-52 text-sm">
                        {/* Title */}
                        <div className="p-4">
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Scatterplot of Iris dataset</h1>
                        </div>
                        {/* Slider of node size */}
                        <div className="p-4">
                            <h2 className="font-bold text-gray-900 dark:text-white">Node size</h2>
                            <input type="range" min="1" max="20" step="1" onChange={(e) => setScatterNodeSize(parseInt(e.target.value))} />
                        </div>
                        {/* Select option for color pallete */}
                        <div className="w-full p-4">
                            <h2 className="font-bold text-gray-900 dark:text-white">Color pallete</h2>
                            <select className="select select-bordered select-sm w-full" onChange={(e) => setScatterColorScheme(e.target.value)}>
                                {colorPallete.map((color, index) => {
                                    return <option key={index} value={color}>{color}</option>
                                })}
                            </select>
                        </div>
                        {/* Switch for turn interactivity on or off */}
                        <div className="flex flex-row space-x-2 p-4">
                            <h2 className="font-bold text-gray-900 dark:text-white">Interactivity</h2>
                            <input type="checkbox" className="toggle toggle-sm toggle-primary" checked={scatterIsInteractive} onChange={(e) => setScatterIsInteractive(e.target.checked)} />
                        </div>
                        {/* Legend position */}
                        <div className="p-4">
                            <h2 className="font-bold text-gray-900 dark:text-white">Legend position</h2>
                            <select className="select select-bordered select-sm w-full" onChange={(e) => setScatterLegendPosition(e.target.value)}>
                                <option value="top-right">top-right</option>
                                <option value="bottom-right">bottom-right</option>
                            </select>
                        </div>
                        {/* Legend offset X slider */}
                        <div className="p-4">
                            <h2 className="font-bold text-gray-900 dark:text-white">Legend offset X</h2>
                            <input type="range" min="-200" max="200" step="1" onChange={(e) => setScatterLegendOffsetX(parseInt(e.target.value))} />
                        </div>
                        {/* Legend offset Y slider */}
                        <div className="p-4">
                            <h2 className="font-bold text-gray-900 dark:text-white">Legend offset Y</h2>
                            <input type="range" min="-200" max="200" step="1" onChange={(e) => setScatterLegendOffsetY(parseInt(e.target.value))} />
                        </div>
                    </div>
                    <div className="lg:flex-1 h-[600px]">
                        {scatterInputData === null && <p>Loading input ...</p>}
                        {scatterInputData !== null && <NivoScatterPlot />}

                    </div>
                </div>

            </div>

        </div >
    );
}
