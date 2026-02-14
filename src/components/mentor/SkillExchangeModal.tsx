'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/hooks/useAppContext';
import { useRouter } from 'next/navigation';
import type { Mentor, User } from '@/lib/types';
import { ArrowRightLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { CoinIcon } from '../icons';

interface SkillExchangeModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mentor: Mentor;
  user: User;
  matchingSkill: string;
}

export function SkillExchangeModal({
  isOpen,
  setIsOpen,
  mentor,
  user,
  matchingSkill,
}: SkillExchangeModalProps) {
  const { confirmExchange } = useAppContext();
  const router = useRouter();
  const [userSkillToTeach, setUserSkillToTeach] = useState(user.skillsOffered[0]);

  const handleConfirm = () => {
    confirmExchange(mentor.id, userSkillToTeach, matchingSkill);
    setIsOpen(false);
    router.push(`/chat/${mentor.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm Skill Exchange</DialogTitle>
          <DialogDescription>
            You are about to exchange one hour of your time for one hour of {mentor.name}'s time.
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 flex flex-col items-center gap-4">
          <div className="p-4 rounded-lg bg-secondary w-full text-center">
            <p className="text-sm text-muted-foreground">You Teach (1 hour)</p>
            <Select value={userSkillToTeach} onValueChange={setUserSkillToTeach}>
              <SelectTrigger className="w-full mt-2 font-semibold text-lg h-12">
                <SelectValue placeholder="Select a skill to teach" />
              </SelectTrigger>
              <SelectContent>
                {user.skillsOffered.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ArrowRightLeft className="w-8 h-8 text-primary" />

          <div className="p-4 rounded-lg bg-secondary w-full text-center">
            <p className="text-sm text-muted-foreground">You Learn (1 hour)</p>
            <p className="font-semibold text-lg mt-2">{matchingSkill}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-background border">
            <p className="font-medium">Transaction Cost:</p>
            <div className='flex items-center gap-1 font-bold text-lg'>
                <CoinIcon className='w-5 h-5 text-yellow-400' />
                <span>5 SkillCoins</span>
            </div>
        </div>

        <DialogFooter className='mt-4'>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Exchange</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
