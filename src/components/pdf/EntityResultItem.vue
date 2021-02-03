<template>
  <div class="entity-result-item">
    <div class="entity-name row" @click="onToggleClick">
      <div class="name">{{ entity.entityName }}</div>
      <svg :class="[!reserve && 'reserve']" v-svg symbol="arrow" size="16"></svg>
    </div>
    <transition name="fade">
      <div class="entity-values" v-if="reserve">
        <div
          class="entity-relation-value-item"
          v-for="(entityItem, index) in entity.pos"
          :key="index"
           @click="onResultClick($event, entityItem)"
        >
          <div class="color-box" :style="`background-color: ${ entity.bgColor }`"></div>
          <div class="value">{{ entityItem.text }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

type Entity = {
  bgClassName: string,
  borderClassName: string,
  entityName: string,
  pos: any[]
}

@Component
export default class EntityResultItem extends Vue {
  @Prop({ type: Object })
  entity!: Entity

  values = ['山东龙利生物科技股份有限公司', '多个结果的情况']

  reserve = true
  
  onToggleClick(): void {
    this.reserve = !this.reserve;
  }

  get bgClassName(): string {
    return this.entity.bgClassName;
  }

  get borderClassName(): string {
    return this.entity.borderClassName;
  }

  // @ts-ignore
  onResultClick(e, data): void {
    let targetEl: HTMLElement;
    if (e.target.className.includes('entity-relation-value-item')) {
      targetEl = e.target;
    } else {
      if (e.target.parentNode.className.includes('entity-relation-value-item')) {
        targetEl = e.target.parentNode;
      } else {
        return;
      }
    }

    // find all highlight elements
    const elArryLike = Array.prototype.slice.call(document.querySelectorAll('.special-value-item'));
    elArryLike.forEach(el => {
      if (el !== targetEl) el.setAttribute('class', 'entity-relation-value-item');
    });

    // repeat click then cancel highlight
    targetEl.classList.toggle('special-value-item');
    // @ts-ignore
    const emitData = data.rects.map(el => ({
      borderClassName: this.borderClassName,
      page: el.pageId,
      uuid: el.id,
      top: el.top/2,
    }));

    if (targetEl.className.includes('special-value-item')) {
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
.entity-result-item {
  padding: 8px 0;
  border-bottom: 1px dashed #E5E5E5;
  .entity-name {
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    >svg {
      display: inline-block;
    }
    .reserve {
      transform: rotateZ(180deg);
    }
    .name {
      font-size: 12px;
      line-height: 20px;
      color: #595959;
    }
  }
  .entity-values {
    .entity-relation-value-item {
      position: relative;
      padding: 4px 8px;
      margin-top: 4px;
      cursor: pointer;
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
      &.special-value-item {
        background-color: #E5E5E5;
      }
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
