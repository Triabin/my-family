<!-- 登录页面组件 -->
<template>
  <div class="login-page">
    <div class="login-box">
      <h1>登录</h1>
      <form>
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="form.username" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="form.password" required>
        </div>
        <button type="submit" @click="submit">登录</button>
      </form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { login } from '@/api/userApi';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  username: '',
  password: '',
});

const submit = () => login(form.username, form.password)
    .then(resp => {
      const token = resp.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        router.push('/home');
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    });
</script>
<style lang="css" scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.login-box {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.form-group {
  margin-bottom: 10px;
}
.form-group label {
  display: block;
  font-weight: bold;
}
.form-group input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
</style>
