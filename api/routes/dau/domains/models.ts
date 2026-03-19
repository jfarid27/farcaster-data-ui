import { Schema } from "effect"

/**
 * Request data for fetching a single user score
 * @property fid - Farcaster user ID
 */
export const DAURequestData = Schema.Struct({
  pastDays: Schema.Number.pipe(Schema.positive())
})

/**
 * Type for request data for fetching a single user score
 */
export type DAURequestDataT = Schema.Schema.Type<typeof DAURequestData>

export const DAUDay = Schema.Struct({
    day: Schema.String,
    dau: Schema.Number.pipe(Schema.greaterThan(0)),
    scoreAdjustedDau: Schema.Number.pipe(Schema.greaterThan(0)),
})

/**
 * Request data for fetching a single user score
 * @property fid - Farcaster user ID
 */
export const DAUResponseData = Schema.Struct({
    days: Schema.Array(DAUDay)
})

/**
 * Type for request data for fetching a single user score
 */
export type DAUResponseDataT = Schema.Schema.Type<typeof DAUResponseData>