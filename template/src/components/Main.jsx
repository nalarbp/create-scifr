import { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { loadScifrData } from '../loadScifrData';
import { buildIrisScatterData, summariseIrisDataset } from '../scifrExampleData';
import { activeChapterIdStore } from '../store';
import ArchitectureChapter, { architectureChapterConfig } from './ArchitectureChapter';
import BoilerplateChapter, { boilerplateChapterConfig } from './BoilerplateChapter';
import IrisExampleChapter, { irisExampleChapterConfig } from './IrisExampleChapter';
import MutationWorkflowChapter, { mutationWorkflowChapterConfig } from './MutationWorkflowChapter';
import ScifrNav from './ScifrNav';
import WhatIsScifrChapter, { whatIsScifrChapterConfig } from './WhatIsScifrChapter';

export default function Main() {
  const [activeChapterId, setActiveChapterId] = useAtom(activeChapterIdStore);
  const [scifrData, setScifrData] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateScifrData() {
      try {
        const nextData = await loadScifrData();

        if (isMounted) {
          setScifrData(nextData);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error);
        }
      }
    }

    hydrateScifrData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loadError instanceof Error) {
    throw loadError;
  }
  const irisDataset = scifrData?.scifrExampleInputJSON?.irisData ?? [];
  const summary = scifrData === null
    ? {
        recordCount: 0,
        speciesCount: 0,
        speciesCounts: {},
        meanSepalLength: '0.00',
        meanSepalWidth: '0.00'
      }
    : summariseIrisDataset(irisDataset);
  const scatterData = scifrData === null ? [] : buildIrisScatterData(irisDataset);

  const chapters = useMemo(
    () => [
      {
        ...whatIsScifrChapterConfig,
        Component: WhatIsScifrChapter
      },
      {
        ...architectureChapterConfig,
        Component: ArchitectureChapter
      },
      {
        ...boilerplateChapterConfig,
        Component: BoilerplateChapter
      },
      {
        ...irisExampleChapterConfig,
        Component: IrisExampleChapter,
        componentProps: { scatterData, summary }
      },
      {
        ...mutationWorkflowChapterConfig,
        Component: MutationWorkflowChapter
      }
    ],
    [scatterData, summary]
  );

  const chapterIds = useMemo(() => chapters.map((chapter) => chapter.id), [chapters]);
  const safeActiveChapterId = chapterIds.includes(activeChapterId) ? activeChapterId : chapterIds[0];
  const activeSlideIndex = Math.max(chapterIds.indexOf(safeActiveChapterId), 0);

  useEffect(() => {
    function getHashChapterId() {
      const hashValue = window.location.hash.replace('#', '');
      return chapterIds.includes(hashValue) ? hashValue : chapterIds[0];
    }

    setActiveChapterId(getHashChapterId());

    function handleHashChange() {
      setActiveChapterId(getHashChapterId());
    }

    function handleKeyDown(event) {
      if (event.key === 'ArrowRight') {
        const nextIndex = Math.min(activeSlideIndex + 1, chapters.length - 1);
        window.location.hash = chapterIds[nextIndex];
      } else if (event.key === 'ArrowLeft') {
        const nextIndex = Math.max(activeSlideIndex - 1, 0);
        window.location.hash = chapterIds[nextIndex];
      }
    }

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSlideIndex, chapterIds, chapters.length, setActiveChapterId]);

  if (scifrData === null) {
    return null;
  }

  return (
    <main className="scifr-shell">
      <ScifrNav slides={chapters} activeSlide={activeSlideIndex} />
      <div className="scifr-stage">
        <div className="scifr-track" style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}>
          {chapters.map((chapter) => {
            const ChapterComponent = chapter.Component;

            return (
              <ChapterComponent
                key={chapter.id}
                active={safeActiveChapterId === chapter.id}
                {...(chapter.componentProps ?? {})}
              />
            );
          })}
        </div>
      </div>
      <div className="scifr-controls-bar" aria-label="Chapter navigation controls">
        <button
          type="button"
          className="scifr-nav-button"
          onClick={() => {
            const nextIndex = Math.max(activeSlideIndex - 1, 0);
            window.location.hash = chapterIds[nextIndex];
          }}
          disabled={activeSlideIndex === 0}
        >
          Previous
        </button>
        <div className="scifr-counter">
          {activeSlideIndex + 1} / {chapters.length}
        </div>
        <button
          type="button"
          className="scifr-nav-button"
          onClick={() => {
            const nextIndex = Math.min(activeSlideIndex + 1, chapters.length - 1);
            window.location.hash = chapterIds[nextIndex];
          }}
          disabled={activeSlideIndex === chapters.length - 1}
        >
          Next
        </button>
      </div>
    </main>
  );
}
