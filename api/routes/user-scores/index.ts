import express from 'express';
import { Effect, pipe } from 'effect';
import { fetchLatestUserScores, fetchUserScore } from './domains/actions.ts';
import { SQLUserScoresAdapter } from './domains/adapters/sql.ts';
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
    Effect.provideService(UserScoresService, new SQLUserScoresAdapter()),
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

router.get('/csv', async (_req, res) => {
  const limit = 10000;

  const program = Effect.gen(function* () {
    yield* Effect.logInfo(
      "Fetching latest user scores as CSV with limit: " + limit,
    );
    return yield* fetchLatestUserScores(limit);
  }).pipe(
    Effect.provideService(UserScoresService, new SQLUserScoresAdapter()),
    Effect.catchAll((defect) => {
      Effect.logError(defect);
      return Effect.fail({ error: "Internal server error" });
    }),
  );

  try {
    const result = await Effect.runPromise(program);

    const csvLines = [
      "fid,pagerank",
      ...result.map((row: any) => {
        const fid = row.fid;
        const pagerank =
          row?.scores?.pagerank !== undefined ? row.scores.pagerank : "";
        return `${fid},${pagerank}`;
      }),
    ];
    const csv = csvLines.join("\n");

    res.status(200);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="latest-user-scores.csv"',
    );
    res.send(csv);
  } catch (_error) {
    res.status(500).json({ error: "Internal server error" });
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
    Effect.provideService(UserScoresService, new SQLUserScoresAdapter()),
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