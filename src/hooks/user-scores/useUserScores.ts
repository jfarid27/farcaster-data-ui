import { useEffect, useState } from "react";
import { Effect, pipe } from "effect";
import {
    type UserScoresResponseDataT,
} from "./../../../api/routes/user-scores/domains/models.ts";
import {
    UserScoresService,
} from "./../../../api/routes/user-scores/domains/ports.ts";
import { fetchUserScores } from "./actions.ts";
import { APIUserScoresAdapter } from "../../domain/api/adapters.ts";

export default function useUserScores() {

    const [userScores, setUserScores] = useState<UserScoresResponseDataT>([]);

    const program = pipe(
        fetchUserScores,
        Effect.provideService(UserScoresService, new APIUserScoresAdapter()),
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