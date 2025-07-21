import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tracktor API",
      version: "1.0.0",
      description:
        "API documentation for the Tracktor vehicle management application.",
    },
    tags: [
      {
        name: "PIN Management",
        description: "Endpoints for managing the application PIN.",
      },
      {
        name: "Vehicle Management",
        description: "Endpoints for managing vehicles.",
      },
      {
        name: "Fuel Log Management",
        description: "Endpoints for managing fuel logs.",
      },
    ],
    servers: [
      {
        url: `http://${process.env.HOST || "localhost"}:${
          process.env.PORT || 3000
        }`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        UserPinAuth: {
          type: "apiKey",
          in: "header",
          name: "x-user-pin",
          description: "PIN for authentication",
        },
      },
    },
    security: [
      {
        UserPinAuth: [],
      },
    ],
  },
  apis: [
    "./src/docs/pinApi.yaml",
    "./src/docs/vehicleApi.yaml",
    "./src/docs/fuelLogApi.yaml",
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
