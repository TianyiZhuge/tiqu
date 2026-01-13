<template>
  <svg
    class="icon-svg"
    :class="[
      `icon-${size}`,
      { 'icon-spin': spin }
    ]"
    :width="sizeValue"
    :height="sizeValue"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="strokeColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    v-bind="$attrs"
  >
    <!-- Paths -->
    <path
      v-for="(path, index) in iconData.paths"
      :key="`path-${index}`"
      :d="path"
    />

    <!-- Circles -->
    <circle
      v-for="(circle, index) in iconData.circles"
      :key="`circle-${index}`"
      :cx="circle.cx"
      :cy="circle.cy"
      :r="circle.r"
    />

    <!-- Polygons -->
    <polygon
      v-for="(polygon, index) in iconData.polygons"
      :key="`polygon-${index}`"
      :points="polygon.points"
    />

    <!-- Rectangles -->
    <rect
      v-for="(rect, index) in iconData.rects"
      :key="`rect-${index}`"
      :x="rect.x"
      :y="rect.y"
      :width="rect.width"
      :height="rect.height"
      :rx="rect.rx"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { icons } from './icons.js'

const props = defineProps({
  // 图标名称
  name: {
    type: String,
    required: true
  },
  // 尺寸
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  // 颜色（使用 currentColor 继承父级颜色）
  color: {
    type: String,
    default: 'currentColor'
  },
  // 描边宽度
  strokeWidth: {
    type: [Number, String],
    default: 2
  },
  // 旋转动画
  spin: {
    type: Boolean,
    default: false
  }
})

// 尺寸映射
const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40
}

const sizeValue = computed(() => sizeMap[props.size] || 20)

const strokeColor = computed(() => props.color)

// 获取图标数据
const iconData = computed(() => {
  const icon = icons[props.name]
  if (!icon) {
    console.warn(`[Icon] Unknown icon: ${props.name}`)
    return { paths: [], circles: [], polygons: [], rects: [] }
  }
  return {
    paths: icon.paths || [],
    circles: icon.circles || [],
    polygons: icon.polygons || [],
    rects: icon.rects || []
  }
})
</script>

<style lang="scss" scoped>
.icon-svg {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}

// 尺寸类
.icon-xs { width: 12px; height: 12px; }
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }
.icon-2xl { width: 40px; height: 40px; }

// 旋转动画
.icon-spin {
  animation: icon-spin 1s linear infinite;
}

@keyframes icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
