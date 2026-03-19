import { Effect, Schema, pipe } from "effect";
import { UserScoresFetchError } from "./../../../api/routes/user-scores/domains/errors.ts";
import { DAUFetchError } from "./../../../api/routes/dau/domains/errors.ts";
import {

    type UserScoreRequestDataT,
    UserScoreResponseData,
    type UserScoreResponseDataT,

    type UserScoresRequestDataT,
    UserScoresResponseData,
    type UserScoresResponseDataT
} from "./../../../api/routes/user-scores/domains/models.ts";
import { APIPort } from "./ports.ts";
import { 
    DAUResponseData,
    type DAUResponseDataT
} from "../../../api/routes/dau/domains/models.ts";

export class APIAdapter implements APIPort {
    fetchDAU(pastDays: string): Effect.Effect<DAUResponseDataT, DAUFetchError> {
        const program = Effect.gen(function* () {
            const response = yield* Effect.tryPromise(
                () => fetch(`http://localhost:8000/api/dau?pastDays=${pastDays}`),
            );
            const dauResponse = yield* Effect.tryPromise(
                () => response.json(),
            );
            const dau: DAUResponseDataT = Schema.decodeUnknownSync(DAUResponseData)(dauResponse);
            return yield* Effect.succeed(dau);
        });
        return pipe(
            program,
            Effect.catchAll((defect) => {
                Effect.logError(defect);
                return Effect.fail(new DAUFetchError({ message: "Failed to fetch DAUs" }));
            })
        );
    }

    fetchLatestUserScores(): Effect.Effect<UserScoresResponseDataT, UserScoresFetchError> {
        const program = Effect.gen(function* () {
            const response = yield* Effect.tryPromise(
                () => fetch(`http://localhost:8000/api/user-scores/`),
            );
            const userScoresResponse = yield* Effect.tryPromise(
                () => response.json(),
            );

            const userScores: UserScoresResponseDataT = Schema.decodeUnknownSync(UserScoresResponseData)(userScoresResponse);

            return yield* Effect.succeed(userScores);
        });

        return pipe(
            program,
            Effect.catchAll((defect) => {
                Effect.logError(defect);
                return Effect.fail(new UserScoresFetchError({ message: "Failed to fetch user scores" }));
            })
        )
    }

    fetchUserScore(fid: string): Effect.Effect<UserScoreResponseDataT, UserScoresFetchError> {
        const program = Effect.gen(function* () {
            const response = yield* Effect.tryPromise(
                () => fetch(`http://localhost:8000/api/user-scores/${fid}`),
            );
            const userScoresResponse = yield* Effect.tryPromise(
                () => response.json(),
            );

            const userScores: UserScoreResponseDataT = Schema.decodeUnknownSync(UserScoreResponseData)(userScoresResponse);

            return yield* Effect.succeed(userScores);
        });

        return pipe(
            program,
            Effect.catchAll((defect) => {
                Effect.logError(defect);
                return Effect.fail(new UserScoresFetchError({ message: "Failed to fetch user score for FID: " + fid }));
            })
        )
    }
}
