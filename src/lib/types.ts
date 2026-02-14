export type User = {
  id: string;
  name: string;
  coins: number;
  skillsOffered: string[];
  learningInterests: string[];
  sessionsLearned: number;
  sessionsTaught: number;
  coinsEarned: number;
  rating: number;
  image: string;
  streakCount: number;
  lastSessionDate: Date | null;
};

export type Mentor = {
  id: string;
  name: string;
  skills: string[];
  learningInterests: string[];
  sessionsProvided: number;
  rating: number;
  coinsEarned: number;
  image: string;
  streakCount: number;
  lastSessionDate: Date | null;
};

export type Session = {
  id: string;
  mentorId: string;
  mentorName: string;
  userSkill: string;
  mentorSkill: string;
  timestamp: Date;
  status: 'In Progress' | 'Completed';
  coinChange: number;
};
