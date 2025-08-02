'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FoodItem, MealLog } from '@/types';

export default function MealLoggingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadMealLogs();
  }, [selectedDate]);

  const loadMealLogs = async () => {
    try {
      const response = await fetch(`/api/meals?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setMealLogs(data);
      }
    } catch (error) {
      console.error('Error loading meal logs:', error);
    }
  };

  const searchFoods = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/meals/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching foods:', error);
    }
  };

  const addFood = (food: FoodItem) => {
    setFoods(prev => [...prev, { ...food, quantity: 100 }]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeFood = (index: number) => {
    setFoods(prev => prev.filter((_, i) => i !== index));
  };

  const updateFoodQuantity = (index: number, quantity: number) => {
    setFoods(prev => prev.map((food, i) => 
      i === index ? { ...food, quantity } : food
    ));
  };

  const calculateTotalCalories = () => {
    return foods.reduce((total, food) => {
      const ratio = food.quantity / 100;
      return total + ((food.calories || 0) * ratio);
    }, 0);
  };

  const saveMeal = async () => {
    if (foods.length === 0) {
      toast({
        title: 'No Foods Added',
        description: 'Please add at least one food item to your meal.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          mealType,
          foods: foods.map(food => ({
            ...food,
            calories: (food.calories || 0) * (food.quantity / 100),
            protein: (food.protein || 0) * (food.quantity / 100),
            carbs: (food.carbs || 0) * (food.quantity / 100),
            fat: (food.fat || 0) * (food.quantity / 100),
          })),
          notes,
          totalCalories: calculateTotalCalories()
        }),
      });

      if (response.ok) {
        toast({
          title: 'Meal Saved',
          description: 'Your meal has been logged successfully.',
        });
        
        // Reset form
        setFoods([]);
        setNotes('');
        loadMealLogs();
      } else {
        throw new Error('Failed to save meal');
      }
    } catch (error) {
      console.error('Error saving meal:', error);
      toast({
        title: 'Error',
        description: 'Failed to save meal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    searchFoods(query);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Meal Logging</h1>
        <p className="text-muted-foreground">
          Track your nutrition by logging your meals and foods.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Meal Logging Form */}
        <Card>
          <CardHeader>
            <CardTitle>Log New Meal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="food-search">Search Foods</Label>
              <Input
                id="food-search"
                placeholder="Search for foods..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                  {searchResults.map((food, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                      onClick={() => addFood(food)}
                    >
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {foods.length > 0 && (
              <div>
                <Label>Selected Foods</Label>
                <div className="space-y-2">
                  {foods.map((food, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((food.calories || 0) * (food.quantity / 100))} cal
                        </div>
                      </div>
                      <Input
                        type="number"
                        value={food.quantity}
                        onChange={(e) => updateFoodQuantity(index, parseInt(e.target.value) || 0)}
                        className="w-20"
                        min="1"
                      />
                      <span className="text-sm text-muted-foreground">g</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFood(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about your meal..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {foods.length > 0 && (
              <div className="p-4 bg-muted rounded-md">
                <div className="text-lg font-semibold mb-2">Nutrition Summary</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Total Calories: {Math.round(calculateTotalCalories())}</div>
                  <div>Protein: {Math.round(foods.reduce((sum, food) => sum + ((food.protein || 0) * (food.quantity / 100)), 0))}g</div>
                  <div>Carbs: {Math.round(foods.reduce((sum, food) => sum + ((food.carbs || 0) * (food.quantity / 100)), 0))}g</div>
                  <div>Fat: {Math.round(foods.reduce((sum, food) => sum + ((food.fat || 0) * (food.quantity / 100)), 0))}g</div>
                </div>
              </div>
            )}

            <Button onClick={saveMeal} disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Save Meal'}
            </Button>
          </CardContent>
        </Card>

        {/* Meal History */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Meals</CardTitle>
          </CardHeader>
          <CardContent>
            {mealLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No meals logged for today yet.
              </p>
            ) : (
              <div className="space-y-4">
                {mealLogs.map((meal) => (
                  <div key={meal.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold capitalize">{meal.mealType}</div>
                      <div className="text-sm text-muted-foreground">
                        {meal.totalCalories} cal
                      </div>
                    </div>
                    <div className="space-y-1">
                      {meal.foods.map((food, index) => (
                        <div key={index} className="text-sm">
                          {food.name} - {food.quantity}g
                        </div>
                      ))}
                    </div>
                    {meal.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {meal.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 