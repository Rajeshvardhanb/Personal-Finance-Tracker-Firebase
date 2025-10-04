
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFinances } from "@/hooks/use-finances";
import { Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotesWidget() {
  const { data, addNote, deleteNote } = useFinances();
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote({ content: newNote, createdAt: new Date().toISOString() });
      setNewNote("");
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">Quick Notes</CardTitle>
        <CardDescription>Jot down to-dos and reminders.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
          />
          <Button size="icon" onClick={handleAddNote}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-40">
          <div className="space-y-2">
            {data.notes.map((note) => (
              <div key={note.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                <p className="text-sm flex-1 pr-2">{note.content}</p>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => deleteNote(note.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
            {data.notes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center pt-8">No notes yet.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
