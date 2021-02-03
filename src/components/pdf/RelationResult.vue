<template>
  <div class="relation-result">
    <div class="title">共抽取{{ results.length }}条关系</div>
    <relation-result-item
      v-for="(relation, index) in results"
      :key="index"
      :relation="relation"
      @onHighlightFoucs="onHighlightFoucs"
    ></relation-result-item>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import RelationResultItem from '@/components/pdf/RelationResultItem.vue';

@Component({
  components: { RelationResultItem }
})
export default class RelationResult extends Vue {
  @Prop({ type: Array })
  results!: []

  @Emit('onHighlightFoucs')
  onHighlightFoucs(res: any) {
    //
  }
}
</script>
<style lang="scss" scoped>
.relation-result {
  padding: 24px 0 24px 24px;
  .title {
    padding-bottom: 12px;
    color: #262626;
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
  }
}
</style>
