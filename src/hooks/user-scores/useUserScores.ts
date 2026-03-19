import { useEffect, useState } from "react";
import { Effect, pipe } from "effect";
import {
    type UserScoresResponseDataT,
} from "./../../../server/routes/user-scores/domains/models.ts";
import { fetchUserScores } from "./actions.ts";
import { APIAdapter } from "../../domain/api/adapters.ts";
import { APIService } from "../../domain/api/ports.ts";

export default function useUserScores() {

    const [userScores, setUserScores] = useState<UserScoresResponseDataT>([]);

    const program = pipe(
        fetchUserScores,
        Effect.provideService(APIService, new APIAdapter()),
        Effect.catchAll((_defect) => {
            return Effect.succeed([]);
        })
    )

    useEffect(() => {
        (async () => {
            const userScores = await Effect.runPromise(program);
            setUserScores(userScores);
        })();
    }, []);

    return { userScores };

}