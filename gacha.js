class GachaSystem {
  constructor(items) {
    this.items = items;
  }

  pull() {
    const randomNum = Math.random();
    let cumulativeProbability = 0;

    for (const item of this.items) {
      cumulativeProbability += item.probability;

      if (randomNum <= cumulativeProbability) {
        return item;
      }
    }

    return null;
  }

  multiPull(numPulls) {
    const results = [];

    for (let i = 0; i < numPulls; i++) {
      const result = this.pull();
      results.push(result);
    }

    return results;
  }
}

export {GachaSystem};