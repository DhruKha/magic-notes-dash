// Update this page (the content is just a fallback if you fail to update the page)

import { LoginSection } from '@/components/LoginSection';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="text-xl text-muted-foreground">
            Get started with magic link authentication
          </p>
        </div>
        
        <LoginSection />
      </div>
    </div>
  );
};

export default Index;
