import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email === 'superadmin@store.com' && password === 'superadmin123@') {
      const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
      // Set a simple cookie for auth
      response.cookies.set({
        name: 'admin_token',
        value: 'superadmin_token_123',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid Super Admin email or password', message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error', message: 'Server error' },
      { status: 500 }
    );
  }
}
