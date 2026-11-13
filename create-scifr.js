#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectName = process.argv[2];

if (!projectName) {
    console.error('Please specify the project directory:');
    console.error('  npx create-scifr my_scifr');
    process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

if (fs.existsSync(projectPath)) {
    console.error(`The directory ${projectPath} already exists. Please choose a different name.`);
    process.exit(1);
}

fs.mkdirSync(projectPath);

const templatePath = path.join(__dirname, 'template');

const SKIP = new Set(['node_modules', 'dist', '.git', '.DS_Store']);

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(childItemName => {
            if (SKIP.has(childItemName)) return;
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

copyRecursiveSync(templatePath, projectPath);

console.log(`>>Creating project ${projectName}...`);
console.log(`>>Installing dependencies...`);

execSync(`cd ${projectName} && npm install --silent`, { stdio: 'inherit' });

console.log(`>>All done! Your scifr boilerplate is ready.`);
console.log(`>>To start the development server type: cd ${projectName} && npm run dev`);
console.log(`>>To build it type: npm run build`);
