-- 1. Agregar columna 'likes' a la tabla 'newsletter_articles' si no existe
ALTER TABLE newsletter_articles ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- 2. Crear función RPC para incrementar los likes de forma concurrente y segura
CREATE OR REPLACE FUNCTION increment_article_likes(article_id UUID, increment_by INT)
RETURNS INT AS $$
DECLARE
  new_likes INT;
BEGIN
  UPDATE newsletter_articles
  SET likes = COALESCE(likes, 0) + increment_by
  WHERE id = article_id
  RETURNING likes INTO new_likes;
  
  RETURN new_likes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

