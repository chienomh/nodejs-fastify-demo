const postBodyJsonSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    status: { type: "boolean" },
  },
  required: ["name", "status"],
};

const getResponseJsonSchema = {
  200: {
    type: "object",
    properties: {
      name: { type: "string" },
      status: { type: "boolean" },
    },
  },
};

const postSchema = {
  body: postBodyJsonSchema,
};

const getSchema = {
  response: getResponseJsonSchema,
};

export { postSchema, getSchema };
