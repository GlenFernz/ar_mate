import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

interface Interaction {
  id: string;
  user_input: string;
  response_text: string;
  timestamp: {
    seconds: number;
  };
}

interface SessionHistoryProps {
  children: ReactNode;
}

const SessionHistory = ({ children }: SessionHistoryProps) => {
  const [history, setHistory] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "interactions"), orderBy("timestamp", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const interactions: Interaction[] = [];
      querySnapshot.forEach((doc) => {
        interactions.push({ id: doc.id, ...doc.data() } as Interaction);
      });
      setHistory(interactions);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching session history:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Session History</SheetTitle>
          <SheetDescription>
            Here are your 20 most recent interactions.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {isLoading ? (
            <p>Loading history...</p>
          ) : history.length === 0 ? (
            <p>No history found.</p>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="text-sm p-3 bg-secondary/50 rounded-lg">
                  <p className="font-semibold text-foreground">You:</p>
                  <p className="text-muted-foreground mb-2">{item.user_input}</p>
                  <p className="font-semibold text-accent">AR Mate:</p>
                  <p className="text-muted-foreground">{item.response_text}</p>
                  <p className="text-xs text-muted-foreground/50 mt-2">
                    {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SessionHistory;
