import { useEffect, useRef } from 'react';
import explainerBase64 from '../assets/scifr_explainer.b64.txt?raw';

const explainerHtml = new TextDecoder().decode(
  Uint8Array.from(atob(explainerBase64.trim()), character => character.charCodeAt(0))
);

const EXPLAINER_WIDTH = 1280;
const EXPLAINER_HEIGHT = 720;
const fitStyles = `
  html, body, #root { width: 100%; height: 100%; min-height: 0; overflow: hidden; }
  body { position: relative; background: #0d1118; }
  .explainer {
    position: absolute !important;
    top: 50%; left: 50%;
    width: ${EXPLAINER_WIDTH}px !important;
    height: ${EXPLAINER_HEIGHT}px !important;
    min-height: 0 !important;
    transform: translate(-50%, -50%) scale(var(--scifr-fit-scale, 1));
    transform-origin: center center;
  }
  .story { gap: 8px !important; padding: 10px 28px !important; }
  .story-copy h1 { font-size: 40px !important; }
  .story-copy > p:last-child { font-size: 17px !important; }
  .diagram-frame { width: 1240px !important; height: 453px !important; min-height: 0 !important; flex: none !important; }
  .diagram-legend { font-size: 11px !important; }
  .detail { min-height: 47px !important; }
  .detail p { font-size: 14px !important; }
  .command code { font-size: 12px !important; }
  .playback { gap: 19px !important; min-height: 58px !important; padding: 9px 42px !important; }
  .transport button { width: 31px !important; height: 31px !important; font-size: 14px !important; }
  .progress { gap: 5px !important; }
`;

function fitExplainer(iframe) {
  const document = iframe?.contentDocument;
  if (!document) return;

  if (!document.getElementById('scifr-explainer-fit')) {
    const style = document.createElement('style');
    style.id = 'scifr-explainer-fit';
    style.textContent = fitStyles;
    document.head.appendChild(style);
  }

  const scale = Math.min(iframe.clientWidth / EXPLAINER_WIDTH, iframe.clientHeight / EXPLAINER_HEIGHT);
  document.documentElement.style.setProperty('--scifr-fit-scale', String(scale));
}

export const whatIsScifrChapterConfig = {
  id: 'what-is-scifr',
  title: 'What is SCIFR?'
};

export default function WhatIsScifrChapter({ active }) {
  const explainerRef = useRef(null);

  useEffect(() => {
    const iframe = explainerRef.current;
    if (!iframe) return undefined;
    const observer = new ResizeObserver(() => fitExplainer(iframe));
    observer.observe(iframe);
    return () => observer.disconnect();
  }, []);

  return (
    <section data-chapter-id={whatIsScifrChapterConfig.id} className="scifr-slide scifr-slide--explainer">
      <div className="scifr-slide-inner flex flex-col items-center gap-8 xl:flex-row xl:gap-14">
        <div className={active ? 'scifr-copy active' : 'scifr-copy'}>
          <p className="scifr-eyebrow">01</p>
          <h2>What is SCIFR?</h2>
          <p className="scifr-lead">
            SCIFR is a design pattern for creating a <b>S</b>elf-<b>C</b>ontained <b>I</b>nteractive single <b>F</b>ile <b>R</b>eport using a Single-Page Application (SPA) approach.
          </p>
          <ul className="scifr-points">
            <li>It provides an interactive report template that is rich in client-side interaction while remaining flexible during development.</li>
            <li>It introduces an embedded data boundary and injection pattern to support portable, interoperable reports in CLI tools and pipelines.</li>
            <li>It includes a ready-to-use boilerplate for rapid template development.</li>
            <li>It is built around three core components: the Processor, the Mutator, and the Viewer.</li>
          </ul>
        </div>
        <div className={active ? 'scifr-visual scifr-visual--explainer active' : 'scifr-visual scifr-visual--explainer'}>
          <div className="scifr-explainer-card">
            <iframe
              ref={explainerRef}
              title="How the SCIFR system works"
              srcDoc={active ? explainerHtml : ''}
              onLoad={() => fitExplainer(explainerRef.current)}
              allow="clipboard-write"
              allowFullScreen
              className="scifr-explainer-frame"
            />
          </div>
          <button
            type="button"
            className="scifr-explainer-expand"
            onClick={() => explainerRef.current?.requestFullscreen()}
          >
            View animation full screen
          </button>
        </div>
      </div>
    </section>
  );
}
