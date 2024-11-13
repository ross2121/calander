export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import {updateform} from '@/components/(backend)/form';

export const PATCH=async(req:NextRequest)=>{
  try {
    return await updateform(req);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Message not allowed',error}, { status: 405 });
  }
}
