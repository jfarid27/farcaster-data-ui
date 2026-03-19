import { Effect } from "effect";
import { UserScoresService } from "./ports.ts";

export const fetchUserScore = (fid: number) => Effect.gen(function* () {

    const userScoresService = yield* UserScoresService;

    const userScore = yield* userScoresService.fetchUserScore({ fid });

    return userScore;

});

export const fetchLatestUserScores = (limit: number) => Effect.gen(function* () {

    yield* Effect.logInfo("Fetching latest user scores with limit: " + limit);

    const userScoresService = yield* UserScoresService;

    const userScores = yield* userScoresService.fetchLatestUserScores({ limit });

    return userScores;

});