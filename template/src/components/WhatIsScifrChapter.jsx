export const whatIsScifrChapterConfig = {
  id: 'what-is-scifr',
  title: 'What is SCIFR?'
};

export default function WhatIsScifrChapter({ active }) {
  return (
    <section data-chapter-id={whatIsScifrChapterConfig.id} className="scifr-slide">
      <div className="scifr-slide-inner flex flex-col items-center gap-8 xl:flex-row xl:gap-14">
        <div className={active ? 'scifr-copy active' : 'scifr-copy'}>
          <p className="scifr-eyebrow">01</p>
          <h2>What is SCIFR?</h2>
          <p className="scifr-lead">
            SCIFR is a design pattern for creating a <b>S</b>ingle self-<b>C</b>ontained <b>I</b>nteractive <b>F</b>ile <b>R</b>eport using a Single-Page Application (SPA) approach.
          </p>
          <ul className="scifr-points">
            <li>It provides an interactive report template that is rich in client-side interaction while remaining flexible during development.</li>
            <li>It introduces an embedded data boundary and injection pattern to support portable, interoperable reports in CLI tools and pipelines.</li>
            <li>It includes a ready-to-use boilerplate for rapid template development.</li>
            <li>It is built around three core components: the Processor, the Mutator, and the Viewer.</li>
          </ul>
        </div>
        <div className={active ? 'scifr-visual active' : 'scifr-visual'}>
          <div className="scifr-card p-6 sm:p-8">
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              className="scifr-video"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">Video placeholder</p>
              <h3 className="mt-3 font-serif text-lg text-red-950">I&apos;ll add a link to the SCIFR explainer video here later.</h3>
            </a>
            <div className="mt-5 rounded-[22px] bg-stone-100 p-5">
              <p className="mt-3 font-serif text-3xl leading-tight text-stone-950">
                Continuous, reusable, interoperable template development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
