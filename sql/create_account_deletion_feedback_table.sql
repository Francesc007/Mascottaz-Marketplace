CREATE TABLE IF NOT EXISTS public.account_deletion_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_type VARCHAR(20),
  reason TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_account_deletion_feedback_user_id ON public.account_deletion_feedback(user_id);

ALTER TABLE public.account_deletion_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to insert feedback" ON public.account_deletion_feedback;

CREATE POLICY "Allow authenticated users to insert feedback"
  ON public.account_deletion_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);











