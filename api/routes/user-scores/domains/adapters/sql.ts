
import { Effect, Schema, pipe } from "effect";
import { Pool } from "pg";
import {
  type UserScoresRequestDataT,
  UserScoresResponseData,
  type UserScoresResponseDataT,

  type UserScoreRequestDataT,
  UserScoreResponseData,
  type UserScoreResponseDataT,
} from "../models.ts";
import { UserScoresFetchError } from "../errors.ts";
import { type UserScoresPort } from "../ports.ts";

export class SQLUserScoresAdapter implements UserScoresPort {
  private static pool: Pool | null = null;

  private static getPool(): Pool {
    if (SQLUserScoresAdapter.pool) return SQLUserScoresAdapter.pool;

    const connectionString = Deno.env.get("POSTGRES_URI");
    if (!connectionString) {
      throw new Error("Missing POSTGRES_URI environment variable");
    }

    // Many hosted Postgres setups (e.g. AWS RDS) require SSL.
    // Your error ends with `no encryption`, which usually means we attempted a
    // non-SSL connection that doesn't match the server's pg_hba rules.
    SQLUserScoresAdapter.pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
    return SQLUserScoresAdapter.pool;
  }

  fetchUserScore(
    data: UserScoreRequestDataT,
  ): Effect.Effect<UserScoreResponseDataT, UserScoresFetchError> {
    const program = Effect.gen(function* () {
      const pool = SQLUserScoresAdapter.getPool();
      const query = `
        WITH rankings AS (
          SELECT
            u.*,
            RANK() OVER (PARTITION BY u.fid ORDER BY u.timestamp DESC) AS rn
          FROM public."USER_SCORES" u
          WHERE fid = $1::int
        )
        SELECT fid, pagerank
        FROM rankings
        WHERE rn = 1
      `;
      const result = (yield* Effect.tryPromise({
        try: () => pool.query(query, [data.fid]),
        catch: (error) => {
          Effect.logError(error);
          return new UserScoresFetchError({ message: "Failed to fetch user score from database" });
        }
      })) as { rows: Array<any> };

      const userScoreU = {
        fid: result.rows[0].fid,
        scores: {
          pagerank: Number(result.rows[0].pagerank),
        }
      };

      const userScore: UserScoreResponseDataT = Schema.decodeUnknownSync(UserScoreResponseData)(
        userScoreU,
      );
      return yield* Effect.succeed(userScore);
    });

    return pipe(
      program,
    );
  }

  fetchLatestUserScores(
    data: UserScoresRequestDataT,
  ): Effect.Effect<UserScoresResponseDataT, UserScoresFetchError> {
    const program = Effect.gen(function* () {
      const pool = SQLUserScoresAdapter.getPool();

      const query = `
        WITH rankings AS (
          SELECT
            *,
            RANK() OVER (PARTITION BY fid ORDER BY timestamp DESC) AS rn
          FROM public."USER_SCORES"
        )
        SELECT fid, pagerank
        FROM rankings
        WHERE rn = 1
        ORDER BY pagerank DESC
        LIMIT $1::int
      `;

      const result = (yield* Effect.tryPromise({
        try: () => pool.query(query, [data.limit]),
        catch: (error) => {
          Effect.logError(error);
          return new UserScoresFetchError({ message: "Failed to fetch user scores from database" });
        }
      })) as { rows: Array<any> };

      const userScoresU = (result.rows ?? []).map((row: any) => ({
        fid: row.fid,
        scores: {
          pagerank: Number(row.pagerank),
        }
      }));

      const userScores: UserScoresResponseDataT = Schema.decodeUnknownSync(UserScoresResponseData)(
        userScoresU,
      );

      return yield* Effect.succeed(userScores);
    });

    return pipe(
      program,
    );
  }
}
