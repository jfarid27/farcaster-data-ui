import express from 'express';
import { Effect, pipe } from 'effect';
import { fetchLatestUserScores, fetchUserScore } from './domains/actions.ts';
import { MockUserScoresAdapter } from './domains/adapters/mock.ts';
import { UserScoresService } from './domains/ports.ts';

const router = express.Router();

router.get('/', async (req, res) => {

  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  console.log(req)

  const program = Effect.gen(function* (){
    yield* Effect.logInfo("Fetching latest user scores with limit: " + limit);
    return yield* fetchLatestUserScores(limit);
  }).pipe(
    Effect.tap(userScores => {
      Effect.logDebug("User scores: " + JSON.stringify(userScores));
    }),
    Effect.provideService(UserScoresService, new MockUserScoresAdapter()),
    Effect.catchAll((defect) => {
      Effect.logError(defect);
      Effect.log("Error fetching latest user scores")
      return Effect.fail({ error: 'Internal server error' });
    }),
  );

  try {
    const result = await Effect.runPromise(program);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;