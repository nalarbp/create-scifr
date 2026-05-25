export default function ScifrNav({ slides, activeSlide }) {
  const previousSlide = activeSlide > 0 ? slides[activeSlide - 1] : null;
  const currentSlide = slides[activeSlide];
  const nextSlide = activeSlide < slides.length - 1 ? slides[activeSlide + 1] : null;

  return (
    <nav className="scifr-nav" aria-label="SCIFR handbook navigation">
      <div>
        <p className="scifr-kicker">SCIFR: Single self-contained interactive file report.</p>
      </div>
      <div className="scifr-nav-actions">
        <div className="scifr-pager" aria-label="Slide pager">
          <button
            type="button"
            className="scifr-pager-button"
            aria-label={previousSlide === null ? 'Previous slide unavailable' : `Go to ${previousSlide.title}`}
            onClick={() => {
              if (previousSlide !== null) {
                window.location.hash = previousSlide.id;
              }
            }}
            disabled={previousSlide === null}
          >
            &lt;
          </button>
          <div className="scifr-pager-current" aria-current="page">
            {String(activeSlide + 1).padStart(2, '0')}
          </div>
          <button
            type="button"
            className="scifr-pager-button"
            aria-label={nextSlide === null ? 'Next slide unavailable' : `Go to ${nextSlide.title}`}
            onClick={() => {
              if (nextSlide !== null) {
                window.location.hash = nextSlide.id;
              }
            }}
            disabled={nextSlide === null}
          >
            &gt;
          </button>
        </div>
        <a
          href="https://github.com/nalarbp/create-scifr"
          target="_blank"
          rel="noreferrer"
          className="scifr-github-link"
          aria-label="Open create-scifr on GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.09 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.56 1.4.21 2.44.11 2.7.64.72 1.03 1.63 1.03 2.75 0 3.96-2.34 4.82-4.57 5.08.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.05 10.05 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z" />
          </svg>
        </a>
      </div>
    </nav>
  );
}
