import { Schema } from "effect"

/**
 * Request data for fetching a single user score
 * @property fid - Farcaster user ID
 */
export const UserScoreRequestData = Schema.Struct({
  fid: Schema.Number.pipe(Schema.positive())
})

/**
 * Type for request data for fetching a single user score
 */
export type UserScoreRequestDataT = Schema.Schema.Type<typeof UserScoreRequestData>

/**
 * Request data for fetching the top N user score
 * @property limit - Number of user scores to fetch.
 */
export const UserScoresRequestData = Schema.Struct({
  limit: Schema.Number.pipe(Schema.positive())
})

/**
 * Type for request data for fetching the top N user scores
 */
export type UserScoresRequestDataT = Schema.Schema.Type<typeof UserScoresRequestData>

/**
 * Response data for fetching a single user score
 * @property fid - Farcaster user ID
 * @property scores - Scores for the user
 * @property scores.pagerank - PageRank score for the user
 */
export const UserScoreResponseData = Schema.Struct({
  fid: Schema.Number.pipe(Schema.positive()),
  scores: Schema.partial(Schema.Struct({
    pagerank: Schema.Number
  }))
})

/**
 * Type for response data for fetching a single user score
 */
export type UserScoreResponseDataT = Schema.Schema.Type<typeof UserScoreResponseData>

/**
 * Response data for fetching multiple user scores.
 * 
 */
export const UserScoresResponseData = Schema.Array(UserScoreResponseData);

/**
 * Type for response data for fetching multiple user scores.
 */
export type UserScoresResponseDataT = Schema.Schema.Type<typeof UserScoresResponseData>

