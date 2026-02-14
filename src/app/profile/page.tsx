'use client';
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
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, Zap, UserCircle, Pencil, Check, XCircle, Plus, X } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const { user, updateUserSkills } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  
  const [skillsOffered, setSkillsOffered] = useState(user?.skillsOffered || []);
  const [learningInterests, setLearningInterests] = useState(user?.learningInterests || []);
  
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newLearningInterest, setNewLearningInterest] = useState('');

  useEffect(() => {
    if (user && !isEditing) {
      setSkillsOffered(user.skillsOffered);
      setLearningInterests(user.learningInterests);
    }
  }, [user, isEditing]);

  if (!user) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-muted-foreground">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  const handleSave = () => {
    updateUserSkills({ skillsOffered, learningInterests });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // State will be reset by the useEffect
  };
  
  const handleAddSkill = (e: React.FormEvent, type: 'offered' | 'interest') => {
    e.preventDefault();
    if (type === 'offered') {
      if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
        setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
        setNewSkillOffered('');
      }
    } else {
      if (newLearningInterest.trim() && !learningInterests.includes(newLearningInterest.trim())) {
        setLearningInterests([...learningInterests, newLearningInterest.trim()]);
        setNewLearningInterest('');
      }
    }
  };
  
  const handleRemoveSkill = (skillToRemove: string, type: 'offered' | 'interest') => {
    if (type === 'offered') {
      setSkillsOffered(skillsOffered.filter(skill => skill !== skillToRemove));
    } else {
      setLearningInterests(learningInterests.filter(skill => skill !== skillToRemove));
    }
  };


  const userImage = PlaceHolderImages.find((p) => p.id === user.image);
  const isVerified = user.sessionsTaught > 10;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row items-start gap-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shrink-0 border-4 border-card">
          {userImage && (
            <Image
              src={userImage.imageUrl}
              alt={user.name}
              fill
              className="object-cover"
              data-ai-hint={userImage.imageHint}
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">{user.name}</h1>
            {isVerified && <VerifiedBadge />}
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{user.rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-5 h-5 text-green-500" />
              <span className="font-semibold">
                {user.sessionsTaught} sessions taught
              </span>
            </div>
          </div>
        </div>
         <div className='flex shrink-0 items-start gap-2'>
            {isEditing ? (
              <>
                <Button onClick={handleSave}><Check className='mr-2' /> Save</Button>
                <Button variant='outline' onClick={handleCancel}><XCircle className='mr-2' /> Cancel</Button>
              </>
            ) : (
              <Button variant='outline' onClick={() => setIsEditing(true)}>
                <Pencil className='mr-2' /> Edit Profile
              </Button>
            )}
          </div>
      </header>

      <Alert>
          <UserCircle className="h-4 w-4" />
          <AlertTitle>Your Public Mentor Profile</AlertTitle>
          <AlertDescription>
            This is how other users see you as a mentor. Keep your skills updated to attract learners!
          </AlertDescription>
      </Alert>


      <Card>
        <CardHeader>
          <CardTitle>Skills You Offer</CardTitle>
          <CardDescription>
            These are the skills you can teach to others.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            {(isEditing ? skillsOffered : user.skillsOffered).map((skill) => (
              <Badge key={skill} className="text-base px-4 py-2 relative group">
                {skill}
                {isEditing && (
                   <button onClick={() => handleRemoveSkill(skill, 'offered')} className="absolute -top-2 -right-2 bg-background rounded-full p-0.5 border border-destructive text-destructive opacity-80 hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
             <form onSubmit={(e) => handleAddSkill(e, 'offered')} className="flex gap-2 pt-4 border-t">
              <Input
                value={newSkillOffered}
                onChange={(e) => setNewSkillOffered(e.target.value)}
                placeholder="Add a new skill to offer..."
              />
              <Button type="submit"><Plus className="mr-2"/> Add</Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Learning Interests</CardTitle>
          <CardDescription>
            These are the skills you are interested in learning.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
           <div className="flex flex-wrap gap-3">
            {(isEditing ? learningInterests : user.learningInterests).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-base px-4 py-2 relative group">
                {skill}
                {isEditing && (
                  <button onClick={() => handleRemoveSkill(skill, 'interest')} className="absolute -top-2 -right-2 bg-background rounded-full p-0.5 border border-destructive text-destructive opacity-80 hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
             <form onSubmit={(e) => handleAddSkill(e, 'interest')} className="flex gap-2 pt-4 border-t">
              <Input
                value={newLearningInterest}
                onChange={(e) => setNewLearningInterest(e.target.value)}
                placeholder="Add a new learning interest..."
              />
              <Button type="submit"><Plus className="mr-2"/> Add</Button>
            </form>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
