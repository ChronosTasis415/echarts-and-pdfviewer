<template>
  <div :id="chartId" ref="chart" class="chart"></div>
</template>

<script>
import G6 from '@antv/g6';
import Plugins from '@antv/g6-plugins';
import StringHelper from '@/helpers/stringHelper';

const plugin = new Plugins['layout.dagre']();

function processRootNodes(rootNode, orgData, edges) {
  orgData.forEach(edge => {
    if (edge.source.name === rootNode) {
      if (!edge.added) {
        edges.push(edge);
        edge.added = true;
      }
      processRootNodes(edge.target.name, orgData, edges);
    }
  });
}

export default {
  name: 'DagreChart',
  data() {
    return {
      chart: null,   
      chartId: StringHelper.getUniqueId()
    };
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  computed: {
    chartData() {
      const nodeMap = {};
      const nodes = [];
      const edges = [];

      // for better visualization
      // look up for root nodes
      const [...copyData] = this.data; // deep copy
      copyData.sort(() => (Math.random() > 0.5 ? -1 : 1));

      const sourceNodes = {};
      const targetNodes = {};
      const rootNodes = {};
      copyData.forEach((edge) => {
        sourceNodes[edge.source.name] = true;
        targetNodes[edge.target.name] = true;
      });

      // exists in sourceNodes but not in targetNodes
      Object.keys(sourceNodes).forEach(key => {
        if (!targetNodes[key]) {
          rootNodes[key] = true;
        }
      });

      const processedEdges = [];

      Object.keys(rootNodes).forEach(key => {
        processedEdges.concat(processRootNodes(key, this.data, processedEdges));
      });

      // TODO: refactor??
      processedEdges.forEach((edge) => {
        edges.push({
          source: edge.source.name,
          target: edge.target.name,
          value: edge.relationship.value
        });
        if (!nodeMap[edge.source.name]) {
          nodeMap[edge.source.name] = true;
          nodes.push({
            id: edge.source.name,
            label: edge.source.name,
            type: edge.source.type || 'person'
          });
        }

        if (!nodeMap[edge.target.name]) {
          nodeMap[edge.target.name] = true;
          nodes.push({
            id: edge.target.name,
            label: edge.target.name,
            type: edge.target.type || 'person'
          });
        }
      });
      return {
        nodes,
        edges
      };
    }
  },
  mounted() {
    this.chart = new G6.Net({
      id: this.chartId,
      fitView: 'autoZoom',
      grid: null,
      height: 324,
      modes: { // just allow drag and zoom
        default: ['dragBlank', 'wheelZoom'],
        drag: ['dragCanvas', 'wheelZoom']
      },
      useAnchor: true,
      plugins: [plugin]
    });

    this.chart.source(this.chartData.nodes, this.chartData.edges);

    this.chart.node().shape('type', (value) => {
      if (value.indexOf('company') > -1) {
        return 'rect';
      }
      return 'circle';
    }).color('type', (value) => {
      if (value === 'listed-company') {
        return 'green';
      } else if (value === 'private-company') {
        return '#eea78f';
      }
      return 'red';
    });

    this.chart.edge().label('value');
    this.chart.edge().shape('arrow');    
    this.chart.render();
  },
  beforeDestroy() {
    this.chart.destroy();
  }
};
</script>

<style lang="scss" scoped>
.chart{
  width: 100%;
}
</style>

