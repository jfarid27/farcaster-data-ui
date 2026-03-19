// Minimal Deno global typings for the editor/TypeScript language service.
// This repo is run with Deno, but its `tsconfig` may not include Deno's lib
// definitions for files under `server/`, so we declare the bits we use.
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

