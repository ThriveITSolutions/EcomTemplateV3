import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/register - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // TODO: Implement registration
    // 1. Check if email exists
    // 2. Hash password
    // 3. Create user
    // 4. Create customer profile
    // 5. Create session

    return NextResponse.json(
      { message: 'Registration not implemented yet' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    );
  }
}