# SCIFR project

## Development
```
npm run dev
```
Opens the webapp with IndexedDB project management. A demo project is created automatically on first launch.

## Build
```
npm run build
```
- `dist/index.html` — webapp
- `dist/scifr.html` — SCIFR template (use with `mutate-scifr` or export from the webapp)

## Inject data via CLI
```
npx mutate-scifr --data my_data.csv --template dist/scifr.html --output report.html
```

## Project files
| Extension | Description |
|---|---|
| `.scifr` | Single project snapshot |
| `.scifr.projects` | All projects backup bundle |
| `.html` | Self-contained SCIFR report |

## License: MIT
Copyright 2024 Budi Permana
