import { middleware } from "express-openapi-validator";

export const openApiValidator = middleware({
  apiSpec: "./openapi.yaml",
  validateRequests: true,
  validateResponses: true,
});
