import { Effect, Schema, pipe } from "effect";
import { UserScoresFetchError } from "./../../../api/routes/user-scores/domains/errors.ts";
import {

    type UserScoreRequestDataT,
    UserScoreResponseData,
    type UserScoreResponseDataT,

    type UserScoresRequestDataT,
    UserScoresResponseData,
    type UserScoresResponseDataT
} from "./../../../api/routes/user-scores/domains/models.ts";
import { UserScoresPort } from "./../../../api/routes/user-scores/domains/ports.ts";

/** No network, fixed Response. */
export class APIUserScoresAdapter implements UserScoresPort {
    fetchLatestUserScores(_data: UserScoresRequestDataT): Effect.Effect<UserScoresResponseDataT, UserScoresFetchError, never> {
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

    fetchUserScore(_data: UserScoreRequestDataT): Effect.Effect<UserScoreResponseDataT, UserScoresFetchError, never> {
        const program = Effect.gen(function* () {
            const response = yield* Effect.tryPromise(
                () => fetch(`http://localhost:8000/api/user-scores/${_data.fid}`),
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
                return Effect.fail(new UserScoresFetchError({ message: "Failed to fetch user scores" }));
            })
        )
    }
}
