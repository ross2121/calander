export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import {deleteform} from '@/components/(backend)/form';

export const DELETE=async(req:NextRequest)=>{
  try {
    return await deleteform(req);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Message not allowed',error}, { status: 405 });
  }
}
