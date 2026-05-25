#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const SCRIPT_START = '<script id="scifr-data" type="application/json">';
const SCRIPT_END = '</script>';
const INTEGER_PATTERN = /^[+-]?\d+$/;
const FLOAT_PATTERN = /^[+-]?(?:\d+\.\d*|\d*\.\d+|\d+)(?:[eE][+-]?\d+)?$/;

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

function coerceScalar(value) {
  if (value === '' || value === undefined || value === null) {
    return null;
  }

  if (INTEGER_PATTERN.test(value)) {
    const parsedInteger = Number.parseInt(value, 10);
    return Number.isNaN(parsedInteger) ? value : parsedInteger;
  }

  if (FLOAT_PATTERN.test(value)) {
    const parsedFloat = Number.parseFloat(value);
    return Number.isNaN(parsedFloat) ? value : parsedFloat;
  }

  return value;
}

function parseDelimitedLine(line, delimiter) {
  const cells = [];
  let currentValue = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (character === delimiter && !inQuotes) {
      cells.push(currentValue);
      currentValue = '';
    } else {
      currentValue += character;
    }
  }

  cells.push(currentValue);
  return cells;
}

function readDelimitedRows(filePath, delimiter) {
  const fileContent = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = fileContent
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '');

  if (lines.length === 0) {
    throw new Error(`Input data is empty: ${filePath}`);
  }

  const fieldnames = parseDelimitedLine(lines[0], delimiter);
  if (fieldnames.length === 0 || fieldnames.every((fieldname) => fieldname.trim() === '')) {
    throw new Error(`Input table is missing a header: ${filePath}`);
  }

  const rows = lines.slice(1).map((line) => {
    const values = parseDelimitedLine(line, delimiter);
    const row = {};

    fieldnames.forEach((fieldname, index) => {
      row[fieldname] = values[index] ?? '';
    });

    return row;
  });

  return {
    rows,
    fieldnames
  };
}

function buildColumnarPayload(rows, fieldnames) {
  return {
    columns: fieldnames,
    data: fieldnames.map((fieldname) => rows.map((row) => coerceScalar(row[fieldname]))),
    row_count: rows.length
  };
}

function compressJsonBytes(payload) {
  const jsonBytes = Buffer.from(JSON.stringify(payload), 'utf8');
  return zlib.gzipSync(jsonBytes, {
    level: zlib.constants.Z_BEST_COMPRESSION,
    mtime: 0
  });
}

function encodeBase64(data) {
  return data.toString('base64');
}

function packColumnarPayload(rows, fieldnames) {
  const columnarPayload = buildColumnarPayload(rows, fieldnames);
  const compressedBytes = compressJsonBytes(columnarPayload);

  return {
    format_version: 1,
    table: 'scifrData',
    layout: 'columnar',
    compression: 'gzip',
    encoding: 'base64',
    payload: encodeBase64(compressedBytes),
    row_count: rows.length,
    column_count: fieldnames.length
  };
}

function loadDataPayload(dataPath) {
  const extension = path.extname(dataPath).toLowerCase();

  if (extension === '.tsv' || extension === '.tab') {
    const { rows, fieldnames } = readDelimitedRows(dataPath, '\t');
    return packColumnarPayload(rows, fieldnames);
  }

  if (extension === '.csv') {
    const { rows, fieldnames } = readDelimitedRows(dataPath, ',');
    return packColumnarPayload(rows, fieldnames);
  }

  return JSON.parse(fs.readFileSync(dataPath, 'utf8').trim());
}

function mutateReportFromFile(dataPath, templatePath, outputPath, startIdx, endIdx) {
  const payload = loadDataPayload(dataPath);

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

    if (argument === '--data') {
      args.data = value;
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

  if (!args.data || !args.template) {
    throw new Error('Usage: mutate-scifr --data <path> --template <path> [--output <path>] [--startIdx <value>] [--endIdx <value>]');
  }

  return args;
}

function resolvePath(filePath) {
  return path.resolve(process.cwd(), filePath);
}

function main() {
  const args = parseArguments(process.argv);

  mutateReportFromFile(
    resolvePath(args.data),
    resolvePath(args.template),
    resolvePath(args.output),
    args.startIdx,
    args.endIdx
  );

  console.log('Mutation complete!');
}

main();
