<template>
  <div>
    <div class="chart" ref="lineChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import ChartStyleHelper from '@/helpers/chartStyleHelper';
import ChartFunctionHelper from '@/helpers/chartFunctionHelper';
import chartMixin from '@/mixin/chartMixin';

export default {
  name: 'lineChart',
  props: {
    data: {
      type: Object,
      required: true
    },
    showSlider: {
      type: Boolean,
      default: true
    }
  },
  mixins: [chartMixin],
  watch: {
    'data.fields'() {
      this.generateChart();
    }
  },
  methods: {
    chartOption() {
      const displayOptions = this.data.displayOptions;
      const grid = Object.assign({}, ChartStyleHelper.grid, {
        bottom: this.showSlider ? 52 : 0
      });
      const legend = Object.assign({}, ChartStyleHelper.legend, {
        data: this.data.series.map(v => {
          return {
            name: v.name
          };
        })
      });
      const tooltip = {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderRadius: 8,
        axisPointer: {
          type: 'line'
        },
        formatter(params) {
          return `<div style="font-size: 14px;margin:8px;">${
            params[0].name
          }</div>${params
            .map(
              v =>
                `<div style="color: ${v.color};margin:8px;">${
                  v.seriesName
                }: ${ChartStyleHelper.processDisplayOptions(
                  v.data,
                  displayOptions
                )}</div>`
            )
            .join('')}`;
        }
      };
      const dataPointCount = this.data.fields.length;
      const maxxAxisLabelCount = 5;
      const calcxAxisLabelCountIntervalThreshold = 10;
      const xAxisConfig = {
        type: 'category',
        data: this.data.fields.map(v => {
          return {
            value: v,
            textStyle: {
              fontSize: 12
            }
          };
        }),
        axisPointer: {
          type: 'line'
        },
        axisLine: {
          lineStyle: {
            color: '#ced2d5'
          }
        },
        axisLabel: {
          color: '#6d7d82',
          fontSize: 12,
          // fontWeight: 'normal',
          fontFamily: 'Tahoma',
          showMinLabel: true,
          showMaxLabel: true,
          interval:
            dataPointCount > calcxAxisLabelCountIntervalThreshold
              ? Math.floor(dataPointCount / (maxxAxisLabelCount + 1))
              : 'auto'
        }
      };
      const yAxisConfig = {
        type: 'value',
        min: 'dataMin',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#e6eff3']
          }
        },
        axisLabel: {
          color: '#6d7d82',
          fontSize: 12,
          fontFamily: 'Tahoma',
          formatter: val => {
            return ChartStyleHelper.processDisplayOptions(val, displayOptions);
          }
        }
      };
      const option = {
        grid,
        legend,
        tooltip,
        xAxis: [xAxisConfig],
        yAxis: [yAxisConfig],
        dataZoom: this.showSlider ? ChartStyleHelper.sliderStyle : null,
        color: ChartStyleHelper.catColors,
        series: this.data.series.map(v => { 
          return {
            name: v.name,
            type: 'line',
            data: this.data.fields.map(field => v[field]),
            symbol: 'circle',
            symbolSize: 8,
            // lineStyle: {
            //   color: ['#2d9ecf', '#a34e76']
            // },
            borderColor: 'white',
            borderWidth: 2,
            emphasis: {
              itemStyle: {
                borderColor: 'white'
              }
            }
          };
        })
      };
      return option;
    },
    generateChart() {
      const lineChart = echarts.init(this.$refs.lineChart);
      const option = this.chartOption();
      lineChart.setOption(option, true);
      lineChart.on('finished', () => {
        const imgUrl = lineChart.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff'
        });
        this.$emit('done', imgUrl);
      });
      ChartFunctionHelper.preventLastSeriesUnseleted(lineChart);
      return lineChart;
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
