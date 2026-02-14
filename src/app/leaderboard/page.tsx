'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/hooks/useAppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import { CoinIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LeaderboardPage() {
  const { user, mentors } = useAppContext();

  if (!user) return null;

  const contributors = [
    ...mentors.map((m) => ({
      id: m.id,
      name: m.name,
      coins: m.coinsEarned,
      isUser: false,
      image: m.image
    })),
    { name: user.name, coins: user.coinsEarned, isUser: true, id: user.id, image: user.image },
  ].sort((a, b) => b.coins - a.coins);
  
  const getRankColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-500 fill-yellow-500';
    if (rank === 1) return 'text-gray-400 fill-gray-400';
    if (rank === 2) return 'text-orange-600 fill-orange-600';
    return 'text-muted-foreground';
  }

  const getContributorImage = (contributor: typeof contributors[0]) => {
    const contributorImage = PlaceHolderImages.find((p) => p.id === contributor.image);
    return contributorImage?.imageUrl;
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Top SkillLink Contributors
        </h1>
        <p className="text-muted-foreground mt-1">
          See who is sharing the most knowledge on the platform!
        </p>
      </header>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Contributor</TableHead>
                <TableHead className="text-right">Coins Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributors.map((c, index) => (
                <TableRow key={c.id} className={cn(c.isUser && 'bg-primary/10')}>
                  <TableCell className="font-bold text-lg">
                    <div className={cn('flex items-center gap-2', getRankColor(index))}>
                        {index < 3 && <Trophy className="w-5 h-5"/>}
                        <span>{index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={getContributorImage(c)} alt={c.name} />
                        <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{c.name} {c.isUser && "(You)"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 font-semibold">
                      <CoinIcon className="w-5 h-5 text-yellow-400" />
                      <span>{c.coins}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
