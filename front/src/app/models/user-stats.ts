export class UserStats {
    body: number;
    mind: number;
    sense: number;
    relations: number;
    journey: number;
    love: number;

    constructor(
        body: number = 0,
        mind: number = 0,
        sense: number = 0,
        relations: number = 0,
        journey: number = 0,
        love: number = 0
      ) {
        this.body = body;
        this.mind = mind;
        this.sense = sense;
        this.relations = relations;
        this.journey = journey;
        this.love = love;
    }
}