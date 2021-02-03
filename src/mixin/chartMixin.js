import FuncHelper from '@/helpers/funcHelper';

const mixinChart = {
  data() {
    return {
      chart: null
    };
  },
  methods: {
    resize() {
      if (this.chart) {
        FuncHelper.debounce(this.chart.resize, 300)();
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
export default mixinChart;
