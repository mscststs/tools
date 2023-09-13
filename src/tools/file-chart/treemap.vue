<script setup lang="ts">
import { computed } from "vue";
import { filesize } from "filesize";


import VChart from "vue-echarts";

import { use, ComposeOption } from "echarts/core";
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption
} from 'echarts/components';
import { TreemapChart, TreemapSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';


use([TitleComponent, TooltipComponent, TreemapChart, CanvasRenderer]);
type EChartsOption = ComposeOption<
  TitleComponentOption | TooltipComponentOption | TreemapSeriesOption
>;

const props = defineProps<{
  data: any[];
}>()

// provide(THEME_KEY, "light");

function getLevelOption() {
  return [
    {
      itemStyle: {
        borderWidth: 0,
        gapWidth: 5
      }
    },
    {
      itemStyle: {
        gapWidth: 1
      }
    },
    {
      colorSaturation: [0.35, 0.5],
      itemStyle: {
        gapWidth: 1,
        borderColorSaturation: 0.6
      }
    }
  ];
}

const option = computed<EChartsOption>(() => {
  return {

    title: {
      text: '',
      left: 'center'
    },

    tooltip: {
      formatter: function (info: any) {
        var value = info.value;
        var treePathInfo = info.treePathInfo;
        var treePath = [];

        for (var i = 1; i < treePathInfo.length; i++) {
          treePath.push(treePathInfo[i].name);
        }

        return [
          '<div class="tooltip-title">' +
          treePath.join('/') +
          '</div>',
          'Disk Usage: ' + filesize(value)
        ].join('');
      }
    },

    series: [
      {
        name: 'Disk Usage',
        type: 'treemap',
        visibleMin: 300,
        label: {
          show: true,
          formatter: '{b}'
        },
        itemStyle: {
          borderColor: '#fff'
        },
        levels: getLevelOption(),
        data: props.data
      }
    ]
  }
})

</script>

<template>
  <v-chart class="chart w-full flex-auto overflow-hidden" autoresize :option="option" />
</template>