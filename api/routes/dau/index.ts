import express from 'express';
import { Effect, pipe } from 'effect';
import { fetchDAU } from './domains/actions.ts';
import { SQLDAUAdapter } from './domains/adapters/sql.ts';
import { DAUService } from './domains/ports.ts';

const router = express.Router();

router.get('/', async (req, res) => {

  const pastDays = req.query.pastDays ? req.query.pastDays as string : '7';

  const program = Effect.gen(function* (){
    yield* Effect.logInfo("Fetching DAU with past days: " + pastDays);
    return yield* fetchDAU(pastDays);
  }).pipe(
    Effect.tap(dau => {
      Effect.logDebug("DAU: " + JSON.stringify(dau));
    }),
    Effect.provideService(DAUService, new SQLDAUAdapter()),
    Effect.catchAll((defect) => {
      Effect.logError(defect);
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