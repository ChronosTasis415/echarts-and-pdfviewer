<template>
  <div class="entity-result">
    <div class="title">共抽取{{ results.length }}个实体</div>
    <entity-result-item v-for="(entity, index) in results" :key="index" :entity="entity" @onHighlightFoucs="onHighlightFoucs"></entity-result-item>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import EntityResultItem from '@/components/pdf/EntityResultItem.vue';
import { colorList } from '@/helpers/colorList';

@Component({
  components: { EntityResultItem }
})
export default class EntityResult extends Vue {
  @Prop({ type: Array })
  results!: []

  colorList = colorList

  @Emit('onHighlightFoucs')
  onHighlightFoucs(res: any) {
    //
  }
}
</script>
<style lang="scss" scoped>
.entity-result {
  padding: 24px 0 24px 24px;
  .title {
    padding-bottom: 12px;
    color: #262626;
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
    border-bottom: 1px dashed #E5E5E5;;
  }
}
</style>
