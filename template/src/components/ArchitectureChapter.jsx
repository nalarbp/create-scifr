export const architectureChapterConfig = {
  id: 'architecture',
  title: 'SCIFR architecture'
};

export default function ArchitectureChapter({ active }) {
  return (
    <section data-chapter-id={architectureChapterConfig.id} className="scifr-slide">
      <div className="scifr-slide-inner flex flex-col items-center gap-8 xl:flex-row xl:gap-14">
        <div className={active ? 'scifr-copy active' : 'scifr-copy'}>
          <p className="scifr-eyebrow">02</p>
          <h2>SCIFR architecture</h2>
          <p className="scifr-lead">
            SCIFR works through three core components: the <b>Processor</b>, the <b>Mutator</b>, and the
            <b> Viewer</b>. Together, they turn pipeline output into a portable interactive report.
          </p>
          <ul className="scifr-points">
            <li>The Processor generates structured output data from an analysis workflow or pipeline.</li>
            <li>The Mutator injects that output into the SCIFR template through a defined data boundary.</li>
            <li>The Viewer presents the final self-contained interactive report as a single HTML file.</li>
          </ul>
        </div>
        <div className={active ? 'scifr-visual active' : 'scifr-visual'}>
          <div className="scifr-card p-6 sm:p-8">
            <div className="grid gap-4">
              <div className="rounded-[22px] border border-stone-200 bg-stone-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Processor</p>
                <h3 className="mt-2 font-serif text-2xl text-stone-950">Pipeline output</h3>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  Produces structured analysis results, typically as JSON or another machine-readable format.
                </p>
              </div>
              <div className="flex items-center justify-center text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                Processor to Mutator
              </div>
              <div className="rounded-[22px] border border-blue-200 bg-blue-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Mutator</p>
                <h3 className="mt-2 font-serif text-2xl text-stone-950">Data injection</h3>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  Transfers pipeline output into the template by replacing the embedded input placeholder.
                </p>
              </div>
              <div className="flex items-center justify-center text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                Mutator to Viewer
              </div>
              <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Viewer</p>
                <h3 className="mt-2 font-serif text-2xl text-stone-950">Final report</h3>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  Renders the final <code>scifr.html</code> file as a portable, self-contained interactive report.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
