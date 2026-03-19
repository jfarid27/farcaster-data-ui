import { Effect, Schema } from "effect";
import { UserScoresService } from "./../../../api/routes/user-scores/domains/ports.ts";

export const fetchUserScores = Effect.gen(function* () {
    const userScoresService = yield* UserScoresService;

    const userScores = yield* userScoresService.fetchLatestUserScores({ limit: 10 });

    return userScores;
});
