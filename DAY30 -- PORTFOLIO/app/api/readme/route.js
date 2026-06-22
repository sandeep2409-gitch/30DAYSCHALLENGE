import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder');

  if (!folder) {
    return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
  }

  // Sanitize to prevent path traversal
  if (!folder.startsWith('DAY') || folder.includes('..') || folder.includes('/') || folder.includes('\\')) {
    return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 });
  }

  try {
    // process.cwd() is the 'DAY30 -- PORTFOLIO' directory
    const parentDir = path.resolve(process.cwd(), '..');
    const readmePath = path.join(parentDir, folder, 'README.md');

    if (!fs.existsSync(readmePath)) {
      return NextResponse.json({ error: 'README.md not found for this project' }, { status: 404 });
    }

    const content = await fs.promises.readFile(readmePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error reading README:', error);
    return NextResponse.json({ error: 'Failed to read README' }, { status: 500 });
  }
}
