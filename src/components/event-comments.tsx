
'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { processComment } from '@/ai/flows/comment-flow';
import { onCommentsSnapshot } from '@/lib/firebase-service';
import type { Comment } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Smile, Frown, Meh } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

type EventCommentsProps = {
  eventId: string;
};

const sentimentIcons = {
  positive: <Smile className="h-4 w-4 text-green-500" />,
  negative: <Frown className="h-4 w-4 text-red-500" />,
  neutral: <Meh className="h-4 w-4 text-gray-500" />,
};

export function EventComments({ eventId }: EventCommentsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [newComment, setNewComment] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!eventId) return;

    setLoading(true);
    const unsubscribe = onCommentsSnapshot(eventId, (newComments) => {
      setComments(newComments);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error loading comments',
        description: 'Could not fetch comments. Please try again later.',
      });
    });

    return () => unsubscribe();
  }, [eventId, toast]);

  const handlePostComment = async () => {
    if (!newComment.trim() || !user) {
      return;
    }

    setSubmitting(true);
    try {
      await processComment({
        eventId,
        userId: user.uid,
        userEmail: user.email || 'Anonymous',
        text: newComment,
      });
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to post comment',
        description: 'There was an issue submitting your comment. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  }

  return (
    <div>
      <h4 className="font-semibold mb-3 flex items-center">
        <MessageSquare className="mr-2 h-5 w-5 text-primary" /> Community Comments
      </h4>
      {user ? (
        <div className="mt-4 flex gap-2">
          <Textarea
            placeholder="Add a public comment..."
            className="flex-grow"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
          />
          <Button onClick={handlePostComment} disabled={submitting || !newComment.trim()}>
            {submitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mt-2">
          You must be logged in to post a comment.
        </p>
      )}
      <div className="space-y-4 mt-6 pr-2">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>{getInitials(comment.userEmail)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{comment.userEmail}</p>
                    {sentimentIcons[comment.sentiment as keyof typeof sentimentIcons]}
                </div>
                <p className="text-sm text-muted-foreground">{comment.text}</p>
                 <p className="text-xs text-muted-foreground/70 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
