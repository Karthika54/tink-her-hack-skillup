'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DUMMY_USER, DUMMY_MENTORS } from '@/lib/data';
import type { User, Mentor, Session } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { aiMentorChat } from '@/ai/flows/ai-mentor-chat';
import { aiSkillRecommendations } from '@/ai/flows/ai-skill-recommendations';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { cn } from '@/lib/utils';

interface AppContextType {
  user: User | null;
  mentors: Mentor[];
  sessions: Session[];
  recommendations: string[];
  loadingRecommendations: boolean;
  confirmExchange: (
    mentorId: string,
    userSkill: string,
    mentorSkill: string
  ) => void;
  sendMessage: (
    mentorId: string,
    message: { text: string; sender: 'user' }
  ) => Promise<void>;
  getChatHistory: (
    mentorId: string
  ) => { text: string; sender: 'user' | 'mentor' }[];
  completeSession: (sessionId: string) => void;
  getActiveSession: (mentorId: string) => Session | undefined;
  updateUserSkills: (skills: {
    skillsOffered: string[];
    learningInterests: string[];
  }) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const fallbackSuggestions = [
  'Advanced Guitar',
  'Music Theory',
  'Song Composition',
  'Portrait Photography',
  'Editing Basics',
  'Lighting Techniques',
];

const getRandomSuggestions = (count: number) => {
  const shuffled = fallbackSuggestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const handleStreak = (person: User | Mentor): { newStreakCount: number; bonus: number; newLastSessionDate: Date } => {
    const today = new Date();
    let streakCount = person.streakCount;
    const lastSessionDate = person.lastSessionDate ? new Date(person.lastSessionDate) : null;
    let bonus = 0;

    if (lastSessionDate) {
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const lastSessionMidnight = new Date(lastSessionDate.getFullYear(), lastSessionDate.getMonth(), lastSessionDate.getDate());

        const diffTime = todayMidnight.getTime() - lastSessionMidnight.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) { // Session on the same day, no change to streak
            return { newStreakCount: streakCount, bonus: 0, newLastSessionDate: lastSessionDate };
        }
        
        if (diffDays === 1) { // Consecutive day
            streakCount++;
        } else { // Gap in days, reset streak
            streakCount = 1;
        }
    } else {
        // First session ever
        streakCount = 1;
    }
    
    if (streakCount === 3) {
        bonus = 5;
    } else if (streakCount === 7) {
        bonus = 15;
        streakCount = 0; // Reset after 7-day streak to allow earning again
    }
    
    return { newStreakCount: streakCount, bonus, newLastSessionDate: today };
};


export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DUMMY_USER);
  const [mentors, setMentors] = useState<Mentor[]>(DUMMY_MENTORS);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [
    chatHistories,
    setChatHistories,
  ] = useState<Record<string, { text: string; sender: 'user' | 'mentor' }[]>>({
    rahul: [
      {
        text: "Hey! I'm an AI assistant for Rahul. I can help you with Guitar and Music Theory. What would you like to learn today? 🎸",
        sender: 'mentor',
      },
    ],
    anjali: [
      {
        text: "Hi! I'm Anjali's AI assistant. Ask me anything about Photography and Editing! 📸",
        sender: 'mentor',
      },
    ],
    arjun: [
      {
        text: "Hello! I'm Arjun's AI assistant, ready to help you with Web Development and React. Let's code! ⚛️",
        sender: 'mentor',
      },
    ],
    priya: [
      {
        text: "Welcome! I'm Priya's AI assistant. I can help you with Cooking and Baking. What's on the menu? 🍳",
        sender: 'mentor',
      },
    ],
    vikram: [
      {
        text: 'Namaste. I am Vikram\'s AI assistant. I can guide you through Yoga and Meditation. How can I help you find your center? 🙏',
        sender: 'mentor',
      },
    ],
    sameer: [
      {
        text: "Hello! I'm Sameer's AI assistant. I'm here to help you master Public Speaking and Debate. Ready to own the stage? 🎤",
        sender: 'mentor',
      },
    ],
  });
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  useEffect(() => {
    let isMounted = true;
    async function getRecs() {
      if (user?.learningInterests && user.learningInterests.length > 0) {
        setLoadingRecommendations(true);
        try {
          const result = await aiSkillRecommendations({
            learningInterests: user.learningInterests,
            randomSeed: Math.random(),
          });
          if (isMounted) {
            setRecommendations(result.recommendedSkills);
          }
        } catch (error) {
          if (isMounted) {
            setRecommendations(getRandomSuggestions(3));
          }
        } finally {
          if (isMounted) {
            setLoadingRecommendations(false);
          }
        }
      } else {
        if (isMounted) {
          setRecommendations(getRandomSuggestions(3));
          setLoadingRecommendations(false);
        }
      }
    }
    if (user) {
      getRecs();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmExchange = (
    mentorId: string,
    userSkill: string,
    mentorSkill: string
  ) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    if (!user || !mentor) return;

    const { newStreakCount: userNewStreak, bonus: userBonus, newLastSessionDate: userNewDate } = handleStreak(user);
    const { newStreakCount: mentorNewStreak, bonus: mentorBonus, newLastSessionDate: mentorNewDate } = handleStreak(mentor);

    setUser((prev) =>
      prev
        ? {
            ...prev,
            coins: prev.coins - 5 + userBonus,
            sessionsLearned: prev.sessionsLearned + 1,
            streakCount: userNewStreak,
            lastSessionDate: userNewDate,
          }
        : null
    );

    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === mentorId) {
          return {
            ...m,
            coinsEarned: m.coinsEarned + 5 + mentorBonus,
            sessionsProvided: m.sessionsProvided + 1,
            streakCount: mentorNewStreak,
            lastSessionDate: mentorNewDate,
          };
        }
        return m;
      })
    );

    const newSession: Session = {
      id: `session-${Date.now()}`,
      mentorId,
      mentorName: mentor.name,
      userSkill,
      mentorSkill,
      timestamp: new Date(),
      status: 'In Progress',
      coinChange: -5,
    };
    setSessions((prev) => [newSession, ...prev]);

    toast({
      title: 'Exchange Started ✅',
      description: `You are now learning ${mentorSkill} from ${mentor.name}.`,
    });

    const bonusDescriptions = [];
    if (userBonus > 0) {
        const day = userNewStreak === 0 ? 7 : userNewStreak;
        bonusDescriptions.push(`You earned ${userBonus} bonus coins for a ${day}-day streak!`);
    }
    if (mentorBonus > 0) {
        const day = mentorNewStreak === 0 ? 7 : mentorNewStreak;
        bonusDescriptions.push(`${mentor.name} earned ${mentorBonus} bonus coins for a ${day}-day streak!`);
    }

    if (bonusDescriptions.length > 0) {
        setTimeout(() => {
            toast({
                title: '🎉 Streak Bonus! 🎉',
                description: bonusDescriptions.join(' '),
            });
        }, 1500);
    }
  };

  const getChatHistory = (mentorId: string) => {
    return chatHistories[mentorId] || [];
  };

  const completeSession = (sessionId: string) => {
    let completedSkill = '';
    setSessions(prev =>
      prev.map(session => {
        if (session.id === sessionId && session.status === 'In Progress') {
          completedSkill = session.mentorSkill;
          return { ...session, status: 'Completed' as const };
        }
        return session;
      })
    );

    if (completedSkill) {
      toast({
        title: 'Session Completed! 🎉',
        description: `Your session for "${completedSkill}" has been marked as complete.`,
      });
    }
  };

  const getActiveSession = (mentorId: string) => {
    return sessions.find(s => s.mentorId === mentorId && s.status === 'In Progress');
  };

  const sendMessage = async (
    mentorId: string,
    message: { text: string; sender: 'user' }
  ) => {
    const userMessage = { ...message, sender: 'user' as const };

    const updatedHistory = [...(chatHistories[mentorId] || []), userMessage];
    setChatHistories((prev) => ({
      ...prev,
      [mentorId]: updatedHistory,
    }));

    const mentor = mentors.find((m) => m.id === mentorId);
    if (!mentor) return;

    try {
      const aiResponse = await aiMentorChat({
        mentorName: mentor.name,
        mentorSkills: mentor.skills,
        chatHistory: updatedHistory,
      });

      const mentorMessage = {
        text: aiResponse.response,
        sender: 'mentor' as const,
      };

      setChatHistories((prev) => ({
        ...prev,
        [mentorId]: [...(prev[mentorId] || []), mentorMessage],
      }));
    } catch (error) {
      console.error('AI mentor chat failed:', error);
      const errorMessage = {
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'mentor' as const,
      };
      setChatHistories((prev) => ({
        ...prev,
        [mentorId]: [...(prev[mentorId] || []), errorMessage],
      }));
    }
  };

  const updateUserSkills = (skills: {
    skillsOffered: string[];
    learningInterests: string[];
  }) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = {
        ...prev,
        skillsOffered: skills.skillsOffered,
        learningInterests: skills.learningInterests,
      };
      // Also update the user if they are in the mentors list
      setMentors((prevMentors) =>
        prevMentors.map((m) =>
          m.id === updatedUser.id
            ? {
                ...m,
                skills: updatedUser.skillsOffered,
                learningInterests: updatedUser.learningInterests,
              }
            : m
        )
      );
      return updatedUser;
    });
    toast({
      title: 'Profile Updated',
      description: 'Your skills have been successfully updated.',
    });
  };

  const value = {
    user,
    mentors,
    sessions,
    recommendations,
    loadingRecommendations,
    confirmExchange,
    sendMessage,
    getChatHistory,
    completeSession,
    getActiveSession,
    updateUserSkills,
  };

  return (
    <AppContext.Provider value={value}>
      <SidebarProvider>
        {isLandingPage ? (
          <main>{children}</main>
        ) : (
          <div className="relative flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 overflow-auto md:p-8 p-4">
              <main>{children}</main>
            </div>
          </div>
        )}
      </SidebarProvider>
      <Toaster />
    </AppContext.Provider>
  );
}
