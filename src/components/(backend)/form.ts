import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma=new PrismaClient();
export const dynamic = "force-dynamic";
export const form=async(req:Request)=>{
    try {
        const body=await req.json();
        const{title,date,time,picture,video,text}=body;
        
            if (!title || !date || !time || !text) {
                return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
              }
          
        const form=await prisma.form.create({
            data:{
                title,
                date,
                time,
                text,
                picture,
                video
            }
        })
        // return NextResponse.json({ form }, { status: 200 });
        return NextResponse.json({ form }, { status: 200 });
    } catch (error) {
        console.log( error);
        return NextResponse.json({ error:"Internal service error" }, { status: 500 });
    }
}
export const getform=async(req:NextRequest)=>{
    try {
        const date=req.nextUrl.searchParams.get("date");
            if ( !date) {
                return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
              }
          
        const form=await prisma.form.findFirst({
            where:{
                date:date
            }
        })
        // return NextResponse.json({ form }, { status: 200 });
        return NextResponse.json({ form }, { status: 200 });
    } catch (error) {
        console.log( error);
        return NextResponse.json({ error:"Internal service error" }, { status: 500 });
    }
}
export const updateform = async (req: NextRequest) => {
    try {
    
        const body = await req.json();
        const id = parseInt(req.nextUrl.searchParams.get("id")||'',10);
    
        if (!id||!body.title || !body.text || !body.time) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const form = await prisma.form.findUnique({
            where: {
                id:id
            }
        });

        if (!form) {
            return NextResponse.json({ error: "Form not found" }, { status: 404 });
        }
        
        const updatedForm = await prisma.form.update({
            where: { id: form.id },
            data: {
                title: body.title,
                text: body.text,
                time: body.time,
                // picture: body.picture || null
            }
        });
        return NextResponse.json({updatedForm}, { status: 200 });       
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal service error" }, { status: 500 });
    }
}
export const deleteform = async (req: NextRequest) => {
    try {
        const date = req.nextUrl.searchParams.get("date");
        if(!date){
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
    
        const form = await prisma.form.findUnique({
            where: {
                date:date
            }
        });

        if (!form) {
            return NextResponse.json({ error: "Form not found" }, { status: 404 });
        }
        const deleteform= await prisma.form.delete({
            where: { id: form.id }
        });
        return NextResponse.json({deleteform}, { status: 200 });
        
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal service error" }, { status: 500 });
    }
}
export const getall= async () => {
    try {
      const getall=await prisma.form.findMany();     
        return NextResponse.json({getall}, { status: 200 });
        
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal service error" }, { status: 500 });
    }
}

export const getid = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get('id') || '';

    if (!id) {
      return NextResponse.json({ error: "Invalid or missing 'id' parameter" }, { status: 400 });
    }

    const getbyid = await prisma.form.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!getbyid) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Return the found record
    return NextResponse.json({ data: getbyid }, { status: 200 });
  } catch (error) {
    // Log specific error details for debugging
    console.error('Error fetching record by ID:', error);

    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
  }
};

