import { useEffect, useState } from "react";
import { Effect, pipe } from "effect";
import {
    type DAUResponseDataT,
} from "./../../../server/routes/dau/domains/models.ts";
import { fetchDAUs } from "./actions.ts";
import { APIAdapter } from "../../domain/api/adapters.ts";
import { APIService } from "../../domain/api/ports.ts";

export default function useDAUs() {

    const [daus, setDAUs] = useState<DAUResponseDataT>({ days: [] });

    const program = pipe(
        fetchDAUs('7'),
        Effect.provideService(APIService, new APIAdapter()),
        Effect.catchAll((_defect) => {
            return Effect.succeed({ days: [] });
        })
    )

    useEffect(() => {
        (async () => {
            const daus = await Effect.runPromise(program);
            setDAUs(daus);
        })();
    }, []);

    return { daus };

}