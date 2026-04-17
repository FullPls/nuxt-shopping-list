export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id);
  const body = await readBody(event);

  if (!globalThis.itemsStore) globalThis.itemsStore = [];

  const index = globalThis.itemsStore.findIndex(item => item.id === id);
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Товар не найден' });
  }

  globalThis.itemsStore[index] = {
    ...globalThis.itemsStore[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return {
    status: 'success',
    message: 'Товар обновлён',
    data: globalThis.itemsStore[index],
  };
});