/// <reference types="react-scripts" />

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "react-emoji-picker";

// Global process declaration for React apps
declare var process: {
  env: {
    NODE_ENV: "development" | "production" | "test";
    PUBLIC_URL: string;
    REACT_APP_API_URL?: string;
    REACT_APP_ENVIRONMENT?: string;
    REACT_APP_OPENWEATHER_API_KEY?: string;
    REACT_APP_GOOGLE_PLACES_API_KEY?: string;
    REACT_APP_SITE_NAME?: string;
    REACT_APP_SITE_DESCRIPTION?: string;
  };
};
