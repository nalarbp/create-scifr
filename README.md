# SCIFR boilerplate
SCIFR is a **S**elf-**C**ontained **I**nteractive single **F**ile **R**eport — an SPA bundled into one portable HTML file with data embedded at its boundary.

> For a full technical reference, see [llms.txt](./llms.txt).

## Scaffold a new project
```
npx create-scifr my_scifr_project
cd my_scifr_project
npm run dev
```

## Build
```
npm run build
```
Produces two outputs in `dist/`:
- `dist/index.html` — the **webapp** (IndexedDB project management, export)
- `dist/scifr.html` — the **SCIFR template** (self-contained report shell with demo data)

The “What is SCIFR?” chapter embeds a prebuilt animated explainer from `template/src/assets/scifr_explainer.b64.txt`.

## Inject data via CLI (pipeline workflow)
```
npx mutate-scifr --data my_data --template dist/scifr.html --output report.html
```
`--data` accepts JSON, TSV, and CSV.

## Project management (webapp)
The webapp (`npm run dev`) includes a Projects panel with:
- Create, load, save, delete projects stored in browser IndexedDB
- **Export .scifr** — save a project snapshot as a portable `.scifr` file
- **Import Project** — load a `.scifr` or `.json` file as a new project
- **Export HTML** — generate a self-contained SCIFR report from the active project
- **Backup Projects / Restore Backup** — bulk export/import as `.scifr.projects`

## File formats
| Extension | Contents |
|---|---|
| `.html` | Self-contained SCIFR report (gzip+base64 payload embedded). Template mode |
| `.scifr` | Single project snapshot (plain JSON). Webapp mode |
| `.scifr.projects` | All projects backup bundle (plain JSON). Web app mode |

## Browser compatibility
Modern browsers only. Internet Explorer is not supported.

## TODO
- ~~add stable HTML data boundaries for the mutation~~
- ~~refactor app to read payload from the DOM instead of bundled JSON; the bundled approach was unstable during upgrades~~
- ~~make sure the mutator works in both `npm run dev` and `npm run build`~~
- ~~upgrade React after marker definition and mutation became stable~~
- ~~upgrade mutate-scifr for more efficient data loading using column-oriented payloads, compression, and base64 encoding~~
- ~~dual-build: webapp (IndexedDB project management) + scifr template~~
- ~~project file formats: `.scifr`, `.scifr.projects`~~
- ~~add `llms.txt` so coding agents (Claude, Cursor, Copilot, etc.) can orient themselves to the SCIFR codebase without manual explanation~~

## License: MIT
Copyright 2024 Budi Permana — see full MIT text in source.
