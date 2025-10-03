import { useState, useRef } from "react";
import { Image, Video, Smile, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface CreatePostProps {
  onCreatePost: (content: string, media?: { type: "image" | "video" | "gif"; url: string }) => void;
}

export const CreatePost = ({ onCreatePost }: CreatePostProps) => {
  const [content, setContent] = useState("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaPreview) {
      toast({
        title: "Empty post",
        description: "Please add some content or media to your post",
        variant: "destructive",
      });
      return;
    }

    onCreatePost(content, mediaPreview || undefined);
    setContent("");
    setMediaPreview(null);
    
    toast({
      title: "Posted!",
      description: "Your post has been shared",
    });
  };

  const removeMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview.url);
    }
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-medium)] border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
              You
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 text-lg p-0"
            />

            {mediaPreview && (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-8 w-8"
                  onClick={removeMedia}
                >
                  <X className="h-4 w-4" />
                </Button>
                {mediaPreview.type === "image" || mediaPreview.type === "gif" ? (
                  <img
                    src={mediaPreview.url}
                    alt="Preview"
                    className="w-full object-cover max-h-96"
                  />
                ) : (
                  <video
                    src={mediaPreview.url}
                    controls
                    className="w-full max-h-96"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex gap-2">
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
              <Image className="h-5 w-5" />
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
              <Video className="h-5 w-5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-accent hover:text-accent hover:bg-accent/10"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>

          <Button
            type="submit"
            variant="gradient"
            disabled={!content.trim() && !mediaPreview}
            className="px-6"
          >
            Post
          </Button>
        </div>
      </form>
    </Card>
  );
};
