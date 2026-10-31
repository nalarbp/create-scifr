import { getDb } from './index';

export async function getAllProjects() {
  const db = await getDb();
  const all = await db.getAllFromIndex('projects', 'updatedAt');
  return all.reverse();
}

export async function getProject(id) {
  const db = await getDb();
  return db.get('projects', id);
}

async function generateUniqueProjectId(db) {
  const existing = new Set(await db.getAllKeys('projects'));
  let id = crypto.randomUUID();
  while (existing.has(id)) id = crypto.randomUUID();
  return id;
}

export async function createProject(name, snapshot = {}) {
  const db = await getDb();
  const now = Date.now();
  const project = {
    id: await generateUniqueProjectId(db),
    name,
    description: '',
    createdAt: now,
    updatedAt: now,
    lastBackedUpAt: null,
    snapshot,
  };
  await db.put('projects', project);
  return project;
}

export async function updateProjectSnapshot(id, snapshot) {
  const db = await getDb();
  const existing = await db.get('projects', id);
  if (!existing) throw new Error(`project not found: ${id}`);
  const updated = { ...existing, snapshot, updatedAt: Date.now() };
  await db.put('projects', updated);
  return updated;
}

export async function updateProjectMeta(id, { name, description }) {
  const db = await getDb();
  const existing = await db.get('projects', id);
  if (!existing) throw new Error(`project not found: ${id}`);
  const updated = {
    ...existing,
    ...(name !== undefined ? { name } : {}),
    ...(description !== undefined ? { description } : {}),
    updatedAt: Date.now(),
  };
  await db.put('projects', updated);
  return updated;
}

export async function updateLastBackedUpAt(id) {
  const db = await getDb();
  const existing = await db.get('projects', id);
  if (!existing) throw new Error(`project not found: ${id}`);
  const updated = { ...existing, lastBackedUpAt: Date.now() };
  await db.put('projects', updated);
  return updated;
}

export async function deleteProject(id) {
  const db = await getDb();
  await db.delete('projects', id);
}

export async function importProject(project) {
  const db = await getDb();
  const now = Date.now();
  const record = {
    description: '',
    lastBackedUpAt: null,
    ...project,
    id: project.id ?? crypto.randomUUID(),
    createdAt: project.createdAt ?? now,
    updatedAt: now,
  };
  await db.put('projects', record);
  return record;
}

export async function exportAllProjects() {
  const db = await getDb();
  return db.getAll('projects');
}

export async function importAllProjects(records) {
  const db = await getDb();
  const now = Date.now();
  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    const existing = await db.get('projects', record.id);
    if (existing && existing.updatedAt >= (record.updatedAt ?? 0)) {
      skipped += 1;
      continue;
    }
    await db.put('projects', {
      description: '',
      lastBackedUpAt: null,
      ...record,
      updatedAt: now,
    });
    imported += 1;
  }

  return { imported, skipped };
}
