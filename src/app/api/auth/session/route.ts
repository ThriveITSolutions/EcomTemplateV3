import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/auth/session - Get current session
export async function GET(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ user: null, customer: null });
    }

    // Find session
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          include: {
            customer: {
              include: {
                user: {
                  select: { id: true, email: true, firstName: true, lastName: true, displayName: true, role: true, avatar: true },
                },
              },
            },
          },
        },
      },
    });

    if (!session || session.expires < new Date()) {
      // Clear expired session cookie
      const response = NextResponse.json({ user: null, customer: null });
      response.cookies.delete('better-auth.session_token');
      return response;
    }

    const user = session.user;
    const customer = user.customer;

    return NextResponse.json({
      user: customer ? {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        role: user.role,
        avatar: user.avatar,
      } : null,
      customer: customer ? {
        id: customer.id,
        userId: customer.userId,
        loyaltyPoints: customer.loyaltyPoints,
        loyaltyTier: customer.loyaltyTier,
      } : null,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null, customer: null });
  }
}
