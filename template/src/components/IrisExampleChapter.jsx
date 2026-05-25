import { useAtom } from 'jotai';
import NivoScatterPlot from './nivoScatterPlot';
import Control from './Control';
import MetricCard from './MetricCard';
import {
  scatterColorSchemeStore,
  scatterIsInteractiveStore,
  scatterLegendOffsetXStore,
  scatterLegendOffsetYStore,
  scatterLegendPositionStore,
  scatterNodeSizeStore
} from '../store';

const colorPalette = ['nivo', 'paired', 'category10', 'accent', 'dark2'];

export const irisExampleChapterConfig = {
  id: 'iris-example',
  title: 'Interactive Iris example'
};

export default function IrisExampleChapter({ active, scatterData, summary }) {
  const [scatterNodeSize, setScatterNodeSize] = useAtom(scatterNodeSizeStore);
  const [scatterIsInteractive, setScatterIsInteractive] = useAtom(scatterIsInteractiveStore);
  const [scatterColorScheme, setScatterColorScheme] = useAtom(scatterColorSchemeStore);
  const [scatterLegendPosition, setScatterLegendPosition] = useAtom(scatterLegendPositionStore);
  const [scatterLegendOffsetX, setScatterLegendOffsetX] = useAtom(scatterLegendOffsetXStore);
  const [scatterLegendOffsetY, setScatterLegendOffsetY] = useAtom(scatterLegendOffsetYStore);

  return (
    <section data-chapter-id={irisExampleChapterConfig.id} className="scifr-slide">
      <div className="scifr-slide-inner flex flex-col items-center gap-8 xl:flex-row xl:gap-14">
        <div
          className={
            active
              ? 'scifr-copy active xl:!max-w-[24rem] xl:!basis-[24rem] xl:!grow-0 xl:!shrink-0'
              : 'scifr-copy xl:!max-w-[24rem] xl:!basis-[24rem] xl:!grow-0 xl:!shrink-0'
          }
        >
          <p className="scifr-eyebrow">04</p>
          <h2>Interactive example</h2>
          <p className="scifr-lead">
            This page demonstrates a practical SCIFR report using the Iris dataset, including an embedded payload,
            local interactivity, and a portable single-file output.
          </p>
          <ul className="scifr-points">
            <li>
              It uses Nivo.js to show: {summary.recordCount} Iris records across {summary.speciesCount} species.
            </li>
            <li>The Nivo chart state is stored and controlled with Jotai for client-side interactivity.</li>
            <li>This demonstrates how an SPA can be adapted into a single-file interactive report.</li>
          </ul>
        </div>
        <div
          className={
            active
              ? 'scifr-visual active xl:!basis-0 xl:!grow-[1.2] xl:!shrink'
              : 'scifr-visual xl:!basis-0 xl:!grow-[1.2] xl:!shrink'
          }
        >
          <div className="scifr-card p-5 sm:p-6">
            <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:[&>*]:flex-1">
              <MetricCard label="Records" value={summary.recordCount} />
              <MetricCard label="Species" value={summary.speciesCount} />
              <MetricCard label="Mean sepal length" value={summary.meanSepalLength} />
            </div>
            <div className="flex flex-col gap-4 xl:flex-row">
              <div className="w-full rounded-[24px] bg-[#f2eee6] p-4 xl:w-[200px] xl:flex-none">
                <div className="flex w-full max-w-[200px] flex-col gap-[14px]">
                  <Control label="Node size">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={scatterNodeSize}
                      onChange={(event) => setScatterNodeSize(parseInt(event.target.value, 10))}
                    />
                  </Control>
                  <Control label="Color palette">
                    <select
                      className="select select-bordered select-sm w-full"
                      value={scatterColorScheme}
                      onChange={(event) => setScatterColorScheme(event.target.value)}
                    >
                      {colorPalette.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </Control>
                  <Control label="Hover tooltips">
                    <input
                      type="checkbox"
                      className="toggle toggle-sm toggle-primary"
                      checked={scatterIsInteractive}
                      onChange={(event) => setScatterIsInteractive(event.target.checked)}
                    />
                  </Control>
                  <Control label="Legend position">
                    <select
                      className="select select-bordered select-sm w-full"
                      value={scatterLegendPosition}
                      onChange={(event) => setScatterLegendPosition(event.target.value)}
                    >
                      <option value="top-right">top-right</option>
                      <option value="bottom-right">bottom-right</option>
                    </select>
                  </Control>
                  <Control label="Legend offset X">
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="1"
                      value={scatterLegendOffsetX}
                      onChange={(event) => setScatterLegendOffsetX(parseInt(event.target.value, 10))}
                    />
                  </Control>
                  <Control label="Legend offset Y">
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="1"
                      value={scatterLegendOffsetY}
                      onChange={(event) => setScatterLegendOffsetY(parseInt(event.target.value, 10))}
                    />
                  </Control>
                </div>
              </div>
              <div className="h-[30rem] min-w-0 flex-[0_1_52rem] rounded-[24px] bg-[#f5f5f2] p-[14px]">
                <NivoScatterPlot
                  scatterInputData={scatterData}
                  scatterNodeSize={scatterNodeSize}
                  scatterIsInteractive={scatterIsInteractive}
                  scatterColorScheme={scatterColorScheme}
                  scatterLegendPosition={scatterLegendPosition}
                  scatterLegendOffsetX={scatterLegendOffsetX}
                  scatterLegendOffsetY={scatterLegendOffsetY}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
