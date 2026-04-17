export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.name || !body.quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Не заполнены обязательные поля',
      });
    }
    if (body.quantity <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Количество должно быть больше 0',
      });
    }

    if (!globalThis.itemsStore) globalThis.itemsStore = [];

    const newItem = {
      id: Date.now(),
      name: body.name.trim(),
      quantity: parseInt(body.quantity),
      completed: body.completed || false,
      category: body.category || 'Без категории',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    globalThis.itemsStore.push(newItem);

    return {
      status: 'success',
      message: 'Товар успешно создан',
      data: newItem,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw error;
  }
});