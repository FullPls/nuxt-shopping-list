<!-- layouts/default.vue -->
<template>
  <div>
    <!-- Навигация, общая для всех страниц -->
    <nav style="padding: 1rem; background: #2c3e50; color: white;">
  <NuxtLink to="/" style="color: white; margin-right: 1rem;">Главная</NuxtLink>
  <NuxtLink to="/history" style="color: white; margin-right: 1rem;">История</NuxtLink>
  <NuxtLink to="/about" style="color: white;">О приложении</NuxtLink>
</nav>
    <!-- Сюда будут подставляться страницы -->
    <NuxtPage />
  </div>
</template>
