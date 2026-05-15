# Scifr boilerplate
This is a boilerplate to create scifr project. 

SCFIR is a Single Self-Contained Interactive File Report created based on create-react-app and html-inline-css/script-webpack-plugin to create a unified single file HTML.

## To use
`npx create-scifr my_scifr_project`

## To mutate a built scifr
`npx mutate-scifr --data_json input.json --template scifr.html`

## To start the development server
`cd my_scifr_project && npm run dev`

## Tp build your scifr
`npm run build`

## TODO
- ~~add stable HTML data boundaries for the mutation~~
- ~~refactor app to read payload from DOM, not bundled JSON, its unstable with the upgrading~~
- ~~make sure mutator worjks  in both `npm run dev` and `npm run build`~~
- upgrade React after markers definition and mutation stable

## License: MIT
Copyright 2024; Budi Permana

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
