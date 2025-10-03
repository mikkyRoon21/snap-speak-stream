import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Comment } from "./PostCard";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
}

export const CommentSection = ({ comments, onAddComment }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="mt-4 space-y-4 pt-4 border-t border-border">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
              {getInitials(comment.author)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.author}</span>
              <span className="text-muted-foreground text-xs">{formatTime(comment.timestamp)}</span>
            </div>
            <p className="text-sm mt-1 text-foreground">{comment.content}</p>
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newComment.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
