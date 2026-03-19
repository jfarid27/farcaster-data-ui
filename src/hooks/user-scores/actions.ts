import { Effect } from "effect";
import { APIService } from "../../domain/api/ports.ts";

export const fetchUserScores = Effect.gen(function* () {
    const apiService = yield* APIService;

    const userScores = yield* apiService.fetchLatestUserScores();

    return userScores;
});
