import { NextRequest, NextResponse } from 'next/server';
import { mealService } from '@/lib/meal-service';
import { getAuth } from 'firebase/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const foods = await mealService.searchFoods(query);

    return NextResponse.json(foods);
  } catch (error) {
    console.error('Error searching foods:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 