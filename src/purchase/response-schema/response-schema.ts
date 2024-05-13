export const responseSchema = {
  'application/json': {
    schema: {
      type: 'object',
      properties: {
        paymentIntentID: { type: 'string' },
        time: { type: 'number' },
      },
    },
  },
};
