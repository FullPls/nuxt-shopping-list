export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id);

  if (!globalThis.itemsStore) globalThis.itemsStore = [];

  const newStore = globalThis.itemsStore.filter(item => item.id !== id);
  if (newStore.length === globalThis.itemsStore.length) {
    throw createError({ statusCode: 404, statusMessage: 'Товар не найден' });
  }

  globalThis.itemsStore = newStore;

  return {
    status: 'success',
    message: `Товар с id ${id} удалён`,
  };
});