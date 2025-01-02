declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "dev" | "prod" | "test";
    PORT: number;
    MONGO_URL: string;
    JWT_SECRET: string;
  }
}
