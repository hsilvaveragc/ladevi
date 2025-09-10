const store =
  import.meta.env.MODE === "production"
    ? (await import("./configureStore.prod")).default
    : (await import("./configureStore.dev")).default;

export default store;
