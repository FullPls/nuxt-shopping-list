<!-- pages/history/index.vue -->
<template>
  <div>
    <h1>История покупок</h1>
    <div v-if="completedList.length">
      <p>Всего выполнено покупок: {{ completedList.length }}</p>
      <ul>
        <li v-for="item in completedList" :key="item.id">
          {{ item.name }} ({{ item.quantity }}) - куплено
        </li>
      </ul>
    </div>
    <p v-else>История пуста.</p>
  </div>
</template>
<script setup>
import { useShoppingListStore } from '~/stores/shoppingList'
const shoppingList = useShoppingListStore()
const { completedList } = storeToRefs(shoppingList)
// Ключевой момент для SSR:
// Если бы completedList загружался с внешнего API, мы бы использовали:
// const { data: history } = await useAsyncData('history', () => $fetch('/api/history'))
// Это гарантирует, что данные будут получены на сервере и "вшиты" в HTML.
</script>