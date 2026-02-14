'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/hooks/useAppContext';
import { AiSuggestions } from '@/components/dashboard/AiSuggestions';
import { MentorCard } from '@/components/dashboard/MentorCard';
import { CoinIcon } from '@/components/icons';
import { StreakCard } from '@/components/dashboard/StreakCard';
import type { Mentor } from '@/lib/types';

export default function DashboardPage() {
  const { user, mentors } = useAppContext();

  if (!user) {
    return null; // Or a loading spinner
  }

  const allMentors: Mentor[] = [
    ...mentors,
    {
      id: user.id,
      name: user.name,
      skills: user.skillsOffered,
      learningInterests: user.learningInterests,
      sessionsProvided: user.sessionsTaught,
      rating: user.rating,
      coinsEarned: user.coinsEarned,
      image: user.image,
      streakCount: user.streakCount,
      lastSessionDate: user.lastSessionDate,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user.name} 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to learn something new today?
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-muted-foreground">
              SkillCoin Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CoinIcon className="w-10 h-10 text-yellow-400" />
              <span className="text-5xl font-bold">{user.coins}</span>
            </div>
          </CardContent>
        </Card>
        <StreakCard streakCount={user.streakCount} />
        <div className="md:col-span-2 xl:col-span-1">
          <AiSuggestions />
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Platform Mentors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      </section>
    </div>
  );
}
