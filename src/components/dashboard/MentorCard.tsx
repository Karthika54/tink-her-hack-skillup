import Image from 'next/image';
import Link from 'next/link';
import type { Mentor } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const isVerified = mentor.sessionsProvided > 10;
  const mentorImage = PlaceHolderImages.find((p) => p.id === mentor.image);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          {mentorImage && (
            <Image
              src={mentorImage.imageUrl}
              alt={mentor.name}
              fill
              className="object-cover"
              data-ai-hint={mentorImage.imageHint}
            />
          )}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{mentor.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-lg">{mentor.name}</h3>
          {isVerified && <VerifiedBadge />}
        </div>
        <div className="flex flex-wrap gap-2">
          {mentor.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button asChild className="w-full" variant="outline">
          <Link href={`/mentor/${mentor.id}`}>
            View Profile <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
