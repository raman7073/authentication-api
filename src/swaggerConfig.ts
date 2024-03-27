import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Authentication API",
      version: "1.0.0",
      description: "API documentation",
    },
  },
  apis: [path.resolve(__dirname, "./routes/user.routes.ts")],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
