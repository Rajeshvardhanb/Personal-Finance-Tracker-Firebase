
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

const INACTIVITY_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
const WARNING_TIME_MS = 30 * 1000; // 30 seconds

export default function InactivityTimeout() {
  const { user, logout } = useAuth();
  const [isActive, setIsActive] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(INACTIVITY_TIMEOUT_MS / 1000);

  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  const handleLogout = useCallback(() => {
    setShowWarning(false);
    logout();
  }, [logout]);

  const handleStay = () => {
    setShowWarning(false);
    resetTimeout();
  };

  const resetTimeout = useCallback(() => {
    setIsActive(true);
    setShowWarning(false);
    setRemainingTime(INACTIVITY_TIMEOUT_MS / 1000);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const startTimer = () => {
      timeoutRef.current = setTimeout(() => {
        setIsActive(false);
        setShowWarning(true);
      }, INACTIVITY_TIMEOUT_MS - WARNING_TIME_MS);

      intervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    if (user) {
        startTimer();
    }

  }, [user, handleLogout]);

  useEffect(() => {
    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll'];
    
    const handleActivity = () => {
      resetTimeout();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    resetTimeout();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimeout]);
  
  if (!user) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you still there?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be automatically logged out due to inactivity in{" "}
            <span className="font-bold text-lg text-destructive">
                {formatTime(remainingTime)}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => handleLogout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout Now
          </Button>
          <Button onClick={handleStay}>I'm still here</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
