<template>
  <div class="about-page">
    <h1>О приложении</h1>
    
    <div class="about-content">
      <div class="about-card">
        <h2>Технологии</h2>
        <div class="tech-badges">
          <span class="badge">Nuxt 3</span>
          <span class="badge">Vue 3</span>
          <span class="badge">Pinia</span>
          <span class="badge">TypeScript</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Страница "О приложении"
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.about-page h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.about-card h2 {
  color: #42b983;
  margin-bottom: 1rem;
}

.about-card ul {
  padding-left: 1.5rem;
  line-height: 1.8;
}

.tech-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.badge {
  background: #42b983;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.85rem;
}
</style>