import { useState } from "react";
import { Sparkles } from "lucide-react";
import { CreatePost } from "@/components/CreatePost";
import { PostCard, Post } from "@/components/PostCard";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Sarah Chen",
      content: "Just deployed my first full-stack app! The feeling is incredible 🚀",
      timestamp: new Date(Date.now() - 3600000),
      likes: 24,
      comments: [
        {
          id: "c1",
          author: "Alex Rivera",
          content: "Congrats! What tech stack did you use?",
          timestamp: new Date(Date.now() - 1800000),
        },
      ],
    },
    {
      id: "2",
      author: "Mike Johnson",
      content: "Beautiful sunset at the beach today. Nature never disappoints! 🌅",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      },
      timestamp: new Date(Date.now() - 7200000),
      likes: 142,
      comments: [],
    },
  ]);

  const handleCreatePost = (content: string, media?: { type: "image" | "video" | "gif"; url: string }) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: "You",
      content,
      media,
      timestamp: new Date(),
      likes: 0,
      comments: [],
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map((post) => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleComment = (postId: string, content: string, media?: { type: "image" | "video" | "gif"; url: string }) => {
    setPosts(posts.map((post) => 
      post.id === postId 
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now().toString(),
                author: "You",
                content,
                timestamp: new Date(),
                media,
              },
            ],
          }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-glow)]">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SocialFlow
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={heroBanner}
          alt="Hero banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 -mt-16 relative z-10">
        <CreatePost onCreatePost={handleCreatePost} />

        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>SocialFlow - Share your moments, connect with others</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
