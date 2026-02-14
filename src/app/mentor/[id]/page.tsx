'use client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppContext } from '@/hooks/useAppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, Target, Zap, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { SkillExchangeModal } from '@/components/mentor/SkillExchangeModal';

export default function MentorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { mentors, user } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mentorId = typeof params.id === 'string' ? params.id : '';
  const mentor = mentors.find((m) => m.id === mentorId);
  
  if (user && user.id === mentorId) {
    router.replace('/profile');
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Redirecting to your profile...</p>
      </div>
    );
  }

  if (!mentor && user && user.id === mentorId) {
    router.replace('/profile');
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Redirecting to your profile...</p>
      </div>
    );
  }

  if (!mentor || !user) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Mentor not found</h1>
        <p className="text-muted-foreground">
          Please check the URL or go back to the dashboard.
        </p>
      </div>
    );
  }

  const mentorImage = PlaceHolderImages.find((p) => p.id === mentor.image);
  const isVerified = mentor.sessionsProvided > 10;
  
  const matchingSkill = mentor.skills.find((skill) =>
    user.learningInterests.includes(skill)
  );

  const teachableSkill = user.skillsOffered.find(skill => 
    mentor.learningInterests.includes(skill)
  );


  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row items-start gap-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shrink-0 border-4 border-card">
          {mentorImage && (
            <Image
              src={mentorImage.imageUrl}
              alt={mentor.name}
              fill
              className="object-cover"
              data-ai-hint={mentorImage.imageHint}
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">{mentor.name}</h1>
            {isVerified && <VerifiedBadge />}
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{mentor.rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-5 h-5 text-green-500" />
              <span className="font-semibold">
                {mentor.sessionsProvided} sessions taught
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="grid gap-4">
        {matchingSkill ? (
          <Alert className="bg-green-100/80 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-300">
            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertTitle className="font-bold">Perfect Match! 🎯</AlertTitle>
            <AlertDescription>
              {mentor.name} can teach you{' '}
              <span className="font-semibold">{matchingSkill}</span>.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <Target className="h-4 w-4" />
            <AlertTitle>Explore a New Skill!</AlertTitle>
            <AlertDescription>
              {`While ${mentor.name}'s skills don't directly match your current interests, this could be a great opportunity to learn something new.`}
            </AlertDescription>
          </Alert>
        )}

        {teachableSkill && (
           <Alert className="bg-blue-100/80 dark:bg-blue-900/30 border-blue-400 text-blue-800 dark:text-blue-300">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="font-bold">Teaching Opportunity! 💡</AlertTitle>
            <AlertDescription>
              You can teach {mentor.name}{' '}
              <span className="font-semibold">{teachableSkill}</span>!
            </AlertDescription>
          </Alert>
        )}
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Skills Offered</CardTitle>
          <CardDescription>
            These are the skills {mentor.name} can teach.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {mentor.skills.map((skill) => (
            <Badge key={skill} className="text-base px-4 py-2">
              {skill}
            </Badge>
          ))}
        </CardContent>
      </Card>
      
      {mentor.learningInterests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interested in Learning</CardTitle>
            <CardDescription>
              These are skills {mentor.name} wants to learn.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {mentor.learningInterests.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-base px-4 py-2">
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}


      {matchingSkill && (
        <div className="flex justify-center">
          <Button size="lg" onClick={() => setIsModalOpen(true)}>
            Start Skill Exchange
          </Button>
        </div>
      )}

      {matchingSkill && (
        <SkillExchangeModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          mentor={mentor}
          user={user}
          matchingSkill={matchingSkill}
        />
      )}
    </div>
  );
}
