#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const SCRIPT_START = '<script id="scifr-data" type="application/json">';
const SCRIPT_END = '</script>';

function buildScifrPayload(payload, startIdx, endIdx) {
  return {
    startIdx,
    payload,
    endIdx
  };
}

function replaceScifrDataBlock(content, payload, startIdx, endIdx) {
  const startPos = content.indexOf(SCRIPT_START);
  if (startPos === -1) {
    throw new Error('SCIFR data boundary start tag not found');
  }

  const jsonStart = startPos + SCRIPT_START.length;
  const endPos = content.indexOf(SCRIPT_END, jsonStart);
  if (endPos === -1) {
    throw new Error('SCIFR data boundary end tag not found');
  }

  const wrappedPayload = JSON.stringify(buildScifrPayload(payload, startIdx, endIdx))
    .replace(/<\/script/gi, '<\\/script');

  return content.slice(0, jsonStart) + wrappedPayload + content.slice(endPos);
}

function mutateTemplateMemory(payload, templatePath, outputPath, startIdx, endIdx) {
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const updatedContent = replaceScifrDataBlock(templateContent, payload, startIdx, endIdx);

  fs.writeFileSync(outputPath, updatedContent, 'utf8');
}

function mutateReportFromFile(dataJsonPath, templatePath, outputPath, startIdx, endIdx) {
  const payload = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8').trim());

  mutateTemplateMemory(payload, templatePath, outputPath, startIdx, endIdx);
}

function parseArguments(argv) {
  const args = {
    output: 'scifr_report.html',
    startIdx: 'scifr-data-start',
    endIdx: 'scifr-data-end'
  };

  for (let index = 2; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];

    if (argument === '--data_json') {
      args.dataJson = value;
      index += 1;
    } else if (argument === '--template') {
      args.template = value;
      index += 1;
    } else if (argument === '--output') {
      args.output = value;
      index += 1;
    } else if (argument === '--startIdx') {
      args.startIdx = value;
      index += 1;
    } else if (argument === '--endIdx') {
      args.endIdx = value;
      index += 1;
    }
  }

  if (!args.dataJson || !args.template) {
    throw new Error('Usage: mutate-scifr --data_json <path> --template <path> [--output <path>] [--startIdx <value>] [--endIdx <value>]');
  }

  return args;
}

function resolvePath(filePath) {
  return path.resolve(process.cwd(), filePath);
}

function main() {
  const args = parseArguments(process.argv);

  mutateReportFromFile(
    resolvePath(args.dataJson),
    resolvePath(args.template),
    resolvePath(args.output),
    args.startIdx,
    args.endIdx
  );

  console.log('Mutation complete!');
}

main();
