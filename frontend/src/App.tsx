import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

interface Goal {
  id: number;
  text: string;
  suggestions: string;
}

const GoalCreator = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentGoal, setCurrentGoal] = useState("");
  const [editingGoalId, setEditingGoalId] = useState<null | number>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateGoalSuggestions = async (goal: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/receive-ai-suggestion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal }),
        }
      );
      const data = await response.json();
      return data.Message;
    } catch (error) {
      return "Unable to generate suggestions.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!currentGoal) return;

    const suggestions = await generateGoalSuggestions(currentGoal);

    const newGoal = {
      id: Date.now(),
      text: currentGoal,
      suggestions,
    };

    setGoals((prev) => [...prev, newGoal]);
    setCurrentGoal("");
  };

  const handleEditGoal = async () => {
    if (!currentGoal) return;

    const suggestions = await generateGoalSuggestions(currentGoal);

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === (editingGoalId as number)
          ? { ...goal, text: currentGoal, suggestions }
          : goal
      )
    );

    setCurrentGoal("");
    setEditingGoalId(null);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals((prev) => prev?.filter((goal) => goal.id !== id));
  };

  const startEditing = (goal: Goal) => {
    setCurrentGoal(goal.text);
    setEditingGoalId(goal.id);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Goal Creator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter your goal"
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              className="flex-grow"
            />
            <Button
              onClick={editingGoalId ? handleEditGoal : handleAddGoal}
              disabled={!currentGoal || isLoading}
            >
              {editingGoalId ? "Update" : "Add"}
            </Button>
          </div>

          <div className="space-y-2">
            {goals?.map((goal: Goal) => (
              <div
                key={goal.id}
                className="bg-gray-100 p-3 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{goal.text}</p>
                  {goal.suggestions && (
                    <p className="text-sm text-gray-600 mt-1">
                      {goal.suggestions}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing(goal)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCreator;
