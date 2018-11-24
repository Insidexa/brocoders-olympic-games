const MAX_CHART_LINE_SYMBOLS = 200;
const CHART_SYMBOL = '█';

class Output {
  constructor() {
    this.tabulation = `\t`;
    this.countTabs = 1;
    this.ratio = {
      value: 30,
      symbols: 40,
    };
  }

  calculateRatio(value) {
    const ratio = (value * this.ratio.symbols) / this.ratio.value;
    if (ratio > MAX_CHART_LINE_SYMBOLS) {
      return MAX_CHART_LINE_SYMBOLS;
    }

    return ratio;
  }

  show(results, headerName) {
    this.printHeader(headerName);
    results.forEach((result) => {
      const [headerName, propName] = Object.keys(result);
      const value = result[propName];
      const progressOrZero = value === 0 ? value : this.getProgress(value);
      const headerValue = result[headerName];

      this.printRow(headerValue, progressOrZero);
    });
  }

  printRow(header, value) {
    console.log(`${header}${this.getTabulation()}${value}`);
  }

  getProgress(value) {
    return CHART_SYMBOL.repeat(this.calculateRatio(value));
  }

  printHeader(headerName) {
    console.log(`${headerName}${this.getTabulation()}Amount`);
  }

  getTabulation() {
    return this.tabulation.repeat(this.countTabs);
  }
}

exports.Output = Output;
