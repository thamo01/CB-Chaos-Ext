export class RuntimeMessage {
  type:
    | "MUTATION_OBSERVED"
    | "TIP_RECEIVED"
    | "MESSAGE_RECEIVED"
    | "USER_ENTERED"
    | "USER_LEFT";
  origin: string;
  payload: any;
}
