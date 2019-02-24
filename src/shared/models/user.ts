import { Tip } from "./tip";

export class User {
  username: string;
  claims: string[];
  tips: Tip[];

  get totalTips(): number {
    return this.tips.map(tip => tip.amount).reduce((prev, next) => prev + next);
  }
}
