import express from 'express';
import { Effect, pipe } from 'effect';
import { fetchLatestUserScores, fetchUserScore } from './domains/actions.ts';
import { MockUserScoresAdapter } from './domains/adapters/mock.ts';
import { UserScoresService } from './domains/ports.ts';

const router = express.Router();

router.get('/', async (req, res) => {

  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

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

router.get('/:fid', async (req, res) => {
  const paramFid = req.params.fid as string;
  const program = Effect.gen(function* (){
    const fid = parseInt(paramFid);
    yield* Effect.logInfo("Fetching user score for FID: " + paramFid);
    return yield* fetchUserScore(fid);
  }).pipe(
    Effect.tap(userScores => {
      Effect.logDebug("User score for FID: " + paramFid + " - " + JSON.stringify(userScores));
    }),
    Effect.provideService(UserScoresService, new MockUserScoresAdapter()),
    Effect.catchAll((defect) => {
      Effect.logError(defect);
      Effect.log("Error fetching user score for FID: " + paramFid)
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