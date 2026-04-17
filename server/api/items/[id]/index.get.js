export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id);
  const mockItems = [
    { id: 1, name: 'Молоко', quantity: 2, completed: false, category: 'Молочные' },
    { id: 2, name: 'Хлеб', quantity: 1, completed: true, category: 'Хлебобулочные' },
    { id: 3, name: 'Яблоки', quantity: 5, completed: false, category: 'Фрукты' },
  ];
  const item = mockItems.find(i => i.id === id);
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Товар не найден' });
  }
  return { status: 'success', data: item };
});