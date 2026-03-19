import { Context, Effect } from "effect";
import type {
    DAURequestDataT,
    DAUResponseDataT,
} from "./models.ts";
import { DAUFetchError } from "./errors.ts";

export abstract class DAUPort {
  abstract fetchDAU(
    data: DAURequestDataT,
  ): Effect.Effect<DAUResponseDataT, DAUFetchError>;

}

export const DAUServiceContextTag = "DAUServiceContextTag";

export class DAUService extends Context.Tag(DAUServiceContextTag)<
  DAUService,
  DAUPort
>() {}