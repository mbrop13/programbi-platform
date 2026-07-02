-- Create post_likes table
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all likes" ON public.post_likes;
DROP POLICY IF EXISTS "Users can manage their own likes" ON public.post_likes;

-- Add RLS Policies
CREATE POLICY "Users can view all likes" ON public.post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON public.post_likes
  FOR ALL USING (auth.uid() = user_id);

-- Trigger to increment/decrement likes_count in posts table
CREATE OR REPLACE FUNCTION public.handle_post_like()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET likes_count = COALESCE(likes_count, 0) + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_post_like_changed ON public.post_likes;

CREATE TRIGGER on_post_like_changed
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_like();
