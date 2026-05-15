function getScifrDataText() {
  const scifrDataElement = document.getElementById('scifr-data');

  if (scifrDataElement === null || scifrDataElement.textContent === null) {
    throw new Error('Missing SCIFR data boundary: #scifr-data');
  }

  return scifrDataElement.textContent;
}

export function loadScifrData() {
  const scifrData = JSON.parse(getScifrDataText());

  if (scifrData !== null && typeof scifrData === 'object' && 'payload' in scifrData) {
    return scifrData.payload;
  }

  return scifrData;
}
