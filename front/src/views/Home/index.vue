<!-- 首页路由页面组件 -->
<template>
  <h1 v-if="familyName">{{ familyName }}氏族谱</h1>
  <h1 v-else>首页</h1>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getFamilyName } from '@/api/appMainApi';

const familyName = ref('');
getFamilyName().then(name => familyName.value = name);
</script>

<style lang="css" scoped>

</style>
