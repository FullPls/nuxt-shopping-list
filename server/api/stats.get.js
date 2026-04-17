export default defineEventHandler(async () => {
  if (!globalThis.itemsStore) {
    globalThis.itemsStore = [
      { id: 1, name: 'Молоко', quantity: 2, completed: false, category: 'Молочные' },
      { id: 2, name: 'Хлеб', quantity: 1, completed: true, category: 'Хлебобулочные' },
      { id: 3, name: 'Яблоки', quantity: 5, completed: false, category: 'Фрукты' },
    ];
  }

  const items = globalThis.itemsStore;

  const stats = {
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    completedItems: items.filter(item => item.completed).length,
    remainingItems: items.filter(item => !item.completed).length,
    categories: items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {}),
    summary: {
      mostCommonCategory: (() => {
        const counts = items.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {});
        const entries = Object.entries(counts);
        if (entries.length === 0) return 'Нет данных';
        return entries.sort((a, b) => b[1] - a[1])[0][0];
      })(),
      averageQuantity: items.length
        ? Math.round((items.reduce((s, i) => s + i.quantity, 0) / items.length) * 10) / 10
        : 0,
    },
  };

  return {
    status: 'success',
    data: stats,
    timestamp: new Date().toISOString(),
  };
});