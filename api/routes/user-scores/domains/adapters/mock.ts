import { Effect, Schema } from "effect";
import {

    UserScoreRequestDataT,
    UserScoreResponseData,
    UserScoreResponseDataT,

    UserScoresRequestDataT,
    UserScoresResponseData,
    UserScoresResponseDataT
} from "../models.ts";
import { UserScoresPort } from "../ports.ts";

/** No network, fixed Response. */
export class MockUserScoresAdapter implements UserScoresPort {
    fetchLatestUserScores(_data: UserScoresRequestDataT): Effect.Effect<UserScoresResponseDataT> {

        const userScoresU = [
            {fid: 123, scores: {pagerank: 2}},
            {fid: 465, scores: {pagerank: 1}}
        ];

        const userScores: UserScoresResponseDataT = Schema.decodeUnknownSync(UserScoresResponseData)(userScoresU);

        return Effect.succeed(
            userScores
        );
    }

    fetchUserScore(_data: UserScoreRequestDataT): Effect.Effect<UserScoreResponseDataT> {

        const userScoreU = {fid: 123, scores: {pagerank: 2}};

        const userScore: UserScoreResponseDataT = Schema.decodeUnknownSync(UserScoreResponseData)(userScoreU);

        return Effect.succeed(
            userScore
        );
    }
}
