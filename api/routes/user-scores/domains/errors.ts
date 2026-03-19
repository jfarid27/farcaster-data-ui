import { Data } from "effect";

export const UserScoreFetchErrorTag = "UserScoreFetchError";
export const UserScoresFetchErrorTag = "UserScoresFetchError";

export class UserScoreFetchError extends Data.TaggedError(UserScoreFetchErrorTag)<{
  message: string;
}> {}


export class UserScoresFetchError extends Data.TaggedError(UserScoresFetchErrorTag)<{
  message: string;
}> {}
