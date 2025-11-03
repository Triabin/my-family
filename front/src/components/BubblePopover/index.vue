<!-- 气泡弹窗组件 -->
<template>
  <!-- 触发区域 -->
  <div ref="trigger">
    <slot></slot>
  </div>
  <!-- 弹窗内容 -->
  <Teleport to="body">
    <div class="popover" v-if="props.isVisible" @click.stop>
      <!-- 小三角形 -->
      <div :style="triangleStyle" class="triangle"></div>
      <!-- 弹窗主体 -->
      <div ref="popover" :style="style" class="popover-main">
        <slot name="popover"></slot>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
import { computed, useTemplateRef } from 'vue';

// 父组件传入内容
const props = withDefaults(defineProps<{
  isVisible: boolean;
  outClickClose?: boolean;
}>(), {
  isVisible: false,
  outClickClose: true,
});
const emits = defineEmits(['toggleVisible']);

// DOM元素引用
const trigger = useTemplateRef<HTMLElement>('trigger');
const popover = useTemplateRef<HTMLElement>('popover');

// 响应式数据
const triangleStyle = computed(() => {
  const { triangleTop, triangleLeft } = calcPopoverPosition();
  return {
    top: `${triangleTop + 1}px`, // 手动补一个像素，让小三角形与窗口边缘重合一部分
    left: `${triangleLeft}px`,
  };
});
const style = computed(() => {
  const { top, left, triangleLeft } = calcPopoverPosition();
  const triEdgeLeft = triangleLeft - left - 2; // 手动补2px的边宽
  const polygon = `polygon( 0 0,
                            ${triEdgeLeft}px 0,
                            ${triEdgeLeft}px 1px,
                            ${triEdgeLeft + 20}px 1px,
                            ${triEdgeLeft + 20}px 0,
                            100% 0, 100% 100%,
                            0 100%
                          )`;
  return {
    top: `${top}px`,
    left: `${left}px`,
    clipPath: polygon,
  };
});

// 定义函数
const hidePopover = () => props.isVisible && emits('toggleVisible');
const calcPopoverPosition = () => {
  let top = 0, left = 0, triangleTop = 0, triangleLeft = 0;
  const topOffset = 15;

  if (trigger.value && popover.value) {
    const triggerRect = trigger.value.getBoundingClientRect();
    const popoverRect = popover.value.getBoundingClientRect();
    top = triggerRect.bottom + topOffset;
    left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;

    // 确保弹窗不会超出视口
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = 5;
    if (left + popoverRect.width > viewportWidth) left = viewportWidth - popoverRect.width - 5;
    if (top < 0) top = 5;
    if (top + popoverRect.height > viewportHeight) top = viewportHeight - popoverRect.height - 5;

    // 计算小三角型指针的位置
    triangleTop = top - 8;
    triangleLeft = triggerRect.left + triggerRect.width / 2 - 8;
  }

  return { top, left, triangleTop, triangleLeft };
};
const clickInsidePopover = (e: MouseEvent) => {
  if (!props.isVisible) return;
  if (popover.value) {
    const popoverRect = popover.value.getBoundingClientRect();
    if (e.clientX < popoverRect.left || e.clientX > popoverRect.right || e.clientY < popoverRect.top || e.clientY > popoverRect.bottom) {
      hidePopover();
    }
  }
};
</script>
<style lang="css" scoped>
.popover {
  position: absolute;
  z-index: 999;
}
.triangle {
  position: fixed;
  width: 16px;
  height: 16px;
  transform: rotate(45deg);
  border-radius: 6px;
  background: #ffffff;
  backdrop-filter: blur(2px);
  border-top: 1px solid #ffffff;
  border-left: 1px solid #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.popover-main {
  position: fixed;
  border-radius: 6px;
  background: #cccccc;
  backdrop-filter: blur(2px);
  border: 1px solid #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
