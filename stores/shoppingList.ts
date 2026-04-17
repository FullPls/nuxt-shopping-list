import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Product {
  id: number
  name: string
  quantity: number
  completed: boolean
  createdAt: Date
  price?: number
}

export interface ArchivedProduct extends Product {
  deletedAt: Date
}

export const useShoppingListStore = defineStore('shoppingList', () => {
  // ========== STATE ==========
  const items = ref<Product[]>([
    { id: 1, name: 'Молоко', quantity: 1, completed: false, createdAt: new Date() },
    { id: 2, name: 'Хлеб', quantity: 2, completed: false, createdAt: new Date() }
  ])

  const newItem = ref({
    name: '',
    quantity: 1
  })

  const sortOption = ref<'name' | 'quantity' | 'completed'>('name')

  // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
  function saveToLocalStorage(): void {
    localStorage.setItem('shoppingItems', JSON.stringify(items.value))
  }

  function archiveItem(item: Product): void {
    const archivedItem: ArchivedProduct = {
      ...item,
      deletedAt: new Date()
    }
    
    let archived: ArchivedProduct[] = []
    const saved = localStorage.getItem('archivedItems')
    if (saved) {
      try {
        archived = JSON.parse(saved)
      } catch (e) {
        console.error('Ошибка загрузки архива', e)
      }
    }
    
    archived.unshift(archivedItem)
    
    if (archived.length > 50) {
      archived = archived.slice(0, 50)
    }
    
    localStorage.setItem('archivedItems', JSON.stringify(archived))
  }

  // ========== GETTERS ==========
  const totalItems = computed(() => items.value.length)
  
  const totalQuantity = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )
  
  const completedItems = computed(() => 
    items.value.filter(item => item.completed).length
  )
  
  const remainingItems = computed(() => 
    totalItems.value - completedItems.value
  )
  
  const sortedItems = computed<Product[]>(() => {
    return [...items.value].sort((a, b) => {
      if (sortOption.value === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortOption.value === 'quantity') {
        return a.quantity - b.quantity
      } else if (sortOption.value === 'completed') {
        return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
      }
      return 0
    })
  })
  
  const completedList = computed<Product[]>(() => 
    items.value.filter(item => item.completed)
  )

  // ========== ACTIONS ==========
  function addItem(): void {
    if (newItem.value.name.trim()) {
      const item: Product = {
        id: Date.now(),
        name: newItem.value.name.trim(),
        quantity: newItem.value.quantity,
        completed: false,
        createdAt: new Date()
      }
      items.value.push(item)
      saveToLocalStorage()
      newItem.value = { name: '', quantity: 1 }
    }
  }

  function removeItem(id: number): void {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      const removedItem = items.value[index]  // ✅ гарантированно Product
      archiveItem(removedItem)
      items.value.splice(index, 1)
      saveToLocalStorage()
    }
  }
  
  function toggleItem(id: number): void {
    const item = items.value.find(item => item.id === id)
    if (item) {  // ✅ проверка на существование
      item.completed = !item.completed
      saveToLocalStorage()
    }
  }
  
  function increaseQuantity(id: number): void {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.quantity++
      saveToLocalStorage()
    }
  }
  
  function decreaseQuantity(id: number): void {
    const item = items.value.find(item => item.id === id)
    if (item && item.quantity > 1) {
      item.quantity--
      saveToLocalStorage()
    }
  }
  
  function updateItemName(id: number, newName: string): void {
    const item = items.value.find(item => item.id === id)
    if (item && newName.trim()) {
      item.name = newName.trim()
      saveToLocalStorage()
    }
  }
  
  function setSortOption(option: 'name' | 'quantity' | 'completed'): void {
    sortOption.value = option
  }
  
  function clearCompleted(): void {
    items.value = items.value.filter(item => !item.completed)
    saveToLocalStorage()
  }
  
  function resetList(): void {
    if (confirm('Вы уверены, что хотите очистить весь список покупок? Это действие нельзя отменить.')) {
      items.value.forEach(item => archiveItem(item))
      items.value = []
      saveToLocalStorage()
      alert('Список покупок очищен!')
    }
  }
  
  function getSortedItemId(sortedIndex: number): number | undefined {
    return sortedItems.value[sortedIndex]?.id
  }

  // ========== EXPORT ==========
  return {
    items,
    newItem,
    sortOption,
    totalItems,
    totalQuantity,
    completedItems,
    remainingItems,
    sortedItems,
    completedList,
    addItem,
    removeItem,
    toggleItem,
    increaseQuantity,
    decreaseQuantity,
    updateItemName,
    setSortOption,
    clearCompleted,
    resetList,
    getSortedItemId,
    saveToLocalStorage,
    archiveItem
  }
})