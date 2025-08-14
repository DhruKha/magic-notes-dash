import { useState, useEffect } from 'react';
import { LoginSection } from '@/components/LoginSection';
import { NotesSection } from '@/components/NotesSection';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        {user ? (
          <NotesSection />
        ) : (
          <>
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Welcome</h1>
              <p className="text-xl text-muted-foreground">
                Get started with magic link authentication
              </p>
            </div>
            
            <LoginSection />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
