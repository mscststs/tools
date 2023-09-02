<script setup lang="ts">
import { watchEffect } from "vue"

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  name: string
}>();

const targetUrl = `/assets/icons/${props.name}.svg`;

let svgData :string = ""

watchEffect(async () => {
  svgData = await (await fetch(targetUrl)).text();
  console.log(svgData)
})

</script>

<template>
  
  <svg v-bind="$attrs" v-html="svgData" v-if="svgData"></svg>
</template>