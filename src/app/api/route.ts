import { NextResponse } from 'next/server';
import { User } from '../../models/User'; // Zmienione z '../../../models/User'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bech32address = searchParams.get('bech32address');
  if (!bech32address) {
    return NextResponse.json({ error: 'bech32address is required' }, { status: 400 });
  }
  try {
    const user = await User.findUserByAddress(bech32address);
    return NextResponse.json(user || { username: '', avatarUrl: '', hasAccount: false });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { bech32address, username, avatarUrl } = await request.json();
  if (!bech32address) {
    return NextResponse.json({ error: 'bech32address is required' }, { status: 400 });
  }
  try {
    await User.updateUser(bech32address, username, avatarUrl);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
  }
}