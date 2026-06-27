import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/signout - Sign out
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    
    if (sessionToken) {
      // Delete session from database
      const { prisma } = await import('@/lib/prisma');
      await prisma.session.delete({
        where: { sessionToken },
      }).catch(() => {
        // Ignore if not found
      });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('better-auth.session_token');
    return response;
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json({ success: true }); // Still return success
  }
}
