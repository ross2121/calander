"use server"
import { NextResponse } from 'next/server';
import {getall} from '@/components/(backend)/form';

export const GET=async()=>{
  try {
    return await getall();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Message not allowed',error}, { status: 405 });
  }
}
