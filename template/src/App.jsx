import './App.css';
import { useState, useEffect } from 'react';
import { useProjects } from './hooks/useProjects';
import { useSnapshot } from './hooks/useSnapshot';
import { buildScifrDownload } from './scifrReport';
import { unpackPayload } from './loadScifrData';
import defaultPayload from './input.columnar.gzip.base64.json';
import ProjectPanel from './components/ProjectPanel';
import Main from './components/Main';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const {
    projectList,
    activeProject,
    isReady,
    create,
    load,
    save,
    updateMeta,
    stampBackup,
    remove,
    backupAll,
    restoreBackup,
  } = useProjects();

  // Seed a demo project on first launch so the Iris chart has data to show.
  useEffect(() => {
    if (!isReady || projectList.length > 0) return;
    unpackPayload(defaultPayload).then((data) => create('Demo Project', data));
  }, [isReady, projectList.length]);

  const { capture, restore } = useSnapshot();

  // Restore UI state whenever the active project changes
  useEffect(() => {
    if (!activeProject) return;
    restore(activeProject.snapshot);
  }, [activeProject?.id]);

  // Support both {data, uiState} snapshot format and legacy plain-data snapshots
  const scifrData = activeProject?.snapshot?.data ?? activeProject?.snapshot ?? null;

  const handleLoad = async (id) => {
    await load(id);
    setPanelOpen(false);
  };

  const handleSave = async () => {
    await save(capture(scifrData));
  };

  const handleExportScifr = async () => {
    if (!activeProject) return;
    setExporting(true);
    try {
      const result = await buildScifrDownload({
        snapshot: activeProject.snapshot,
        title: activeProject.name,
      });
      downloadBlob(result.blob, result.filename);
      await stampBackup(activeProject.id);
    } catch (err) {
      console.error('[Export SCIFR]', err);
      alert(err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleExportProjectFile = () => {
    if (!activeProject) return;
    const projectFile = {
      format: 'scifr-project',
      version: 1,
      name: activeProject.name,
      exportedAt: new Date().toISOString(),
      snapshot: activeProject.snapshot,
    };
    const safeName = activeProject.name.replace(/[\\/:*?"<>|]/g, '_');
    const blob = new Blob([JSON.stringify(projectFile, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `${safeName}.scifr`);
  };

  const handleBackupAll = async () => {
    try {
      const records = await backupAll();
      const payload = {
        exportedAt: new Date().toISOString(),
        version: 1,
        projects: records,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      downloadBlob(blob, `scifr_backup_${timestamp}.scifr.projects`);
    } catch (err) {
      console.error('[Backup all]', err);
      alert(`Backup failed: ${err.message}`);
    }
  };

  return (
    <>
      <Main
        scifrData={scifrData}
        onProjectsClick={() => setPanelOpen((v) => !v)}
        onSaveProject={activeProject ? handleSave : null}
        activeProjectName={activeProject?.name ?? null}
      />
      <ProjectPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        projectList={projectList}
        activeProject={activeProject}
        onCreateProject={create}
        onLoadProject={handleLoad}
        onSaveProject={handleSave}
        onRenameProject={(id, name) => updateMeta(id, { name })}
        onDeleteProject={remove}
        onExportScifr={handleExportScifr}
        onExportProjectFile={handleExportProjectFile}
        onBackupAll={handleBackupAll}
        onRestoreBackup={restoreBackup}
        exportDisabled={exporting}
      />
    </>
  );
}

export default App;
