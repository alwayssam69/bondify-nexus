
export interface MatchmakingFilters {
  helpType: 'need' | 'offer';
  industry: string;
  skills: string[];
  relationshipGoal: string;
  experienceLevel?: string;
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
  key?: string;
  delay?: number;
  onViewProfile?: (id: string) => void;
  onConnect?: (id: string) => void;
  onAction?: (action: "like" | "pass" | "save") => void;
  showChatButton?: boolean;
  showDistance?: boolean;
  onStartChat?: () => void;
}
