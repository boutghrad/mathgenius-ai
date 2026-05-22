import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'يرجى إدخال بريد إلكتروني صحيح' }, { status: 400 })
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'يرجى إدخال اسم صحيح (حرفين على الأقل)' }, { status: 400 })
    }

    if (!password || password.length < 3) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 3 أحرف على الأقل' }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني مسجل بالفعل. حاول تسجيل الدخول.' }, { status: 409 })
    }

    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        password,
        plan: 'free',
      },
    })

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.' }, { status: 500 })
  }
}
