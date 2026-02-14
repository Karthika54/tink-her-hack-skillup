'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';

interface StreakCardProps {
    streakCount: number;
}

export function StreakCard({ streakCount }: StreakCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium text-muted-foreground">
                    Current Streak
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <Flame className={`w-10 h-10 ${streakCount > 0 ? 'text-orange-500 fill-orange-400' : 'text-muted-foreground/50'}`} />
                    <span className="text-5xl font-bold">{streakCount}</span>
                    <span className="text-muted-foreground self-end pb-1">days</span>
                </div>
            </CardContent>
        </Card>
    );
}
