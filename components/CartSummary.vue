<template>
  <div class="cart-summary">
    <p>Всего товаров: {{ totalItems }}</p>
    <p>Общее количество: {{ totalQuantity }}</p>
    <p>Куплено: {{ completedItems }}</p>
    <p>Осталось: {{ remainingItems }}</p>
  </div>
</template>
<script setup>
defineProps(['totalItems', 'totalQuantity', 'completedItems', 
'remainingItems'])
</script>

<style scoped>
.cart-summary {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.cart-summary p {
  margin: 0;
  padding: 0.25rem 0.75rem;
  background: #f1f5f9;
  border-radius: 2rem;
  font-weight: 500;
  color: #1e293b;
}

.cart-summary p:first-child {
  background: #3b82f6;
  color: white;
}
</style>
