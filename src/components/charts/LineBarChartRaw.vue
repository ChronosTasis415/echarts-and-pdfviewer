<template>
  <div class="chart" ref="lineBarChart"></div> 
</template>

<script>
import echarts from 'echarts';
import ChartStyleHelper from '@/helpers/chartStyleHelper';
import chartMixin from '@/mixin/chartMixin';

export default {
  name: 'lineBarChart',
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
  methods: {
    chartOption() {
      const barDisplayOptions = this.data.series.bar.displayOptions;
      const lineDisplayOptions = this.data.series.line.displayOptions;

      const barData = {
        type: 'bar',
        name: this.data.series.bar.name,
        data: this.data.fields.map(field => this.data.series.bar[field]),
        barMaxWidth: 40,
        itemStyle: {
          barBorderRadius: [0, 0, 0, 0]
        }
      };
      const lineData = {
        type: 'line',
        name: this.data.series.line.name,
        data: this.data.fields.map(field => this.data.series.line[field]),
        lineStyle: {
          width: 2
        },
        symbol: 'circle',
        symbolSize: 8,
        yAxisIndex: 1
      };

      const grid = Object.assign({}, ChartStyleHelper.grid, {
        top: 50,
        bottom: this.showSlider ? 40 : 0
      });

      const legend = Object.assign({}, ChartStyleHelper.legend, {
        show: true,
        selectedMode: false,
        data: [this.data.series.bar.name, this.data.series.line.name]
      });

      const option = {
        grid,
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#000809',
          borderRadius: 8,
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: '#45a8cc20'
            }
          },
          formatter(params) {
            if (
              params[0].value === undefined &&
              params[1].value === undefined
            ) {
              return '';
            }

            let result = `<div style="font-size: 14px;margin:8px;">${
              params[0].name
            }</div>`;
            if (params[0].value !== undefined) {
              result += `<div style="color: #45a8cc;margin:8px;">${
                params[0].seriesName
              }: ${ChartStyleHelper.processDisplayOptions(
                params[0].value,
                barDisplayOptions
              )}</div>`;
            }
            if (params[1].value !== undefined) {
              result += `<div style="color: ${params[1].color};margin:8px;">${
                params[1].seriesName
              }: ${ChartStyleHelper.processDisplayOptions(
                params[1].value,
                lineDisplayOptions
              )}</div>`;
            }
            return result;
          }
        },
        legend,
        dataZoom: this.showSlider ? ChartStyleHelper.sliderStyle : null,
        xAxis: [
          {
            type: 'category',
            data: this.data.fields,
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
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: val => {
                return ChartStyleHelper.processDisplayOptions(
                  val,
                  barDisplayOptions
                );
              },
              padding: [0, 0, 0, 0],
              textStyle: {
                fontSize: 12,
                color: '#6d7d82',
                fontFamily: 'Tahoma'
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
          },
          {
            type: 'value',
            axisLabel: {
              formatter: val => {
                return ChartStyleHelper.processDisplayOptions(
                  val,
                  lineDisplayOptions
                );
              },
              padding: [0, 0, 0, 0],
              textStyle: {
                fontSize: 12,
                color: '#6d7d82',
                fontFamily: 'Tahoma'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            tooltip: {
              formatter: val => {
                return ChartStyleHelper.processDisplayOptions(
                  val,
                  lineDisplayOptions
                );
              }
            }
          }
        ],
        series: [barData, lineData],
        color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 1, color: '#F3B641' },
          { offset: 0, color: '#F3B641' }
        ]), '#4386DE']
      };
      return option;
    },
    generateChart() {
      const lineBarChart = echarts.init(this.$refs.lineBarChart);
      const option = this.chartOption();
      lineBarChart.setOption(option);
      lineBarChart.on('finished', () => {
        const imgUrl = lineBarChart.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff'
        });
        this.$emit('done', imgUrl);
      });
      return lineBarChart;
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

