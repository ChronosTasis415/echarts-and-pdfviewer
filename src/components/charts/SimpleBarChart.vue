<template>
  <div :id="chartId" class="chart" ref="barChart" :style="rawStyle"></div>
</template>

<script>
import echarts from 'echarts';
import StringHelper from '@/helpers/stringHelper';
import ChartStyleHelper from '@/helpers/chartStyleHelper';
import FuncHelper from '@/helpers/funcHelper';
import ChartFunctionHelper from '@/helpers/chartFunctionHelper';

const defaultBarChartColor = [
  new echarts.graphic.LinearGradient(
    0, 0, 0, 1,
    [
      { offset: 1, color: '#ffd2b2' },
      { offset: 0, color: '#eea18f' }
    ]
  ),
  new echarts.graphic.LinearGradient(
    0, 0, 0, 1,
    [
      { offset: 1, color: '#99eef5' },
      { offset: 0, color: '#65c8e4' }
    ]
  ),
  new echarts.graphic.LinearGradient(
    0, 0, 0, 1,
    [
      { offset: 1, color: '#ffeba4' },
      { offset: 0, color: '#f5c076' }
    ]
  ),
  new echarts.graphic.LinearGradient(
    0, 0, 0, 1,
    [
      { offset: 1, color: '#9ddfff' },
      { offset: 0, color: '#7db4ff' }
    ]
  ),
  new echarts.graphic.LinearGradient(
    0, 0, 0, 1,
    [
      { offset: 1, color: '#f7d0e4' },
      { offset: 0, color: '#e197f9' }
    ]
  ),
  new echarts.graphic.LinearGradient(
    0, 0, 0, 1,
    [
      { offset: 1, color: '#b6d9fb' },
      { offset: 0, color: '#a497f9' }
    ]
  )
];

/**
 * Simple Bar Chart
 * 简单的的自适应柱状图, 没有额外 DOM 包装
 * dataZoom 自适应
 * 不支持 axisPointer, 添加 axisPointer 会导致填充的数据被显示出来
 * 如果不设定 accurateAdjust, 网格的宽度不保证是 fieldWidth 的整数倍
 * 只能保证实际 fieldWidth 会大于传入的 fieldWidth
 * @prop {string}        name
 * @prop {Array}         [data] data 和 verboseData 至少有一个
 * @prop {string}        [data[].field]
 * @prop {number}        [data[].value]
 * @prop {Object}        [verboseData]
 * @prop {Array}         [verboseData.fields]
 * @prop {Array<Object>} [verboseData.series]
 * @prop {string}        [verboseData.series[].name]
 * @prop {string}        [rawStyle] 柱状图 DOM 的 style 字符串
 * @prop {Array<string>} [colors] 只要是 Echarts 接受的 Color 就可以
 * @prop {object}        [displayOption]
 * @prop {string}        [displayOption.unit]
 * @prop {number}        [displayOption.precision]
 * @prop {number}        [gridLeft] 表格 Grid 距容器左侧的距离
 * @prop {number}        [gridRight] 表格 Grid 距容器右侧的距离
 * @prop {number}        [barWidth] 每个 bar 的宽度
 * @prop {number}        [fieldWidth] 每个 bar 所在的 field 占多宽
 * @prop {boolean}       [accurateAdjust] 在计算 Grid Width 的时候是否一定是 fields 的整数倍
 * @prop {function}      [itemStyle] 计算每个 bar 的 style
 *   function itemStyle(index: number) : echarts.option.series[].bar.itemStyle | undefined
 *   接受参数为数据的 index, 如果有则返回 itemStyle, 如果不覆盖 style 则返回 undefined
 * @prop {object}        [sliderDataZoom] slider dataZoom 的设置, 设置的项目会覆盖掉默认设置
 *   @see http://echarts.baidu.com/option.html#dataZoom-slider
 */
export default {
  name: 'barChart',
  props: {
    name: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: false
    },
    verboseData: {
      type: Object,
      required: false
    },
    colors: {
      type: Array,
      required: false
    },
    displayOption: {
      type: Object,
      required: false
    },
    rawStyle: {
      type: String,
      default: 'height:400px;width=100%;',
      required: false
    },
    barWidth: {
      type: Number,
      default: 24,
      required: false
    },
    fieldWidth: {
      type: Number,
      default: 72,
      required: false
    },
    gridLeft: {
      type: Number,
      default: 54,
      required: false
    },
    gridRight: {
      type: Number,
      default: 36,
      required: false
    },
    itemStyle: {
      type: Function,
      default: null,
      required: false
    },
    sliderDataZoom: {
      type: Object,
      default: () => {},
      required: false
    },
    accurateAdjust: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      paddedData: null,   
      chartId: StringHelper.getUniqueId(),
      chartDomWidth: null,
      chartGridSpace: null,
      chartGridWidth: null,
      barCount: null,
      showDataZoom: null,
      dataOrignalLength: null,
      chartData: null,
      chart: null
    };
  },
  computed: {
  },
  methods: {
    generateChart() {
      const barChart = echarts.init(this.$refs.barChart);
      const option = this.chartOption();
      barChart.setOption(option);
      ChartFunctionHelper.preventLastSeriesUnseleted(barChart);
      return barChart;
    },
    resizeChart() {
      this.computeOptionProperty();
      const option = this.chartOption();
      this.chart.resize();
      this.chart.setOption(option);
    },
    computeChartData() {
      const data = {
        title: this.name,
        fields: [],
        series: [
          {
            type: 'bar',
            barWidth: this.barWidth,
            name: this.name,
            label: this.name,
            data: []
          }
        ]
      };
      if (this.verboseData) {
        data.fields = this.verboseData.fields;
        data.series = this.verboseData.series.map(v => {
          return {
            type: 'bar',
            name: v.name,
            label: v.name,
            barWidth: this.barWidth,
            data: data.fields.map((field, i) => {
              return {
                value: v[field],
                itemStyle: this.itemStyle ? this.itemStyle(i) : undefined
              };
            })
          };
        });
      } else {
        this.data.forEach((v, i) => {
          data.fields.push(v.field);
          data.series[0].data.push({
            value: v.value,
            itemStyle: this.itemStyle ? this.itemStyle(i) : undefined
          });
        });
      }
      this.chartData = data;
    },
    computeOptionProperty() {
      this.chartDomWidth = this.$refs.barChart.clientWidth;
      this.chartGridSpace = this.chartDomWidth - this.gridLeft - this.gridRight;
      this.barCount = parseInt(this.chartGridSpace / this.fieldWidth, 10);
      this.chartGridWidth = this.barCount * this.fieldWidth;
      this.showDataZoom = this.barCount < this.chartData.fields.length;
      if (!this.showDataZoom) {
        const paddingFields = Array.from({ length: this.barCount - this.chartData.fields.length }, () => '');
        const paddingData = Array.from({ length: this.barCount - this.chartData.fields.length }, () => 0);
        this.paddedData = {
          name: this.name,
          fields: this.chartData.fields.concat(paddingFields),
          series: this.chartData.series.map(v => {
            return {
              type: 'bar',
              name: v.name,
              label: v.name,
              barWidth: this.barWidth,
              data: v.data.concat(paddingData)
            };
          })
        };
      } else {
        this.paddedData = null;
      }
    },
    chartOption() {
      const displayOption = this.displayOption;
      const chartData = this.paddedData || this.chartData;
      const tooltip = Object.assign({}, ChartStyleHelper.tooltip, {
        trigger: 'item',
        formatter(params) {
          if (!Array.isArray(params)) {
            params = [params];
          }
          return `<div style="padding: 6px;"><div style="font-size: 18px; font-weight: 700;">${params[0].name}</div>${
            params.map(v =>
              `<div style="color: ${v.color.colorStops ? v.color.colorStops[1].color : v.color};">
                ${v.seriesName}: ${ChartStyleHelper.processDisplayOptions(v.data.value, displayOption)}
              </div>`
            ).join('')
          }</div>`;
        }
      });
      const grid = Object.assign({}, ChartStyleHelper.grid, {
        top: 28,
        left: this.gridLeft,
        right: this.gridRight,
        width: this.accurateAdjust ? this.chartGridWidth : this.chartGridSpace,
        bottom: 28
      });
      const xAxisConfig = Object.assign({}, ChartStyleHelper.xAxisStyle, {
        type: 'category',
        data: chartData.fields.map(v => {
          return {
            value: v,
            textStyle: {
              fontWeight: 'bold',
              fontSize: 14
            }
          };
        })
      });
      const yAxisConfig = Object.assign({}, ChartStyleHelper.yAxisStyle, {
        type: 'value',
        axisLabel: {
          color: 'black',
          fontWeight: 'bold',
          fontSize: 14,
          formatter: val => {
            return ChartStyleHelper.processDisplayOptions(val, displayOption);
          }
        }
      });

      const option = {
        tooltip,
        grid,
        xAxis: [xAxisConfig],
        yAxis: [yAxisConfig],
        series: chartData.series,
        color: this.colors || defaultBarChartColor,
        dataZoom: [
          Object.assign({
            show: this.showDataZoom,
            type: 'slider',
            startValue: 0,
            endValue: this.barCount - 1,
            zoomLock: true,
            showDetail: false,
            backgroundColor: '#dae8ed',
            borderColor: '#dae8ed',
            /**
             * handleIcon 是一个透明的没有大小的图标
             */
            handleIcon: 'image://data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            handleSize: 12,
            height: 12,
            bottom: 7,
            dataBackground: {
              lineStyle: {
                opacity: 0
              },
              areaStyle: {
                opacity: 0
              }
            }
          }, this.sliderDataZoom)
        ]
      };
      return option;
    },
    resize() {
      if (this.chart) {
        FuncHelper.debounce(this.resizeChart, 300)();
      }      
    }
  },
  created() {
    if (!this.data && 
        !this.verboseData) {
      throw new Error('GeneralBarChart get no data or verboseData prop.');
    }
    this.computeChartData();
  },
  mounted() {
    this.computeOptionProperty();
    this.chart = this.generateChart();
    window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    if (this.chart) {
      this.chart.dispose();
    }
  }
};

</script>

<style lang="scss" scoped>

</style>
