import { useRef, useState } from 'react';

const BACKUP_WARN_DAYS = 7;
const BACKUP_CAUTION_DAYS = 3;

function backupAgeDays(lastBackedUpAt) {
  if (!lastBackedUpAt) return Infinity;
  return (Date.now() - lastBackedUpAt) / (1000 * 60 * 60 * 24);
}

function formatBackupAge(lastBackedUpAt) {
  if (!lastBackedUpAt) return 'Never backed up';
  const days = backupAgeDays(lastBackedUpAt);
  if (days < 1) return 'Backed up today';
  if (days < 2) return 'Backed up yesterday';
  return `Backed up ${Math.floor(days)}d ago`;
}

function BackupAgeTag({ lastBackedUpAt }) {
  const days = backupAgeDays(lastBackedUpAt);
  const color = days > BACKUP_WARN_DAYS ? 'badge-error' : days > BACKUP_CAUTION_DAYS ? 'badge-warning' : 'badge-success';
  return <span className={`badge badge-sm ${color}`}>{formatBackupAge(lastBackedUpAt)}</span>;
}

export default function ProjectPanel({
  open,
  onClose,
  projectList = [],
  activeProject = null,
  onCreateProject,
  onLoadProject,
  onSaveProject,
  onDeleteProject,
  onRenameProject,
  onExportScifr,
  onExportProjectFile,
  onBackupAll,
  onRestoreBackup,
  exportDisabled = false,
}) {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectFile, setNewProjectFile] = useState(null);
  const [creating, setCreating] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const importFileRef = useRef(null);
  const newProjectFileRef = useRef(null);
  const restoreFileRef = useRef(null);

  const staleCount = projectList.filter((p) => backupAgeDays(p.lastBackedUpAt) > BACKUP_WARN_DAYS).length;

  const handleCreate = async () => {
    const name = newProjectName.trim() || 'New Project';
    let snapshot = {};
    if (newProjectFile) {
      try {
        const text = await newProjectFile.text();
        const data = JSON.parse(text);
        snapshot = data.format === 'scifr-project' && data.snapshot !== undefined ? data.snapshot : data;
      } catch {
        alert('Could not read the data file. Project created with empty data.');
      }
    }
    await onCreateProject(name, snapshot);
    setNewProjectName('');
    setNewProjectFile(null);
    setCreating(false);
  };

  const handleImportJson = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (Array.isArray(data.projects) && data.exportedAt) {
        alert('This is a backup file. Use "Restore Backup" to restore projects from a backup.');
        return;
      }
      // .scifr project file — unwrap the envelope
      if (data.format === 'scifr-project' && data.snapshot !== undefined) {
        const base = data.name || file.name.replace(/\.scifr$/i, '');
        const stamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
        await onCreateProject(`${base} (${stamp})`, data.snapshot);
        return;
      }
      // plain JSON data payload
      const name = file.name.replace(/\.(scifr|json)$/i, '');
      await onCreateProject(name, data);
    } catch (err) {
      alert(`Failed to import: ${err.message}`);
    }
    event.target.value = '';
  };

  const handleRestoreChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const records = Array.isArray(parsed.projects) ? parsed.projects : (Array.isArray(parsed) ? parsed : null);
      if (!records) {
        alert('This does not look like a backup file. Use "Import Project" to import a data payload.');
        return;
      }
      const { imported, skipped } = await onRestoreBackup(records);
      alert(`Restore complete: ${imported} imported, ${skipped} skipped (local was newer).`);
    } catch (err) {
      alert(`Could not restore: ${err.message}`);
    }
    event.target.value = '';
  };

  return (
    <dialog className={open ? 'modal modal-open' : 'modal'} aria-label="Projects">
      <div className="modal-box w-[40vw] max-w-[60vw] p-0 overflow-hidden flex flex-col max-h-[80vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-200 shrink-0">
          <h3 className="font-extrabold text-base">Projects</h3>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 flex flex-col">

          {/* New / Import */}
          <div className="px-5 pt-4">
            {creating ? (
              <div className="flex flex-col gap-2">
                <input
                  className="input input-bordered input-sm w-full"
                  type="text"
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') { setCreating(false); setNewProjectFile(null); }
                  }}
                  autoFocus
                />
                <button
                  className="btn btn-xs w-full justify-start font-normal"
                  onClick={() => newProjectFileRef.current?.click()}
                >
                  {newProjectFile ? `📄 ${newProjectFile.name}` : '+ Load data file (optional)'}
                </button>
                <input
                  ref={newProjectFileRef}
                  type="file"
                  accept=".scifr,.json"
                  className="sr-only"
                  onChange={(e) => setNewProjectFile(e.target.files?.[0] ?? null)}
                />
                <div className="flex gap-2">
                  <button className="btn btn-xs btn-neutral" onClick={handleCreate}>Create</button>
                  <button className="btn btn-xs" onClick={() => { setCreating(false); setNewProjectFile(null); }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <button className="btn btn-xs" onClick={() => setCreating(true)}>+ New project</button>
                <button className="btn btn-xs" onClick={() => importFileRef.current?.click()}>Import Project</button>
                <input ref={importFileRef} type="file" accept=".scifr,.json" className="sr-only" onChange={handleImportJson} />
                <button className="btn btn-xs gap-1" onClick={onBackupAll}>
                  Backup Projects
                  {staleCount > 0 && <span className="badge badge-error badge-xs">{staleCount}</span>}
                </button>
                <button className="btn btn-xs" onClick={() => restoreFileRef.current?.click()}>Restore Backup</button>
                <input ref={restoreFileRef} type="file" accept=".scifr.projects" className="sr-only" onChange={handleRestoreChange} />
              </div>
            )}
          </div>

          {/* Project list */}
          <ul className="mt-3 px-5 pb-4 flex flex-col gap-2" role="list">
            {projectList.length === 0 && (
              <li className="py-4 text-sm text-base-content/50 leading-relaxed">
                No projects yet. Create one or import a JSON file.
              </li>
            )}
            {projectList.map((project) => {
              const isActive = project.id === activeProject?.id;
              return (
                <li
                  key={project.id}
                  className={`rounded-xl border overflow-hidden ${isActive ? 'border-neutral bg-neutral/5' : 'border-base-200 bg-base-100'}`}
                >
                  <div className="flex items-center gap-1">
                    {renamingId === project.id ? (
                      <div className="flex-1 flex items-center gap-1 px-3 py-2">
                        <input
                          className="input input-bordered input-xs flex-1 min-w-0"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') { onRenameProject(project.id, renameValue); setRenamingId(null); }
                            if (e.key === 'Escape') setRenamingId(null);
                          }}
                          autoFocus
                        />
                        <button className="btn btn-xs btn-ghost" onClick={() => { onRenameProject(project.id, renameValue); setRenamingId(null); }}>✓</button>
                        <button className="btn btn-xs btn-ghost" onClick={() => setRenamingId(null)}>✕</button>
                      </div>
                    ) : (
                      <button
                        className="flex-1 min-w-0 flex flex-col items-start gap-1 p-3 text-left hover:bg-base-200 transition-colors"
                        onClick={() => { onLoadProject(project.id); onClose(); }}
                      >
                        <span className="text-sm font-bold break-words w-full">{project.name}</span>
                        <BackupAgeTag lastBackedUpAt={project.lastBackedUpAt} />
                      </button>
                    )}
                    <button
                      className="px-2 py-2 text-base-content/30 hover:text-base-content transition-colors text-sm shrink-0"
                      onClick={() => { setRenamingId(project.id); setRenameValue(project.name); }}
                      aria-label={`Rename ${project.name}`}
                    >
                      ✎
                    </button>
                    <button
                      className="px-3 py-2 text-base-content/30 hover:text-error transition-colors text-lg shrink-0"
                      onClick={() => onDeleteProject(project.id)}
                      aria-label={`Delete ${project.name}`}
                    >
                      ×
                    </button>
                  </div>
                  {isActive && (
                    <div className="flex gap-2 px-3 pb-3">
                      <button className="btn btn-xs btn-outline" onClick={onSaveProject}>Save</button>
                      <button className="btn btn-xs btn-primary" onClick={onExportProjectFile}>Export .scifr</button>
                      <button className="btn btn-xs btn-neutral" onClick={onExportScifr} disabled={exportDisabled}>
                        {exportDisabled ? 'Exporting…' : 'Export HTML'}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Storage info */}
          <div className="collapse collapse-arrow p-5 bg-base-100">
            <input type="checkbox" />
            <div className="collapse-title text-xs text-base-content/50 py-3 min-h-0">
              Projects are stored locally in your browser's Web Storage. Learn more here.
            </div>
            <div className="collapse-content text-xs text-base-content/60 space-y-2">
              <p>SCIFR stores projects in your browser using IndexedDB. This keeps your data private to your machine, but it also means:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Clearing browser data or switching to another device or profile removes saved projects.</li>
                <li>Available space depends on your browser quota and disk capacity.</li>
                <li>Delete unused projects to free up storage space.</li>
              </ul>
              <p>Export projects regularly if you need backups beyond a single browser session.</p>
            </div>
          </div>

        </div>


      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
