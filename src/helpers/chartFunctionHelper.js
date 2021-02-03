export default class ChartFunctionHelper {
  static preventLastSeriesUnseleted(chart) {
    chart.on('legendselectchanged', params => {
      const seletedCount = Object.keys(params.selected).map(key => {
        return {
          legend: key,
          selected: params.selected[key]
        };
      }).filter(item => item.selected).length;

      if (!seletedCount) {
        chart.dispatchAction({
          type: 'legendSelect',
          name: params.name
        });
      }
    });
  }
}
