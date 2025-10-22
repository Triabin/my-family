<!-- 首页路由页面组件 -->
<template>
  <div class="home-page">
    <header class="home-header">
      <div class="home-header-content">
        <div style="display: flex; align-items: center; gap: 3px;">
          <img src="/favicon.png" style="display: block; width: 48px; height: 48px;" alt="{{ familyName }}">
          <h1 v-if="familyName">{{ familyName }}氏族谱</h1>
          <h1 v-else>首页</h1>
        </div>
      </div>
    </header>
    <main class="home-main">
      <!-- 首页内容 -->
      <div class="home-main-content">
        <MemberCard v-for="user in users" :key="user.id" :member="user"/>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getFamilyName } from '@/api/appMainApi';
import { getAllUser } from '@/api/userApi';
import type UserVO from '@/models/UserVO';
import MemberCard from '@/components/MemberCard';

const familyName = ref<string>('');
const users = ref<UserVO[]>([]);
getFamilyName().then(resp => familyName.value = resp.data);
getAllUser().then(resp => {
  users.value = resp.data?.sort((a, b) => {
    if (a.birthday && b.birthday) {
      return a.birthday.getTime() - b.birthday.getTime();
    } else if (a.birthday) {
      return 0;
    } else if (b.birthday) {
      return 1;
    } else {
      return 0;
    }
  }).sort((a, b) => a.generation - b.generation)
    .map(user => {
      user.birthday && (user.birthday = new Date(user.birthday));
      user.deathday && (user.deathday = new Date(user.deathday));
      user.updatedAt && (user.updatedAt = new Date(user.updatedAt));
      user.createdAt && (user.createdAt = new Date(user.createdAt));
      return user;
    });
});
</script>

<style lang="css" scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.home-header {
  flex-shrink: 0;
  width: 100%;
  height: 60px;
  background: #cccccc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-header-content {
  display: flex;
  width: 1280px;
}

.home-main {
  width: 100%;
  display: flex;
  justify-content: center;
}
.home-main-content {
  width: 1280px;
  background: #f5f5f5;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  padding: 10px;
  border-radius: 6px;
}

@media (prefers-color-scheme: dark) {
  .home-header {
    background: #333333;
  }
  .home-main-content {
    background: #222222;
  }
}
</style>
