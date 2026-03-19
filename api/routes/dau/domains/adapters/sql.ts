
import { Effect, Schema, pipe } from "effect";
import { Pool } from "pg";
import {
  type DAURequestDataT,
  DAUResponseData,
  type DAUResponseDataT,
} from "../models.ts";
import { DAUFetchError } from "../errors.ts";
import { DAUPort } from "../ports.ts";

export class SQLDAUAdapter implements DAUPort {
  private static pool: Pool | null = null;

  private static getPool(): Pool {
    if (SQLDAUAdapter.pool) return SQLDAUAdapter.pool;

    const connectionString = process.env.POSTGRES_URI;
    if (!connectionString) {
      throw new Error("Missing POSTGRES_URI environment variable");
    }

    SQLDAUAdapter.pool = new Pool({ connectionString });
    return SQLDAUAdapter.pool;
  }

  fetchDAU(
    data: DAURequestDataT,
  ): Effect.Effect<DAUResponseDataT, DAUFetchError> {
    const program = Effect.gen(function* () {
      const pool = SQLDAUAdapter.getPool();

      // `pastDays = 7` => last 7 days including today
      const query = `
        SELECT
          to_char("date", 'YYYY-MM-DD') AS "day",
          "users"::double precision AS "dau",
          "adjusted_users"::double precision AS "scoreAdjustedDau"
        FROM "DAU"
        WHERE "date" >= CURRENT_DATE - ($1::int - 1)
            AND "date" >= '2026-03-16'
        ORDER BY "date" DESC
        LIMIT $1::int
      `;

      const result = (yield* Effect.tryPromise(() =>
        pool.query(query, [data.pastDays]),
      )) as { rows: Array<any> };

      const dauU = {
        days: (result.rows ?? []).map((row: any) => ({
          day: row.day,
          dau: Number(row.dau),
          scoreAdjustedDau: Number(row.scoreAdjustedDau),
        })),
      };

      const dau: DAUResponseDataT = Schema.decodeUnknownSync(DAUResponseData)(
        dauU,
      );

      return yield* Effect.succeed(dau);
    });

    return pipe(
      program,
      Effect.catchAll((defect) => {
        Effect.logError(defect);
        return Effect.fail(new DAUFetchError({ message: "Failed to fetch DAUs" }));
      }),
    );
  }
}
