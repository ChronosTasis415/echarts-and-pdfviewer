<template>
  <div ref="barChart" class="chart"></div>
</template>

<script>
import echarts from 'echarts';
import ChartStyleHelper from '@/helpers/chartStyleHelper';
import ChartFunctionHelper from '@/helpers/chartFunctionHelper';
import chartMixin from '@/mixin/chartMixin';

const barChartColor = [
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 1, color: '#ffd2b2' },
    { offset: 0, color: '#eea18f' }
  ]),
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 1, color: '#99eef5' },
    { offset: 0, color: '#65c8e4' }
  ]),
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 1, color: '#ffeba4' },
    { offset: 0, color: '#f5c076' }
  ]),
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 1, color: '#9ddfff' },
    { offset: 0, color: '#7db4ff' }
  ]),
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 1, color: '#f7d0e4' },
    { offset: 0, color: '#e197f9' }
  ]),
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 1, color: '#b6d9fb' },
    { offset: 0, color: '#a497f9' }
  ])
];

export default {
  name: 'barChart',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mixins: [chartMixin],
  methods: {
    chartOption() {
      const displayOptions = this.data.displayOptions;
      const tooltip = Object.assign({}, ChartStyleHelper.tooltip, {
        axisPointer: {
          type: 'shadow'
        },
        formatter(params) {
          return `<div style="font-size: 14px;">${
            params[0].name
          }</div>${params
            .map(
              v =>
                `<div style="color: ${v.color.colorStops[1].color};">${
                  v.seriesName
                }: ${ChartStyleHelper.processDisplayOptions(
                  v.data,
                  displayOptions
                )}</div>`
            )
            .join('')}`;
        }
      });
      const legend = Object.assign({}, ChartStyleHelper.legend, {
        textStyle: {
          fontSize: 14,
          color: '#3f4647'
        },
        data: this.data.series.map(v => v.name)
      });
      const grid = Object.assign({}, ChartStyleHelper.grid, {
        top: 80
      });
      const dataPointCount = this.data.fields.length;
      const maxxAxisLabelCount = 5;
      const calcxAxisLabelCountIntervalThreshold = 10;
      const xAxisConfig = Object.assign({}, ChartStyleHelper.xAxisStyle, {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#ced2d5',
            width: 1
          }
        },
        axisLabel: {
          textStyle: {
            color: '#6d7d82',
            fontSize: 12,
            fontFamily: 'Tahoma'
          },
          showMinLabel: true,
          showMaxLabel: true,
          interval:
            dataPointCount > calcxAxisLabelCountIntervalThreshold
              ? Math.floor(dataPointCount / (maxxAxisLabelCount + 1))
              : 'auto'
        },
        axisTick: {
          show: false
        },
        data: this.data.fields.map(v => {
          return {
            value: v,
            textStyle: {
              fontSize: 14
            }
          };
        })
      });
      const yAxisConfig = Object.assign({}, ChartStyleHelper.yAxisStyle, {
        type: 'value',
        axisLabel: {
          padding: [0, 0, 0, 0],
          textStyle: {
            fontSize: 12,
            color: '#6d7d82',
            fontFamily: 'Tahoma'
          },
          formatter: val => {
            return ChartStyleHelper.processDisplayOptions(val, displayOptions);
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#e6eff3',
            width: 1
          }
        }
      });

      const option = {
        tooltip,
        legend,
        grid,
        xAxis: [xAxisConfig],
        yAxis: [yAxisConfig],
        color: barChartColor,
        series: this.data.series.map(v => {
          return {
            name: v.name,
            type: 'bar',
            barMaxWidth: 40,
            data: this.data.fields.map(field => v[field])
          };
        })
      };
      return option;
    },
    generateChart() {
      const barChart = echarts.init(this.$refs.barChart);
      const option = this.chartOption();
      barChart.setOption(option);
      barChart.on('finished', () => {
        const imgUrl = barChart.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff'
        });
        this.$emit('done', imgUrl);
      });
      ChartFunctionHelper.preventLastSeriesUnseleted(barChart);
      return barChart;
    }
  },
  mounted() {
    this.chart = this.generateChart();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.off('finished');
    }
  }
};
</script>
<style lang="scss" scoped>
.chart{
  width: 100%;
  height: 324px;
}
</style>
