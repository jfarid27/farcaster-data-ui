import { Context, Effect } from "effect";
import type {
    UserScoreRequestDataT,
    UserScoreResponseDataT,
    UserScoresRequestDataT,
    UserScoresResponseDataT
} from "./models.ts";
import { UserScoresFetchError, UserScoreFetchError } from "./errors.ts";

export abstract class UserScoresPort {
  abstract fetchLatestUserScores(
    data: UserScoresRequestDataT,
  ): Effect.Effect<UserScoresResponseDataT, UserScoresFetchError>;

  abstract fetchUserScore(
    data: UserScoreRequestDataT,
  ): Effect.Effect<UserScoreResponseDataT, UserScoresFetchError>;
}

export const UserScoresServiceContextTag = "UserScoresServiceContextTag";

export class UserScoresService extends Context.Tag(UserScoresServiceContextTag)<
  UserScoresService,
  UserScoresPort
>() {}