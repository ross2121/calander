export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {getid} from '@/components/(backend)/form';


export const GET=async(req:NextRequest)=>{
  try {
    return await getid(req);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Message not allowed',error}, { status: 405 });
  }
}
// export const dynamic = 'force-dynamic';
