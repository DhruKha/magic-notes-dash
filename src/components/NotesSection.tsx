import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addNote, listNotes, logout } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  created_at: string;
}

export function NotesSection() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await listNotes();
      setNotes(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notes.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsLoading(true);
    try {
      await addNote(note);
      setNote('');
      await loadNotes();
      toast({
        title: "Note saved!",
        description: "Your note has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Notes</h2>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="note">Write a note</Label>
          <Input
            id="note"
            placeholder="Enter your note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !note.trim()}
        >
          {isLoading ? 'Saving...' : 'Save Note'}
        </Button>
      </form>

      {notes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Notes</h3>
          <div className="space-y-2">
            {notes.map((noteItem) => (
              <div key={noteItem.id} className="p-4 border rounded-lg bg-card">
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(noteItem.created_at).toLocaleString()}
                </p>
                <p>{noteItem.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}