// used to access common chart styles like axis, legend
import DisplayOptionHelper from '@/helpers/displayOptionHelper';

export default class ChartStyleHelper {
  static processDisplayOptions(val, displayOptions) {
    if (val === null) return null;
    const result = DisplayOptionHelper.transform(val, displayOptions).result;
    const unit = DisplayOptionHelper.getUnit(displayOptions);
    return `${result}${unit}`;
  }

  // common stylings
  static axisColor = '#d0d2d4';

  static catColors = [
    '#eea78f',
    '#81b4f8',
    '#8fddee',
    '#c1e787',
    '#eed88f',
    '#ee8f8f',
    '#e196f9',
    '#a497f9',
    '#b4c2d3',
    '#5463e4',
    '#be4c4c',
    '#62aec1'
  ];

  static tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      label: {
        show: true,
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: 'white',
        borderColor: 'white',
        shadowBlur: 0
      }
    },
    backgroundColor: 'rgba(0, 0, 0, .75)'
  };

  static legend = {
    top: 0,
    left: 24,
    type: 'scroll',
    orient: 'horizontal',
    textStyle: {
      fontSize: 14,
      color: '#3f4647'
    }
  };

  static grid = {
    top: 50,
    left: 24,
    right: 48,
    bottom: 0,
    containLabel: true
  };

  static xAxisStyle = {
    axisLine: {
      lineStyle: {
        width: 2,
        color: ChartStyleHelper.axisColor
      }
    },
    axisTick: {
      lineStyle: {
        width: 2,
        color: ChartStyleHelper.axisColor
      }
    },
    axisLabel: {
      color: 'black',
      showMinLabel: true,
      showMaxLabel: true
    }
  };

  static yAxisStyle = {
    type: 'value',
    axisLine: {
      lineStyle: {
        width: 2,
        color: ChartStyleHelper.axisColor
      }
    },
    axisTick: {
      lineStyle: {
        width: 2,
        color: ChartStyleHelper.axisColor
      }
    },
    axisLabel: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 14
    },
    splitLine: {
      lineStyle: {
        type: 'dotted',
        width: 2,
        color: '#e2e2e2'
      }
    }
  };

  static sliderStyle = {
    type: 'slider',
    bottom: 0,
    height: 24,
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
  };
}
