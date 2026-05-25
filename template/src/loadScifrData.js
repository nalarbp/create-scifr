function getScifrDataText() {
  const scifrDataElement = document.getElementById('scifr-data');

  if (scifrDataElement === null || scifrDataElement.textContent === null) {
    throw new Error('Missing SCIFR data boundary: #scifr-data');
  }

  return scifrDataElement.textContent;
}

function isPackedPayload(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    value.format_version === 1 &&
    value.compression === 'gzip' &&
    value.encoding === 'base64' &&
    typeof value.payload === 'string'
  );
}

function decodeBase64(base64Text) {
  const binaryText = window.atob(base64Text);
  const bytes = new Uint8Array(binaryText.length);

  for (let index = 0; index < binaryText.length; index += 1) {
    bytes[index] = binaryText.charCodeAt(index);
  }

  return bytes;
}

async function gunzipBytes(bytes) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser does not support gzip decompression for packed SCIFR payloads');
  }

  const decompressionStream = new DecompressionStream('gzip');
  const compressedStream = new Blob([bytes]).stream();
  const decompressedStream = compressedStream.pipeThrough(decompressionStream);
  const decompressedBuffer = await new Response(decompressedStream).arrayBuffer();

  return new TextDecoder().decode(decompressedBuffer);
}

function unpackColumnarData(columnarPayload) {
  if (!Array.isArray(columnarPayload.columns) || !Array.isArray(columnarPayload.data)) {
    return columnarPayload;
  }

  const rowCount = Number.isInteger(columnarPayload.row_count)
    ? columnarPayload.row_count
    : (columnarPayload.data[0] ?? []).length;

  const rows = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const row = {};

    columnarPayload.columns.forEach((columnName, columnIndex) => {
      const columnValues = columnarPayload.data[columnIndex] ?? [];
      row[columnName] = columnValues[rowIndex] ?? null;
    });

    rows.push(row);
  }

  return rows;
}

async function unpackPayload(payload) {
  if (!isPackedPayload(payload)) {
    return payload;
  }

  const compressedBytes = decodeBase64(payload.payload);
  const decompressedText = await gunzipBytes(compressedBytes);
  const decodedPayload = JSON.parse(decompressedText);

  if (payload.layout === 'columnar') {
    return unpackColumnarData(decodedPayload);
  }

  return decodedPayload;
}

export async function loadScifrData() {
  const scifrData = JSON.parse(getScifrDataText());
  const payload = scifrData !== null && typeof scifrData === 'object' && 'payload' in scifrData
    ? scifrData.payload
    : scifrData;

  return unpackPayload(payload);
}
