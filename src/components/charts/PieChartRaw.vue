<template>
  <div class="chart" ref="pieChart"></div>
</template>

<script>
import echarts from 'echarts';
import ChartStyleHelper from '@/helpers/chartStyleHelper';
import ChartFunctionHelper from '@/helpers/chartFunctionHelper';
import chartMixin from '@/mixin/chartMixin';

export default {
  name: 'pieChart',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mixins: [chartMixin],
  methods: {
    chartOption() {
      const pieData = {
        legendData: this.data.fields.map(v => {
          return { name: v, icon: 'circle' };
        }),
        seriesData: this.data.fields.map(v => {
          return {
            name: v,
            value: this.data.series[0][v]
          };
        })
      };
      const sum = pieData.seriesData.map(v => v.value).reduce((v, ov) => v + ov, 0);
      const percent = {};
      pieData.seriesData.forEach(v => {
        percent[v.name] = sum === 0 ? (100 * v.value).toFixed(2) : ((100 * v.value) / sum).toFixed(2);
      });

      const legend = Object.assign({}, ChartStyleHelper.legend, {
        textStyle: {
          fontSize: 14,
          color: '#3f4647'
        },
        data: pieData.legendData,
        top: 10,
        formatter: name => {
          if (Number.isNaN(percent[name])) {              
            return name;
          }
          return `${name}: ${percent[name]}%`;
        }
      });

      const option = {
        title: null,
        legend,
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} <br> 占比: {d}%',
          textStyle: {
            color: '#80b8fd'
          },
          backgroundColor: '#000809',
          boxShadow: '0px 6px 10px 0px rgba(0, 0, 0, 0.3)',
          borderRadius: 8,
          opacity: 0.9
        },
        color: ChartStyleHelper.catColors,
        series: [
          {
            type: 'pie',
            radius: ['35%', '60%'],
            center: ['50%', '60%'],
            label: {
              formatter: '{d}%',
              textStyle: {
                fontSize: 14,
                color: '#6d7d82'
              }
            },
            data: pieData.seriesData,
            legendHoverLink: true,
            itemStyle: {
              emphasis: {
                opacity: 1
              }
            }
          }
        ]        
      };
      return option;
    },
    generateChart() {
      const option = this.chartOption();
      const pieChart = echarts.init(this.$refs.pieChart);
      pieChart.setOption(option);
      pieChart.on('finished', () => {
        const imgUrl = pieChart.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff'
        });
        this.$emit('done', imgUrl);
      });
      ChartFunctionHelper.preventLastSeriesUnseleted(pieChart);
      return pieChart;
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
