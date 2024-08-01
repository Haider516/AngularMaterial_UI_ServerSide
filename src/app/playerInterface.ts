export interface PSLPlayer {
  id?: number;
  name: string;
  age: number;
  nationality: string;
  category: PlayerCategory;
  type: PlayerType;
  team: string;
}

export interface PSLPlayerTree {
  id?: number;
  attributes: {
    name: string;
    age: number;
    nationality: string;
    category: PlayerCategory;
    type: PlayerType;
    team: string;
  }
}

enum PlayerCategory {
  Platinum = 'Platinum',
  Diamond = 'Diamond',
  Gold = 'Gold',
  Silver = 'Silver',
  Emerging = 'Emerging'
}

enum PlayerType {
  Bowler = 'Bowler',
  Batsman = 'Batsman',
  Wicketkeeper = 'Wicketkeeper',
  AllRounder = 'AllRounder'
}


export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}