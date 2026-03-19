import { Context, Effect } from "effect";
import { UserScoresFetchError } from "./../../../server/routes/user-scores/domains/errors.ts";
import {
    type UserScoreResponseDataT,
    type UserScoresResponseDataT
} from "./../../../server/routes/user-scores/domains/models.ts";
import type { DAUResponseDataT } from "./../../../server/routes/dau/domains/models.ts";
import { DAUFetchError } from "./../../../server/routes/dau/domains/errors.ts";

export abstract class APIPort {
  abstract fetchLatestUserScores(): Effect.Effect<UserScoresResponseDataT, UserScoresFetchError>;
  abstract fetchUserScore(fid: string): Effect.Effect<UserScoreResponseDataT, UserScoresFetchError>;
  abstract fetchDAU(pastDays: string): Effect.Effect<DAUResponseDataT, DAUFetchError>;

}

export const APIPortContextTag = "APIPortContext";

export class APIService extends Context.Tag(APIPortContextTag)<
  APIService,
  APIPort
>() {}