import { type NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from "@/lib/prisma"

const medicineSchema = z.object({
  medicines: z.array(
    z.object({
      nameOfMedicine: z.string(),
      noOfTablets: z.number(),
      whenToTake: z.array(z.number()).length(3), 
      notes: z.string().optional(), 
    })
  ).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const scanCount = await prisma.scanLog.count({
      where: {
        userId,
        createdAt: { gte: oneDayAgo }
      }
    })

    if (scanCount >= 5) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'You can only scan 5 prescriptions per day. Please try again later. You can either add those prescription details manually or wait for the next day to scan more prescriptions.'
        },
        { status: 429 }
      )
    }

    await prisma.scanLog.create({
      data: { userId }
    })

    // Get form data
    const formData = await request.formData()
    const image = formData.get('image') as File
    const ocrText = formData.get('ocrText') as string

    if (!image || !ocrText) {
      return NextResponse.json({ error: 'Missing image or OCR text' }, { status: 400 })
    }

    const imageBuffer = await image.arrayBuffer()
    const imageBase64 = Buffer.from(imageBuffer).toString('base64')
    const imageDataUrl = `data:${image.type};base64,${imageBase64}`

    console.log('Processing with AI...')
    console.log('OCR Text:', ocrText.substring(0, 200) + '...')

    const result = await generateObject({
      model: openai('gpt-4o'),
      schema: medicineSchema,
      messages: [
        {
          role: 'system',
          content: `You are a professional pharmacist with extensive experience reading doctor's handwriting and prescriptions. 
          You will receive both OCR text output and the original prescription image. 
          Parse the prescription and extract medicine information in the specified format.
          
          For whenToTake array: [morning, afternoon, evening] where 1 means take medicine, 0 means don't take.
          Common patterns:
          - "Once daily" or "OD" or "1x daily" = [1,0,0] (morning)
          - "Twice daily" or "BD" or "2x daily" = [1,0,1] (morning and evening)  
          - "Three times daily" or "TDS" or "3x daily" = [1,1,1] (morning, afternoon, evening)
          - "Before meals" typically means with main meals
          - "After meals" typically means after main meals
          - "QID" or "4 times daily" = [1,1,1] (distribute across day)
          
          For noOfTablets, look for:
          - Total quantity prescribed (e.g., "30 tablets", "60 caps")
          - Duration of treatment (e.g., "for 10 days", "x 2 weeks")
          - Calculate total based on frequency and duration
          
          Be conservative with dosing - if unclear, default to once daily morning.
          If you can't determine the exact number of tablets, make a reasonable estimate based on typical prescriptions.
          Also extract any specific notes or side effects mentioned for each medicine.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please analyze this prescription and extract the medicine information. 
              
              OCR Text Output: ${ocrText}
              
              Please provide the medicine details in the specified JSON format. Focus on:
              1. Medicine names (generic or brand names)
              2. Total number of tablets/capsules prescribed
              3. Frequency of administration (morning, afternoon, evening)
              4. Any specific notes or side effects.`,
            },
            {
              type: 'image',
              image: imageDataUrl,
            },
          ],
        },
      ],
    })

    console.log('AI Processing completed:', result.object)
    return NextResponse.json(result.object)
  } catch (error) {
    console.error('Error processing prescription:', error)
    return NextResponse.json({ error: 'Failed to process prescription' }, { status: 500 })
  }
}
