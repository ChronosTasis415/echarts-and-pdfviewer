<template>
  <div class="charts-list">
    <div class="chart-item">
      <div class="title">bar-chart</div>
      <BarChartRaw v-if="barRender" :data="barChartData"></BarChartRaw>
    </div>
    <div class="chart-item">
      <div class="title">dagre-chart</div>
      <DagreChartRaw v-if="dagreRender" :data="dagreChartData"></DagreChartRaw>
    </div>
    <!-- <div class="chart-item">
      <div class="title">Kline-bar-chart</div>
      <KLineBarChartRaw></KLineBarChartRaw>
    </div> -->
    <div class="chart-item">
      <div class="title">line-bar-chart</div>
      <LineBarChartRaw v-if="lineBarRender" :data="lineBarChartData"></LineBarChartRaw>
    </div>
    <div class="chart-item">
      <div class="title">line-chart</div>
      <LineChartRaw v-if="lineRender" :data="lineChartData"></LineChartRaw>
    </div>
    <div class="chart-item">
      <div class="title">pie-chart</div>
      <PieChartRaw v-if="pieRender" :data="pieChartData"></PieChartRaw>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import echarts from 'echarts';
import BarChartRaw from '@/components/charts/BarChartRaw';
import DagreChartRaw from '@/components/charts/DagreChartRaw';
// import KLineBarChartRaw from '@/components/charts/KLineBarChartRaw';
import LineBarChartRaw from '@/components/charts/LineBarChartRaw';
import LineChartRaw from '@/components/charts/LineChartRaw';
import PieChartRaw from '@/components/charts/PieChartRaw';

export default {
  components: {
    BarChartRaw,
    DagreChartRaw,
    // KLineBarChartRaw,
    LineBarChartRaw,
    LineChartRaw,
    PieChartRaw
  },
  name: 'chartsPage',
  data() {
    return {
      barRender: false,
      lineRender: false,
      pieRender: false,
      dagreRender: false,
      lineBarRender: false,
      barChartData: null,
      lineChartData: null,
      lineBarChartData: null,
      pieChartData: null,
      dagreChartData: null,
    };
  },
  methods: {
    getBarChartData() {
      this.barRender = false;
      axios.get('/mock/bar-chart-multiple.json').then((response) => {
        this.barRender = true;
        this.barChartData = response.data;
        console.log(response.data);
      });
    },
    getLineChartData() {
      this.lineRender = false;
      axios.get('/mock/line-chart-multiple.json').then((response) => {
        this.lineRender = true;
        this.lineChartData = response.data;
        console.log(response.data);
      });
    },
    getLineBarChartData() {
      this.lineBarRender = false;
      axios.get('/mock/line-bar-chart-mulitple.json').then((response) => {
        this.lineBarRender = true;
        this.lineBarChartData = response.data;
        console.log(response.data);
      });
    },
    getPieChartData() {
      this.pieRender = false;
      axios.get('/mock/bar-chart.json').then((response) => {
        this.pieRender = true;
        this.pieChartData = response.data;
        console.log(response.data);
      });
    },
    getDagreChartData() {
      this.dagreRender = false;
      axios.get('/mock/dagre-chart.json').then((response) => {
        this.dagreRender = true;
        this.dagreChartData = response.data;
        console.log(response.data);
      });
    }
  },
  mounted() {
    console.log('mounted');
    this.getBarChartData();
    this.getLineChartData();
    this.getLineBarChartData();
    this.getDagreChartData();
    this.getPieChartData();
  }
};
</script>
<style lang="scss" scoped>
.charts-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  row-gap: 20px;
  .chart-item {
    height: 400px;
    padding: 20px;
    border: 1px solid #ddd;
  }
}
</style>
