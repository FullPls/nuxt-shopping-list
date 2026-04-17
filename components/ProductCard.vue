<template>
  <li class="product-item" :class="{ completed: product.completed }">
    <div class="product-info">
      <span class="product-name" :class="{ completed: product.completed }">
        {{ product.name }}
      </span>
      <span class="product-quantity">× {{ product.quantity }}</span>
      <span v-if="product.category" class="product-category">{{ product.category }}</span>
    </div>
    <div class="product-actions">
      <button @click="$emit('toggle', product)" class="action-btn toggle-btn">
        {{ product.completed ? 'Назад' : 'Готово' }}
      </button>
      <button @click="$emit('edit', product)" class="action-btn edit-btn">Редактировать</button>
      <button @click="$emit('delete', product.id)" class="action-btn delete-btn">Удалить</button>
    </div>
  </li>
</template>

<script setup>
defineProps({ product: Object, required: true });
defineEmits(['toggle', 'edit', 'delete']);
</script>

<style scoped>
.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.product-item.completed {
  opacity: 0.6;
  background: #f0f0f0;
}
.product-name {
  font-size: 1.1rem;
  font-weight: 500;
}
.product-name.completed {
  text-decoration: line-through;
  color: #888;
}
.product-quantity {
  margin-left: 0.5rem;
  background: #e2e8f0;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.8rem;
}
.product-category {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  color: #42b983;
}
.product-actions button {
  margin-left: 0.5rem;
  background: #f1f5f9;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.toggle-btn {
  background: #42b983;
  color: white;
}
.edit-btn {
  background: #e6f0ff;
  color: #2563eb;
}
.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}
</style>