
export interface MatchmakingFilters {
  helpType: 'need' | 'offer';
  industry: string;
  skills: string[];
  relationshipGoal: string;
  useLocation: boolean;
  distance?: number;
}

export interface MatchmakingResult {
  id: string;
  name: string;
  headline?: string;
  industry?: string;
  skills?: string[];
  location?: string;
  imageUrl?: string;
  matchScore?: number;
  bio?: string;
  distance?: number;
}

export interface MatchCardConnectableProps {
  profile: any;
  key: string;
  onAction?: (action: any) => void;
}
