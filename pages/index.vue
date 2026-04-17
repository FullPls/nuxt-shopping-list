<template>
  <div class="shopping-list-app">
    <div class="page-header">
      <h1>Мой список покупок</h1>
      <p>Полноценное full-stack приложение на Nuxt 3</p>
    </div>

    <div class="filters-panel">
      <input
        v-model="filters.search"
        @input="loadItems"
        placeholder="Поиск товаров..."
        class="filter-input"
      />
      <select v-model="filters.category" @change="loadItems" class="filter-select">
        <option value="">Все категории</option>
        <option value="Молочные">Молочные</option>
        <option value="Хлебобулочные">Хлебобулочные</option>
        <option value="Фрукты">Фрукты</option>
        <option value="Овощи">Овощи</option>
        <option value="Бакалея">Бакалея</option>
      </select>
      <select v-model="filters.completed" @change="loadItems" class="filter-select">
        <option value="">Все статусы</option>
        <option value="false">Не выполнено</option>
        <option value="true">Выполнено</option>
      </select>
      <button @click="loadStats" class="refresh-btn" :disabled="loadingStats">
        {{ loadingStats ? 'Обновление...' : 'Обновить статистику' }}
      </button>
    </div>

    <div class="add-item-card">
      <h3>Добавить новый товар</h3>
      <div class="add-item-form">
        <input
          v-model="newItem.name"
          placeholder="Название товара"
          class="form-input"
          :disabled="addingItem"
        />
        <input
          v-model.number="newItem.quantity"
          type="number"
          min="1"
          placeholder="Количество"
          class="form-input"
          :disabled="addingItem"
        />
        <select v-model="newItem.category" class="form-select" :disabled="addingItem">
          <option value="">Выберите категорию</option>
          <option value="Молочные">Молочные</option>
          <option value="Хлебобулочные">Хлебобулочные</option>
          <option value="Фрукты">Фрукты</option>
          <option value="Овощи">Овощи</option>
          <option value="Бакалея">Бакалея</option>
        </select>
        <button @click="addItem" class="add-btn" :disabled="addingItem">
          {{ addingItem ? 'Добавление...' : 'Добавить' }}
        </button>
      </div>
      <div v-if="message" class="message" :class="message.type">
        {{ message.text }}
      </div>
    </div>

    <div class="content-area">
      <div v-if="loading" class="loading-state">Загружаем список покупок...</div>
      <div v-else-if="error" class="error-state">
        <p>Ошибка: {{ error }}</p>
        <button @click="loadItems" class="retry-btn">Повторить попытку</button>
      </div>
      <div v-else-if="!items.length" class="empty-state">
        <p>Ваш список покупок пуст</p>
        <p>Добавьте первый товар!</p>
      </div>
      <div v-else class="items-section">
        <div class="section-header">
          <h2>Список товаров ({{ items.length }})</h2>
          <button @click="loadItems" class="action-btn" :disabled="loading">Обновить</button>
        </div>
        <ul class="products-list">
          <ProductCard
            v-for="item in items"
            :key="item.id"
            :product="item"
            @toggle="toggleItem"
            @edit="editItem"
            @delete="deleteItem"
          />
        </ul>
      </div>

      <div v-if="statsData" class="stats-panel">
        <div class="stats-header">
          <h3>Статистика</h3>
          <span class="timestamp">Обновлено: {{ formatTime(statsData.timestamp) }}</span>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ statsData.data.totalItems }}</div>
            <div class="stat-label">Всего товаров</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ statsData.data.totalQuantity }}</div>
            <div class="stat-label">Общее количество</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ statsData.data.completedItems }}</div>
            <div class="stat-label">Выполнено</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ statsData.data.remainingItems }}</div>
            <div class="stat-label">Осталось</div>
          </div>
        </div>
        <div class="stats-details">
          <h4>По категориям:</h4>
          <div class="categories-list">
            <span v-for="(count, category) in statsData.data.categories" :key="category" class="category-tag">
              {{ category }}: {{ count }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import ProductCard from '@/components/ProductCard.vue';

// Фильтры
const filters = reactive({
  search: '',
  category: '',
  completed: '',
});

// Получение товаров с сервера (реактивные query)
const { data: apiResponse, refresh: refreshItems, pending: loading, error } = await useFetch('/api/items', {
  lazy: true,
  server: true,
  query: computed(() => ({
    search: filters.search,
    category: filters.category,
    completed: filters.completed,
  })),
});

// Массив товаров из ответа API
const items = computed(() => apiResponse.value?.data || []);

// Статистика
const { data: statsResponse, refresh: refreshStats } = await useFetch('/api/stats', {
  lazy: true,
  server: true,
});
const statsData = computed(() => statsResponse.value);

// Новая форма
const newItem = reactive({
  name: '',
  quantity: 1,
  category: '',
});

const message = ref(null);
const addingItem = ref(false);
const loadingStats = ref(false);

function showMessage(text, type = 'success') {
  message.value = { text, type };
  setTimeout(() => (message.value = null), 3000);
}

async function loadItems() {
  await refreshItems();
  if (!error.value) showMessage('Список обновлён', 'success');
}

async function loadStats() {
  loadingStats.value = true;
  await refreshStats();
  loadingStats.value = false;
  showMessage('Статистика обновлена', 'info');
}

async function addItem() {
  if (!newItem.name.trim()) {
    showMessage('Введите название товара', 'error');
    return;
  }
  addingItem.value = true;
  try {
    const result = await $fetch('/api/items', {
      method: 'POST',
      body: newItem,
    });
    if (result.status === 'success') {
      showMessage('Товар успешно добавлен!', 'success');
      newItem.name = '';
      newItem.quantity = 1;
      newItem.category = '';
      await Promise.all([refreshItems(), refreshStats()]);
    }
  } catch (err) {
    showMessage('Ошибка при добавлении товара', 'error');
  } finally {
    addingItem.value = false;
  }
}

async function deleteItem(id) {
  if (!confirm('Удалить этот товар?')) return;
  try {
    await $fetch(`/api/items/${id}`, { method: 'DELETE' });
    showMessage('Товар удалён', 'success');
    await Promise.all([refreshItems(), refreshStats()]);
  } catch (err) {
    showMessage('Ошибка при удалении товара', 'error');
  }
}

async function toggleItem(item) {
  try {
    await $fetch(`/api/items/${item.id}`, {
      method: 'PUT',
      body: { ...item, completed: !item.completed },
    });
    showMessage(`Товар ${!item.completed ? 'выполнен' : 'возвращен в список'}`, 'info');
    await Promise.all([refreshItems(), refreshStats()]);
  } catch (err) {
    showMessage('Ошибка при обновлении товара', 'error');
  }
}

async function editItem(item) {
  const newName = prompt('Введите новое название:', item.name);
  if (!newName || newName === item.name) return;
  try {
    await $fetch(`/api/items/${item.id}`, {
      method: 'PUT',
      body: { ...item, name: newName },
    });
    showMessage('Название обновлено', 'success');
    await refreshItems();
  } catch (err) {
    showMessage('Ошибка при редактировании товара', 'error');
  }
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
</script>

<style scoped>
.shopping-list-app {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f5f7fa;
  border-radius: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}
.page-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
.page-header p {
  color: #7f8c8d;
}
.filters-panel {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.filter-input, .filter-select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
}
.refresh-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.refresh-btn:disabled {
  opacity: 0.5;
}
.add-item-card {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.add-item-form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}
.form-input, .form-select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  flex: 1;
}
.add-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.add-btn:disabled {
  opacity: 0.5;
}
.message {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
.message.success {
  background: #d4edda;
  color: #155724;
}
.message.error {
  background: #f8d7da;
  color: #721c24;
}
.message.info {
  background: #d1ecf1;
  color: #0c5460;
}
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}
.retry-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
}
.items-section {
  margin-top: 1rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.action-btn {
  background: #e2e8f0;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.products-list {
  list-style: none;
  padding: 0;
}
.stats-panel {
  margin-top: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.timestamp {
  font-size: 0.7rem;
  color: #7f8c8d;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}
.stat-card {
  text-align: center;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b983;
}
.stat-label {
  font-size: 0.8rem;
  color: #7f8c8d;
}
.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.category-tag {
  background: #e2e8f0;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.8rem;
}
</style>