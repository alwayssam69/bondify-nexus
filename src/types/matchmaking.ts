
export interface MatchmakingFilters {
  industry: string;
  skills: string[];
  distance?: number;
  useLocation: boolean;
  helpType: "need" | "offer";
  latitude?: number;
  longitude?: number;
}

export interface RecentMatch {
  id: string;
  name: string;
  industry: string;
  skills: string[];
  imageUrl?: string;
  matchDate: Date;
  isAccepted: boolean;
  hasRead: boolean;
}
