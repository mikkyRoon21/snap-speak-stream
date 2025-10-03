import { useState, useRef } from "react";
import { Send, Image, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Comment } from "./PostCard";
import { toast } from "@/hooks/use-toast";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (author: string, content: string, media?: { type: "image" | "video" | "gif"; url: string }) => void;
}

export const CommentSection = ({ comments, onAddComment }: CommentSectionProps) => {
  const [nickname, setNickname] = useState(() => localStorage.getItem("userNickname") || "");
  const [newComment, setNewComment] = useState("");
  const [mediaPreview, setMediaPreview] = useState<{ type: "image" | "video" | "gif"; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview({
        type: type === "image" && file.type === "image/gif" ? "gif" : type,
        url,
      });
    }
  };

  const removeMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview.url);
    }
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      toast({
        title: "Nickname required",
        description: "Please enter a nickname to comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!newComment.trim() && !mediaPreview) {
      toast({
        title: "Empty comment",
        description: "Please add some text or media to your comment",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("userNickname", nickname);
    onAddComment(nickname, newComment, mediaPreview || undefined);
    setNewComment("");
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
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
            
            {comment.media && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border max-w-md">
                {comment.media.type === "image" || comment.media.type === "gif" ? (
                  <img
                    src={comment.media.url}
                    alt="Comment media"
                    className="w-full object-cover max-h-64"
                  />
                ) : (
                  <video
                    src={comment.media.url}
                    controls
                    className="w-full max-h-64"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Your nickname"
          className="font-semibold"
        />
        
        {mediaPreview && (
          <div className="relative rounded-lg overflow-hidden border border-border max-w-md">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10 h-6 w-6"
              onClick={removeMedia}
            >
              <X className="h-3 w-3" />
            </Button>
            {mediaPreview.type === "image" || mediaPreview.type === "gif" ? (
              <img
                src={mediaPreview.url}
                alt="Preview"
                className="w-full object-cover max-h-64"
              />
            ) : (
              <video
                src={mediaPreview.url}
                controls
                className="w-full max-h-64"
              />
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image")}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <Image className="h-4 w-4" />
          </Button>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video")}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => videoInputRef.current?.click()}
            className="text-secondary hover:text-secondary hover:bg-secondary/10"
          >
            <Video className="h-4 w-4" />
          </Button>

          <Button type="submit" size="icon" disabled={(!newComment.trim() && !mediaPreview) || !nickname.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
