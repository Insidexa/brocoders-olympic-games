const MAX_CHART_LINE_SYMBOLS = 200;
const CHART_SYMBOL = '█';

class Output {
  constructor() {
    this.tabulation = `\t`;
    this.countTabs = 1;
  }

  calcProportional(value) {
    const calculated = (value * 40) / 30;
    if (calculated > MAX_CHART_LINE_SYMBOLS) {
      return MAX_CHART_LINE_SYMBOLS;
    }

    return calculated;
  }

  show(results, headerName) {
    this.printHeader(headerName);
    results.forEach(result => this.printRow(result));
  }

  printRow(item) {
    const [headerProp, propName] = Object.keys(item);
    console.log(`${item[headerProp]}${this.getTabulation()}${this.printChartLine(item[propName])}`);
  }

  printChartLine(value) {
    return CHART_SYMBOL.repeat(this.calcProportional(value));
  }

  printHeader(headerName) {
    console.log(`${headerName}${this.getTabulation()}Amount`);
  }

  getTabulation() {
    return this.tabulation.repeat(this.countTabs);
  }
}

exports.Output = Output;
