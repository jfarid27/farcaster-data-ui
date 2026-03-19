
import { Effect, Schema, pipe } from "effect";
import { Pool } from "pg";
import {
  type DAURequestDataT,
  DAUResponseData,
  type DAUResponseDataT,
} from "../models.ts";
import { DAUFetchError } from "../errors.ts";
import { DAUPort } from "../ports.ts";

const envGet = (key: string): string | undefined =>
  (globalThis as any)?.Deno?.env?.get?.(key);

export class SQLDAUAdapter implements DAUPort {
  private static pool: Pool | null = null;

  private static getPool(): Pool {
    if (SQLDAUAdapter.pool) return SQLDAUAdapter.pool;

    const connectionString = envGet("POSTGRES_URI");
    if (!connectionString) {
      throw new Error("Missing POSTGRES_URI environment variable");
    }

    // Many hosted Postgres setups (e.g. AWS RDS) require SSL.
    // Your error ends with `no encryption`, which usually means we attempted a
    // non-SSL connection that doesn't match the server's pg_hba rules.
    SQLDAUAdapter.pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
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
          "users" AS "dau",
          "adjusted_users" AS "scoreAdjustedDau"
        FROM public."DAU"
        WHERE
          "date" >= '2026-03-16'
        ORDER BY "date" DESC
        LIMIT $1::int
      `;

      const result = (yield* Effect.tryPromise({
        try: () => pool.query(query, [data.pastDays]),
        catch: (error) => {
          Effect.logError(error);
          return new DAUFetchError({ message: "Failed to fetch DAUs from database" });
        }
      })) as { rows: Array<any> };

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
    );
  }
}
