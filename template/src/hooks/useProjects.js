import { useAtom } from 'jotai';
import { useEffect, useCallback, useState } from 'react';
import { projectListAtom, activeProjectAtom } from '../store';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProjectSnapshot,
  updateProjectMeta,
  updateLastBackedUpAt,
  deleteProject,
  importProject,
  exportAllProjects,
  importAllProjects,
} from '../db/projects';

export function useProjects() {
  const [projectList, setProjectList] = useAtom(projectListAtom);
  const [activeProject, setActiveProject] = useAtom(activeProjectAtom);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    const all = await getAllProjects();
    setProjectList(
      all.map(({ id, name, description, createdAt, updatedAt, lastBackedUpAt }) => ({
        id,
        name,
        description: description ?? '',
        createdAt,
        updatedAt,
        lastBackedUpAt: lastBackedUpAt ?? null,
      }))
    );
    setIsReady(true);
  }, [setProjectList]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (name, snapshot = {}) => {
    const project = await createProject(name, snapshot);
    setActiveProject(project);
    await refresh();
    return project;
  };

  const load = async (id) => {
    const project = await getProject(id);
    if (!project) return null;
    setActiveProject(project);
    return project;
  };

  const save = async (snapshot) => {
    if (!activeProject) return null;
    const toSave = snapshot !== undefined ? snapshot : (activeProject.snapshot ?? {});
    const updated = await updateProjectSnapshot(activeProject.id, toSave);
    setActiveProject(updated);
    await refresh();
    return updated;
  };

  const updateMeta = async (id, fields) => {
    await updateProjectMeta(id, fields);
    if (activeProject?.id === id) {
      setActiveProject((prev) => ({ ...prev, ...fields }));
    }
    await refresh();
  };

  const stampBackup = async (id) => {
    const updated = await updateLastBackedUpAt(id);
    if (activeProject?.id === id) setActiveProject(updated);
    await refresh();
    return updated;
  };

  const remove = async (id) => {
    await deleteProject(id);
    if (activeProject?.id === id) setActiveProject(null);
    await refresh();
  };

  const open = (project) => setActiveProject(project);

  const importProj = async (project) => {
    const record = await importProject(project);
    await refresh();
    return record;
  };

  const backupAll = async () => {
    const records = await exportAllProjects();
    for (const r of records) {
      await updateLastBackedUpAt(r.id);
    }
    await refresh();
    return records;
  };

  const restoreBackup = async (records) => {
    const result = await importAllProjects(records);
    await refresh();
    return result;
  };

  return {
    projectList,
    activeProject,
    isReady,
    refresh,
    create,
    load,
    save,
    updateMeta,
    stampBackup,
    remove,
    open,
    importProj,
    backupAll,
    restoreBackup,
  };
}
