'use client';
import { useAppContext } from '@/hooks/useAppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, ArrowRightLeft, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CoinIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const { sessions } = useAppContext();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <History className="w-8 h-8" />
          Session History
        </h1>
        <p className="text-muted-foreground mt-1">
          A record of all your skill exchanges.
        </p>
      </header>

      <Card>
        <CardContent className="p-4">
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You have no session history yet.</p>
              <p className="text-sm text-muted-foreground/80">Start a skill exchange to see it here!</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {sessions.map((session) => {
                const isInProgress = session.status === 'In Progress';
                return (
                  <li key={session.id} className="p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className='flex-1'>
                      <div className="flex items-center gap-3 font-semibold text-lg">
                        <span>{session.userSkill}</span>
                        <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
                        <span>{session.mentorSkill}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        with {session.mentorName}
                      </p>
                    </div>
                    <div className='flex flex-col sm:items-end gap-2'>
                       <Badge
                        variant="outline"
                        className={cn(
                          isInProgress
                            ? 'bg-yellow-100/80 dark:bg-yellow-900/30 border-yellow-400 text-yellow-800 dark:text-yellow-300'
                            : 'bg-green-100/80 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-300'
                        )}
                      >
                        {isInProgress ? <Clock className="mr-1 h-3.5 w-3.5" /> : <CheckCircle className="mr-1 h-3.5 w-3.5" />}
                        {session.status}
                      </Badge>
                       <p className="text-xs text-muted-foreground">
                        {format(session.timestamp, 'PPp')}
                      </p>
                      <div className="flex items-center gap-1 text-sm font-medium">
                          <CoinIcon className="w-4 h-4 text-yellow-400" />
                          <span>{session.coinChange}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
