export type MatchInfo = {
  matchId: string;
  league: string;
  host: string;
  guest: string;
  timeText: string;
};

export type MatchDataOdds = {
  matchId: string;
  bookmakers: {
    name: string;
    oddsValues: {
      home: string;
      draw: string;
      away: string;
    };
  }[];
};
