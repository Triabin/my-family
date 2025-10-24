<!-- 成员信息卡片组件 -->
<template>
  <div class="member-card"
      :style="{ filter: !props.member.alive ? 'grayscale(100%)' : 'none' }"
      :title="props.member.alive ? '' : '已故'">
    <div class="name">
      {{ props.member.name }}
    </div>
    <div class="biography">
      {{ props.member.biography }}
    </div>
    <div class="birth-death">
      <span class="birthday">
        {{ props.member.birthday?.format('yyyy-MM-dd') || '?' }}
      </span>
      <span v-if="!props.member.alive">~</span>
      <span v-if="!props.member.alive" class="deathday">
        {{ props.member.deathday?.format('yyyy-MM-dd') || '?' }}
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import UserVO from '@/models/UserVO';

const props = defineProps<{ member: UserVO }>();
</script>
<style lang="css" scoped>
.member-card {
  width: 200px;
  height: 120px;
  background-color: #cccccc;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
}

.name {
  flex: 2;
  font-size: 2em;
  font-weight: bold;
  line-height: 1.2;
}

.biography {
  flex: 3;
  display: flex;
  gap: 5px;
}

.birth-death {
  flex: 1;
}

@media (prefers-color-scheme: dark) {
  .member-card {
    background-color: #213547;
  }
}
</style>
