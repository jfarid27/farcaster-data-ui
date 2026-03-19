import { useEffect, useState } from "react";
import { Effect, pipe, Schema } from "effect";
import {
    UserScoresResponseData,
    type UserScoresResponseDataT,
} from "./../../api/routes/user-scores/domains/models.ts";

const fetchUserScores = Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
        try: () => fetch(`http://localhost:8000/api/user-scores/`),
        catch: (error) => Effect.logError(error),
    });
    const userScoresResponse = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: (error) => Effect.logError(error),
    });

    const userScores: UserScoresResponseDataT = Schema.decodeUnknownSync(UserScoresResponseData)(userScoresResponse);

    return yield* Effect.succeed(userScores);
});

export default function useUserScores() {

    const [userScores, setUserScores] = useState<UserScoresResponseDataT>([]);

    useEffect(() => {
        (async () => {
            const userScores = await Effect.runPromise(fetchUserScores);
            setUserScores(userScores);
        })();
    }, []);

    return { userScores };

}