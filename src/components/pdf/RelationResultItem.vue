<template>
  <div class="entity-relation-value-item" ref="relationResultItem" @click="onRelationClick($event, relation)">
    <div class="relation-item relation-item-one">
      <div class="title">{{ relation.entityNames[0].entityName }}</div>
      <div class="name-detail row">
        <div class="color-box" :style="`background-color: ${relation.entityNames[0].bgColor}`"></div>
        <div class="value">{{ relation.entityNames[0].text }}</div>
      </div>
    </div>
    <div class="devider">
      {{ relation.relationName }}
      <svg class="icon icon-up" v-svg symbol="divider1" size="6 11"></svg>
      <svg class="icon icon-down" v-svg symbol="divider2" size="6 11"></svg>
    </div>
    <div class="relation-item relation-item-two">
      <div class="title">{{ relation.entityNames[1].entityName }}</div>
      <div class="name-detail row">
        <div class="color-box" :style="`background-color: ${relation.entityNames[1].bgColor}`"></div>
        <div class="value">{{ relation.entityNames[1].text }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Ref } from 'vue-property-decorator';

@Component
export default class RelationResultItem extends Vue {
  @Prop({ type: Object })
  relation!: PlainObject

  @Ref('relationResultItem') relationResultItem!: HTMLElement

  get borderClassName(): string {
    return this.relation.entityNames[0].borderClassName;
  }

  // @ts-ignore
  onRelationClick(e, data): void {
    const self = this.relationResultItem;

    // find all highlight elements

    const elArryLike = Array.prototype.slice.call(document.querySelectorAll('.special-value-item'));
    elArryLike.forEach(el => {
      if (el !== self) el.setAttribute('class', 'entity-relation-value-item');
    });

    // repeat click then cancel highlight
    self.classList.toggle('special-value-item');
    // @ts-ignore
    const emitData = data.entityNames.reduce((pre, next) => {
      pre.push(
        // @ts-ignore
        ...next.rects.reduce((pRect, nRect) => {
          pRect.push(
            {
              borderClassName: this.borderClassName,
              page: nRect.pageId,
              uuid: nRect.id,
              top: nRect.top/2,
            }
          );
          return pRect;
        }, [])
      );
      return pre;
    }, []);

    if (self.className.includes('special-value-item')) {
      this.$emit('onHighlightFoucs', {
        type: 'show',
        data: emitData
      });
    } else {
      this.$emit('onHighlightFoucs', {
        type: 'hide',
        data: emitData
      });
    };
    
  }

}
</script>
<style lang="scss" scoped>
.entity-relation-value-item {
  padding: 8px;
  border: 1px solid #E5E5E5;
  .relation-item {
    cursor: pointer;
    .title {
      color: #595959;
      font-size: 12px;
      line-height: 20px;
    }
    .name-detail {
      position: relative;
      padding: 4px 8px;
      margin-top: 4px;
      align-items: center;
      .color-box {
        position: absolute;
        top: 50%;
        left: 0%;
        transform: translateY(-50%);
        width: 4px;
        height: 14px;
        margin-right: 4px;
      }
      .value {
        color: #262626;
        font-size: 14px;
        line-height: 22px;
      }
    }
  }
  .devider {
    position: relative;
    display: inline-block;
    padding: 2px 4px;
    margin: 10px 0;
    background-color: #595959;
    color: #ffffff;
    font-size: 12px;
    line-height: 20px;
    border-radius: 2px;
    .icon {
      position: absolute;
      left: 50%;
      &.icon-up {
        top: 0;
        transform: translate(-50%, -77%);
      }
      &.icon-down {
        bottom: 0;
        transform: translate(-50%, 90%);
      }
    }
  }

  &.special-value-item {
    background-color: #E5E5E5;
  }
}
.entity-relation-value-item + .entity-relation-value-item {
  margin-top: 16px;
}
</style>
