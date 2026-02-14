'use client';

import { Sparkles, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/hooks/useAppContext';
import { Skeleton } from '@/components/ui/skeleton';

export function AiSuggestions() {
  const { recommendations, loadingRecommendations: loading } = useAppContext();

  return (
    <Card className="h-full bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span>Recommended Skills For You</span>
        </CardTitle>
        <p className="text-sm text-primary-foreground/80 pt-1">
          Suggested by SkillLink AI
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4 bg-primary-foreground/20" />
            <Skeleton className="h-8 w-1/2 bg-primary-foreground/20" />
            <Skeleton className="h-8 w-2/3 bg-primary-foreground/20" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recommendations.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <BrainCircuit className="w-5 h-5 text-accent" />
                <span className="font-medium">{skill}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
