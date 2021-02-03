<template>
  <div class="chart" ref="chart" :id="chartId"></div>
</template>

<script>
import echarts from 'echarts';
import chartMixin from '@/mixin/chartMixin';

// const upColor = '#f04864';
// const downColor = '#2fc25b';

export default {
  name: 'kLineBarChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  mixins: [chartMixin],
  data() {
    return {
      candleView: null,
      barView: null,
      slider: null,
      title: '日K',
      chartData: null,
      start: '',
      end: ''
    };
  },
  methods: {
    // transformData() {
    //   const data = {
    //     categoryData: [],
    //     values: [],
    //     volumes: []
    //   };
    //   this.data.forEach((val, index) => {
    //     data.categoryData.push(val.time);
    //     data.values.push([val.start, val.end, val.min, val.max, val.volumn]);
    //     data.volumes.push([index + 1, val.volumn, val.start <= val.end ? 1 : -1]);
    //   });
    //   return data;
    // },
    splitData() {
      const data = {
        categoryData: [],
        values: [],
        volumes: [],
        delta: [],
        ma5: [],
        ma10: [],
        ma20: []
      };
      // const categoryData = [];
      // const values = [];
      // const volumes = [];
      // for (let i = 0; i < rawData.length; i++) {
      //   categoryData.push(rawData[i].splice(0, 1)[0]);
      //   values.push(rawData[i]);
      //   volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
      // }
      this.data.forEach((item, index) => {
        data.categoryData.push(item.date);
        const deltaValues = (item.close - (item.close / (1 + item.delta))).toFixed(2);
        data.values.push([item.open, item.close, item.lowest, item.highest, item.volumes, item.delta, deltaValues, item.ma5, item.ma10, item.ma20]);
        // data.volumes.push([index, item.open, item.close, item.lowest, item.highest, item.volumes, item.delta, deltaValues, item.ma5, item.ma10, item.ma20]);
        data.volumes.push([index, item.volumes, item.open > item.close ? 1 : -1]);
        // data.delta.push(item.delta);
        data.ma5.push(item.ma5);
        data.ma10.push(item.ma10);
        data.ma20.push(item.ma20);
      });

      return data;
    },
    chartOption() {
      // const data = this.transformData();
      const datas = this.splitData();

      const calculateMA = (dayCount, data) => {
        const result = [];
        for (let i = 0, len = data.values.length; i < len; i++) {
          if (i < dayCount) {
            result.push('-');
          } else {
            let sum = 0;
            for (let j = 0; j < dayCount; j++) {
              sum += data.values[i - j][1];
            }
            result.push(+(sum / dayCount).toFixed(3));
          }
        }
        return result;
      };
      const option = {
        backgroundColor: '#FAFBFC',
        animation: false,
        // legend: {
        //   top: 54,
        //   left: 10,
        //   data: ['MA5', 'MA10', 'MA20'],
        //   formatter: name => {
        //     return `${name}`;
        //   }
        // },
        // '#f55d4c',
        color: ['#4daada', '#f2b062', '#de7ef6'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          backgroundColor: '#000809',
          opacity: 0.9,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#999999'
          },
          formatter: params => {
            const date = `<div style="color:#fff;font-size:18px;margin-bottom:20px;"> ${params[params[0].axisIndex].name}</div>`;
            const open = `<div style="color:#999;font-size:14px;">开盘&nbsp;&nbsp;&nbsp;<span style="color:#f55d4c;float:right;">${params[params[0].axisIndex].data[1]}</span></div>`;
            const highest = `<div style="color:#999;font-size:14px;">最高&nbsp;&nbsp;&nbsp;<span style="color:#f55d4c;float:right;">${params[params[0].axisIndex].data[4]}</span></div>`;
            const lowest = `<div style="color:#999;font-size:14px;">最低&nbsp;&nbsp;&nbsp;<span style="color:#46d0a0;float:right;">${params[params[0].axisIndex].data[3]}</span></div>`;
            const close = `<div style="color:#999;font-size:14px;">收盘&nbsp;&nbsp;&nbsp;<span style="color:#46d0a0;float:right;">${params[params[0].axisIndex].data[2]}</span></div><br/>`;
            // const delta = `<div style="color:#999;font-size:14px;">涨跌幅&nbsp;&nbsp;&nbsp;<span style="color:#46d0a0;float:right;">${params[params[0].axisIndex].data[6]}</span></div>`;
            // const deltaValues = `<div style="color:#999;font-size:14px;">涨跌额&nbsp;&nbsp;&nbsp;<span style="color:#46d0a0;float:right;">${params[params[0].axisIndex].data[7]}</span></div><br/>`;
            const volumes = `<div style="color:#999;font-size:14px;">成交量&nbsp;&nbsp;&nbsp;<span style="color:#46d0a0;float:right;">${params[params[0].axisIndex].data[5]}</span></div>`;
            return `<div style="background:#000809;">${date}${open}${highest}${lowest}${close}${volumes}</div>`;
          }
          // position: (pos, params, el, elRect, size) => {
          //   const obj = { top: 10 };
          //   obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          //   return obj;
          // }
          // extraCssText: 'width: 170px'
        },
        axisPointer: {
          link: { xAxisIndex: [0, 1] },
          label: {
            backgroundColor: '#45a8cc'
          },
          lineStyle: {
            color: '#45a8cc',
            type: 'dotted'
          }
        },
        // toolbox: {
        //   feature: {
        //     dataZoom: {
        //       yAxisIndex: true
        //     },
        //     brush: {
        //       type: ['lineX', 'clear']
        //     }
        //   }
        // },
        // brush: {
        //   xAxisIndex: 'all',
        //   brushLink: 'all',
        //   outOfBrush: {
        //     colorAlpha: 0.1
        //   }
        // },
        visualMap: {
          show: false,
          seriesIndex: 4,
          dimension: 2,
          pieces: [{
            value: 1,
            color: '#46d0a0'
          }, {
            value: -1,
            color: '#f55d4c'
          }]
        },
        grid: [
          {
            left: '7%',
            right: '3%',
            height: '50%',
            top: '100',
            show: true,
            borderColor: '#FAFBFC',
            backgroundColor: '#F4F7F9'
          },
          {
            left: '7%',
            right: '3%',
            top: '370',
            height: '16%',
            show: true,
            borderColor: '#FAFBFC',
            backgroundColor: '#F4F7F9'
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: datas.categoryData,
            scale: true,
            boundaryGap: false,
            // axisLine: { onZero: false },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              z: 100
            },
            axisTick: {
              lineStyle: {
                color: '#CDD8E6'
              }
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#CDD8E6'
              }
            },
            splitLine: {
              show: true,
              // interval: 2,
              lineStyle: {
                color: '#E2E8EF'  
              }
            },
            axisLabel: {
              color: '#6d7d82' 
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: datas.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: { 
              onZero: false,
              lineStyle: {
                color: '#CDD8E6'
              } 
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
            // axisPointer: {
            //     label: {
            //         formatter: function (params) {
            //             var seriesValue = (params.seriesData[0] || {}).value;
            //             return params.value
            //             + (seriesValue != null
            //                 ? '\n' + echarts.format.addCommas(seriesValue)
            //                 : ''
            //             );
            //         }
            //     }
            // }
          },
          {
            type: 'category',
            boundaryGap: false,
            data: datas.categoryData,
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#CDD8E6'
              }
            }
          }
        ],
        yAxis: [
          {
            scale: true,
            splitArea: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#E2E8EF'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#CDD8E6'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#CDD8E6'
              }
            },
            axisLabel: {
              color: '#6d7d82'
            }
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: false },
            // axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#CDD8E6'
              }
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 0,
            end: 100
          },
          {
            type: 'slider',
            top: '0%',
            backgroundColor: 'rgba(0,0,0,0.04)',
            fillerColor: 'rgba(0,0,0,0.04)',
            handleIcon: 'image:///static/handlegray.svg',
            handleSize: '95%',
            dataBackground: {
              lineStyle: {
                color: '#cddde4'
              },
              areaStyle: {
                color: '#cddde4'
              }
            }          
          }
        ],
        series: [
          {
            name: 'Dow-Jones index',
            type: 'candlestick',
            data: datas.values,
            itemStyle: {
              normal: {
                color: '#f55d4c',
                color0: '#46d0a0',
                borderColor: null,
                borderColor0: null
              }
            },
            tooltip: {
              formatter: (param) => {
                param = param[0];
                return [
                  `Date: ${param.name}<hr size=1 style="margin: 3px 0">`,
                  `Open: ${param.data[0]}<br/>`,
                  `Close: ${param.data[1]}<br/>`,
                  `Lowest: ${param.data[2]}<br/>`,
                  `Highest: ${param.data[3]}<br/>`
                ].join('');
              }
            }
          },
          {
            name: 'MA5',
            type: 'line',
            data: calculateMA(5, datas),
            smooth: true,
            symbol: 'none',
            lineStyle: {
              normal: { opacity: 0.5,
                color: '#4daada' }
            }
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10, datas),
            smooth: true,
            symbol: 'none',

            lineStyle: {
              normal: { opacity: 0.5,
                color: '#f2b062' }
            }
          },
          {
            name: 'MA20',
            type: 'line',
            data: calculateMA(20, datas),
            smooth: true,
            symbol: 'none',

            lineStyle: {
              normal: { opacity: 0.5,
                color: '#de7ef6' }
            }
          },
          {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            barMaxWidth: 60,
            data: datas.volumes,
            itemStyle: {
              color: '#f55d4c',
              color0: '#46d0a0'
            }
          }
        ]
      };
      return option;
    },
    generateChart() {
      const chart = echarts.init(this.$refs.chart);
      const option = this.chartOption();
      // chart.on('mouseover', (params) => {
      //   // 控制台打印数据的名称
      //   this.a = params.data[8];
      //   console.log(params);
      // });
      chart.on('finished', () => {
        const imgUrl = chart.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff'
        });
        this.$emit('done', imgUrl);
      });
      chart.setOption(option);
      return chart;
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
  // mounted() {
  //   if (this.data.length === 0) {
  //     return;
  //   }
  //   this.chart = this.generateChart();
  //   window.addEventListener('resize', this.resize);
  // },
};
</script>
<style lang="scss" scoped>
.chart{
  width: 100%;
  height: 520px;
}
</style>
