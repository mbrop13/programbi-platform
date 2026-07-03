-- Migration: Add model and metadata columns to ai_messages
-- This allows tracking which AI model was used for each message

-- Add model column to track which AI model generated the message
ALTER TABLE ai_messages 
ADD COLUMN IF NOT EXISTS model TEXT;

-- Add metadata column for additional info (token count, reasoning tokens, finish reason, etc.)
ALTER TABLE ai_messages 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create index on model for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_messages_model 
ON ai_messages(model) 
WHERE model IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN ai_messages.model IS 'AI model ID used to generate this message (e.g., llama-3-8b, gpt-4o-mini)';
COMMENT ON COLUMN ai_messages.metadata IS 'JSON metadata: {tokenCount, reasoningTokens, finishReason, etc.}';
