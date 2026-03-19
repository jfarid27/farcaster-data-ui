import { Effect, Schema } from "effect";
import {

    DAURequestDataT,
    DAUResponseData,
    DAUResponseDataT
} from "../models.ts";
import { DAUPort } from "../ports.ts";

/** No network, fixed Response. */
export class MockDAUAdapter implements DAUPort {
    fetchDAU(_data: DAURequestDataT): Effect.Effect<DAUResponseDataT> {

        const dauU = {days: [
            {day: "2026-03-18", dau: 1000, scoreAdjustedDau: 1000},
            {day: "2026-03-17", dau: 1000, scoreAdjustedDau: 1000},
            {day: "2026-03-16", dau: 1000, scoreAdjustedDau: 1000},
            {day: "2026-03-15", dau: 1000, scoreAdjustedDau: 1000},
            {day: "2026-03-14", dau: 1000, scoreAdjustedDau: 1000},
            {day: "2026-03-13", dau: 1000, scoreAdjustedDau: 1000},
            {day: "2026-03-12", dau: 1000, scoreAdjustedDau: 1000},
            {day: "2026-03-11", dau: 1000, scoreAdjustedDau: 1000},
        ]};

        const dau: DAUResponseDataT = Schema.decodeUnknownSync(DAUResponseData)(dauU);

        return Effect.succeed(dau);
    }
}
