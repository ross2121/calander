export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import {getform} from '@/components/(backend)/form';


export const GET=async(req:NextRequest)=>{
  try {
    return await getform(req);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Message not allowed',error}, { status: 405 });
  }
}
// export const dynamic = 'force-dynamic';
