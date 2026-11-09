type env = string | undefined;

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "staging" | "production"
        }
    }
}

export {};

// This file is just for type checking for .env - purely for development
// Don't forget to add the env variable here when add one. 