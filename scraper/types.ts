export type MatchInfo = {
  matchId: number;
  league: string;
  host: string;
  guest: string;
  timeText: string;
};

export type MatchDataOdds = {
  matchId: number;
  bookmakers: {
    name: string;
    oddsValues: {
      home: string;
      draw: string;
      away: string;
    };
  }[];
};
