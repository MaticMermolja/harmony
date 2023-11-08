// src/app/models/action.ts
export class Action {
  _id: string; // If _id should never be undefined, do not put a "?" here.
  name: string;
  desc: string;
  changeBody: number;
  changeMind: number;
  changeSense: number;
  changeRelations: number;
  changeJourney: number;
  changeLove: number;
  pictureUrl?: string;

  constructor() {
    this._id = '';
    this.name = '';
    this.desc = '';
    this.changeBody = 0;
    this.changeMind = 0;
    this.changeSense = 0;
    this.changeRelations = 0;
    this.changeJourney = 0;
    this.changeLove = 0;
  }
}
