export type Results = {
  id: number;
  league: string;
  host: string;
  guest: string;
  timeText: string;
};

export type Odds = {
  matchId: number;
  bookmaker: string;
  oddsHome: string;
  oddsDraw: string;
  oddsAway: string;
};
