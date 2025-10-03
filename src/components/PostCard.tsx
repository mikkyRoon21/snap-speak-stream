import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CommentSection } from "./CommentSection";

export interface Post {
  id: string;
  author: string;
  content: string;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
  };
  timestamp: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

export const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike(post.id);
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
    <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all duration-300">
      <div className="flex gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
            {getInitials(post.author)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{post.author}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{formatTime(post.timestamp)}</span>
          </div>

          <p className="text-foreground leading-relaxed">{post.content}</p>

          {post.media && (
            <div className="rounded-lg overflow-hidden border border-border">
              {post.media.type === "image" || post.media.type === "gif" ? (
                <img
                  src={post.media.url}
                  alt="Post media"
                  className="w-full object-cover max-h-96"
                />
              ) : (
                <video
                  src={post.media.url}
                  controls
                  className="w-full max-h-96"
                />
              )}
            </div>
          )}

          <div className="flex items-center gap-6 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`gap-2 ${liked ? "text-accent" : "text-muted-foreground"} hover:text-accent`}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-accent" : ""}`} />
              <span>{post.likes + (liked ? 1 : 0)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="gap-2 text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-secondary"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {showComments && (
            <CommentSection
              comments={post.comments}
              onAddComment={(content) => onComment(post.id, content)}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
