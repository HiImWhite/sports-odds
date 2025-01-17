export interface MatchInfo {
  matchId: string;
  league: string;
  host: string;
  guest: string;
  time: string;
}

export interface MatchDataOdds {
  matchId: string;
  bookmakers: {
    name: string;
    oddsValues: {
      home: string;
      draw: string;
      away: string;
    };
  }[];
}

export interface Bookmaker {
  name: string;
  odds: {
    home: string;
    draw: string;
    away: string;
  };
}

export interface OddsHistory {
  bookmaker: string;
  odds: {
    home: string;
    draw: string;
    away: string;
  };
  timestamp: Date;
}
