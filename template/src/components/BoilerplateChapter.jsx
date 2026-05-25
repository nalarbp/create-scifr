export const boilerplateChapterConfig = {
  id: 'boilerplate',
  title: 'The Boilerplate'
};

export default function BoilerplateChapter({ active }) {
  return (
    <section data-chapter-id={boilerplateChapterConfig.id} className="scifr-slide">
      <div className="scifr-slide-inner flex flex-col items-start gap-8 xl:flex-row xl:items-start xl:gap-14">
        <div className={active ? 'scifr-copy active scifr-boilerplate-copy' : 'scifr-copy scifr-boilerplate-copy'}>
          <p className="scifr-eyebrow">03</p>
          <h2>The Boilerplate</h2>
          <p className="scifr-lead">This is (my) opinionated viewer stack for building self-contained interactive reports. It includes React, Vite, Jotai, Tailwind CSS, and DaisyUI, and Nivo Javascript libraries.</p>
          <ul className="scifr-points">
            <li>Vite builds the viewer for development and production.</li>
            <li>React renders the report interface.</li>
            <li>Jotai holds shared reactive state.</li>
            <li>Tailwind with DaisyUI styles the interface around the embedded data payload.</li>
            <li>Nivo shows light yet feature rich interactive chart.</li>
          </ul>
        </div>
        <div className={active ? 'scifr-visual active scifr-boilerplate-visual' : 'scifr-visual scifr-boilerplate-visual'}>
          <div className="scifr-card p-6 sm:p-8 scifr-boilerplate-card">
            <article className="scifr-system-card">
              <div className="scifr-system-copy">
                <h3>How the viewer stack works</h3>
                <p>The generated viewer is a small frontend system.</p>
              </div>

              <div className="scifr-system-diagram" aria-label="SCIFR boilerplate layered frontend diagram">
                <div className="scifr-system-band scifr-system-band--build">
                  <div className="scifr-system-band-header">
                    <span>Build layer</span>
                    <strong>Vite</strong>
                  </div>
                  <p>Development server and production build pipeline.</p>
                </div>

                <div className="scifr-system-arrow" aria-hidden="true">
                  <span />
                </div>

                <div className="scifr-system-band scifr-system-band--runtime">
                  <div className="scifr-system-band-header">
                    <span>Runtime layer</span>
                    <strong>Viewer application</strong>
                  </div>

                  <div className="scifr-system-runtime">
                    <div className="scifr-system-runtime-node scifr-system-runtime-node--data">
                      <strong>#scifr-data</strong>
                      <span>Embedded input payload</span>
                    </div>

                    <div className="scifr-system-runtime-center">
                      <div className="scifr-system-runtime-node scifr-system-runtime-node--react">
                        <strong>React component tree</strong>
                        <span>Renders the viewer interface from data and state.</span>
                      </div>

                      <div className="scifr-system-runtime-node scifr-system-runtime-node--jotai">
                        <strong>Jotai atom store</strong>
                        <span>Holds reactive shared state for controls and navigation.</span>
                      </div>
                    </div>

                    <div className="scifr-system-runtime-node scifr-system-runtime-node--tailwind">
                      <strong>Tailwind + DaisyUI</strong>
                      <span>Styles components, layout, and visual themes.</span>
                    </div>
                  </div>
                </div>

                <div className="scifr-system-arrow" aria-hidden="true">
                  <span />
                </div>

                <div className="scifr-system-band scifr-system-band--output">
                  <div className="scifr-system-band-header">
                    <span>Output layer</span>
                    <strong>Rendered report UI</strong>
                  </div>
                  <p>Delivered as a portable self-contained interactive HTML report.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
