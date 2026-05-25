import MetricCard from './MetricCard';

export const mutationWorkflowChapterConfig = {
  id: 'mutation-workflow',
  title: 'Mutation workflow and explainer'
};

export default function MutationWorkflowChapter({ active }) {
  return (
    <section data-chapter-id={mutationWorkflowChapterConfig.id} className="scifr-slide">
      <div className="scifr-slide-inner flex flex-col items-center gap-8 xl:flex-row xl:gap-14">
        <div
          className={
            active
              ? 'scifr-copy active xl:!max-w-[400px] xl:!basis-[400px] xl:!grow-0 xl:!shrink-0'
              : 'scifr-copy xl:!max-w-[400px] xl:!basis-[400px] xl:!grow-0 xl:!shrink-0'
          }
        >
          <p className="scifr-eyebrow">05</p>
          <h2>Template mutation</h2>
          <p className="scifr-lead">
            After building the report, mutate-scifr can replace the embedded payload without changing UI code. This is
            where the SCIFR delivery model becomes operational. Build the report once, swap the payloads.
          </p>
        </div>
        <div
          className={
            active
              ? 'scifr-visual active xl:!basis-0 xl:!grow-[1.35] xl:!shrink'
              : 'scifr-visual xl:!basis-0 xl:!grow-[1.35] xl:!shrink'
          }
        >
          <div className="scifr-card p-6 sm:p-8">
            <div className="rounded-[24px] bg-stone-900 p-5 text-stone-50">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Build workflow</p>
              <pre className="mt-4 whitespace-pre-wrap font-mono text-base leading-8 text-stone-100">
                {`npx create-scifr my-report
cd my-report
npm run build
npx mutate-scifr --data my_data --template scifr.html`}
              </pre>
            </div>
            <div className="mt-5 scifr-panel-grid sm:grid-cols-2">
              <MetricCard label="Output" value="One HTML file" />
              <MetricCard label="Approach" value="SPA" />
              <MetricCard label="Payload" value="#scifr-data" />
              <MetricCard label="Goal" value="portable" />
            </div>
            <p className="scifr-footer-note">
              The mutator targets the stable HTML data boundary, not bundler internals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
