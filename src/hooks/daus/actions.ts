import { Effect } from "effect";
import { APIService } from "../../domain/api/ports.ts";

export const fetchDAUs = (pastDays: string) => Effect.gen(function* () {
    const apiService = yield* APIService;

    const daus = yield* apiService.fetchDAU(pastDays);

    return daus;
});
