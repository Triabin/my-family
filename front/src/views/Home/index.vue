<!-- 首页路由页面组件 -->
<template>
  <div class="home-page">
    <header class="home-header">
      <div class="home-header-content">
        <div class="header-left">
          <img src="/favicon.png" style="display: block; width: 48px; height: 48px;" alt="{{ familyName }}">
          <h1 v-if="familyName">{{ familyName }}氏族谱</h1>
          <h1 v-else>首页</h1>
        </div>
        <div class="header-center"></div>
        <div class="header-right">
          <BubblePopover :isVisible="userInfoVisible" @toggleVisible="toggleUserInfoVisible">
            <div class="user-info" @click="toggleUserInfoVisible">
              {{ loginUser?.name || '未登录' }}
            </div>
            <template #popover>
              <div class="user-options">
                <div class="user-option">
                  <a href="/user/info">个人信息</a>
                </div>
                <div class="user-option" @click="handleLogout">退出登录</div>
              </div>
            </template>
          </BubblePopover>

          <button @click="test">切换</button>
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
import { ref, onMounted } from 'vue';
import { getFamilyName } from '@/api/appMainApi';
import { getAllUser } from '@/api/userApi';
import { getUserInfoFromToken, handleLogout } from '@/common/utils';
import type UserVO from '@/models/UserVO';
import MemberCard from '@/components/MemberCard';
import BubblePopover from '@/components/BubblePopover';

const familyName = ref<string>('');
const users = ref<UserVO[]>([]);
const userInfoVisible = ref<boolean>(false);
const loginUser = ref<{ id: string, roleId: number, name: string, username: string } | undefined>();

const toggleUserInfoVisible = () => userInfoVisible.value = !userInfoVisible.value;
const test = () => userInfoVisible.value = true;
/**
 * 刷新用户列表数据
 */
const refreshUser = () => getAllUser().then(resp => {
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

onMounted(() => {
  getFamilyName().then(resp => familyName.value = resp.data);
  refreshUser();
  loginUser.value = getUserInfoFromToken();
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
.header-left {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 3px;
}
.header-center {
  flex-grow: 1;
  display: flex;
  align-items: center;
}
.header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
}
.user-info {
  cursor: pointer;
  display: flex;
  gap: 2px;
}
.user-options {
  top: 100%;
  right: 0;
  background: #ffffff;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 120px;
}
.user-option {
  cursor: pointer;
}
.user-option:hover {
  color: #007bff;
}
.user-option:active {
  color: #0056b3;
  background-color: #e9ecef;
  transform: translateY(2px);
}

.home-main {
  width: 100%;
  display: flex;
  justify-content: center;
}
.home-main-content {
  width: 1280px;
  min-height: 90vh;
  background: #f5f5f5;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  padding: 10px;
  border-radius: 6px;
}

@media (prefers-color-scheme: dark) {
  .home-header {
    background: #333333;
  }
  .home-main-content {
    background: #2b2828;
  }
}
</style>
