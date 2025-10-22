<!-- 成员信息卡片组件 -->
<template>
  <div class="member-card">
    <div class="name">{{ props.member.name }}</div>
    <div class="biography">{{ props.member.biography }}</div>
    <div class="birthday">生日：{{ props.member.birthday?.format('yyyy-MM-dd') }}</div>
    <div v-if="props.member.deathday"
         class="deathday">
      逝世日期：{{ props.member.deathday?.format('yyyy-MM-dd') }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import UserVO from '@/models/UserVO';

const props = defineProps<{ member: UserVO }>();
</script>
<style lang="css" scoped>
.member-card {
  width: 300px;
  height: 200px;
  background-color: #cccccc;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

@media (prefers-color-scheme: dark) {
  .member-card {
    background-color: #213547;
  }
}
</style>
