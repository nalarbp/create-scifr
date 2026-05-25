export function buildIrisScatterData(irisDataset) {
  return irisDataset.reduce((groups, record) => {
    const speciesGroup = groups.find((group) => group.id === record.species);
    const dataPoint = { x: record.sepalLength, y: record.sepalWidth };

    if (speciesGroup === undefined) {
      groups.push({ id: record.species, data: [dataPoint] });
      return groups;
    }

    speciesGroup.data.push(dataPoint);
    return groups;
  }, []);
}

export function summariseIrisDataset(irisDataset) {
  const speciesCounts = irisDataset.reduce((counts, record) => {
    counts[record.species] = (counts[record.species] ?? 0) + 1;
    return counts;
  }, {});

  const totalSepalLength = irisDataset.reduce((sum, record) => sum + record.sepalLength, 0);
  const totalSepalWidth = irisDataset.reduce((sum, record) => sum + record.sepalWidth, 0);

  return {
    recordCount: irisDataset.length,
    speciesCount: Object.keys(speciesCounts).length,
    speciesCounts,
    meanSepalLength: (totalSepalLength / irisDataset.length).toFixed(2),
    meanSepalWidth: (totalSepalWidth / irisDataset.length).toFixed(2)
  };
}
