
import { Effect } from "effect";
import { DAUService } from "./ports.ts";
import { DAURequestDataT } from "./models.ts";

export const fetchDAU = (pastDays: string) => Effect.gen(function* () {

    const data: DAURequestDataT = { pastDays: parseInt(pastDays) };

    const dauService = yield* DAUService;

    const dau = yield* dauService.fetchDAU(data);

    return dau;

});