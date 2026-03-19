import { Data } from "effect";

export const DAUFetchErrorTag = "DAUFetchError";

export class DAUFetchError extends Data.TaggedError(DAUFetchErrorTag)<{
  message: string;
}> {}