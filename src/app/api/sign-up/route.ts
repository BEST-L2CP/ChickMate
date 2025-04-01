import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: '모든 값을 입력해주세요.' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
      },
    });

    const { password, ...result } = user;

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '회원가입에 실패했습니다.' }, { status: 500 });
  }
}
