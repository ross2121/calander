"use server"
import { NextResponse } from 'next/server';
import {form} from '@/components/(backend)/form';
export const POST=async(req:Request)=>{
  try {
    return await form(req);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Message not allowed',error}, { status: 405 });
  }
}

