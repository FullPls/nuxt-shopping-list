// Инициализация хранилища, если ещё не создано
if (!globalThis.itemsStore) {
  globalThis.itemsStore = [
    { id: 1, name: 'Молоко', quantity: 2, completed: false, category: 'Молочные', createdAt: new Date().toISOString() },
    { id: 2, name: 'Хлеб', quantity: 1, completed: true, category: 'Хлебобулочные', createdAt: new Date().toISOString() },
    { id: 3, name: 'Яблоки', quantity: 5, completed: false, category: 'Фрукты', createdAt: new Date().toISOString() },
  ];
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { category, completed, search } = query;

  let filtered = [...globalThis.itemsStore];

  if (category) {
    filtered = filtered.filter(item => item.category === category);
  }
  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    filtered = filtered.filter(item => item.completed === isCompleted);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(item => item.name.toLowerCase().includes(s));
  }

  return {
    status: 'success',
    data: filtered,
    timestamp: new Date().toISOString(),
  };
});