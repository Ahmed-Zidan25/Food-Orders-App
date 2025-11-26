import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb+srv://eslam:123@cluster0.yccrhct.mongodb.net/?appName=Cluster0"

async function connectDB() {
  const client = new MongoClient(uri)
  await client.connect()
  return client.db("food_orders")
}

export async function GET() {
  try {
    const db = await connectDB()
    const orders = await db.collection("orders").find({}).toArray()
    return Response.json(orders)
  } catch (error) {
    console.error("Database error:", error)
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, items } = await request.json()

    if (!name || !items) {
      return Response.json({ error: "Name and items are required" }, { status: 400 })
    }

    const db = await connectDB()
    const collection = db.collection("orders")

    // Check if order exists and update or create
    const existingOrder = await collection.findOne({ name })

    if (existingOrder) {
      const result = await collection.updateOne({ name }, { $set: { items } })
      const updated = await collection.findOne({ name })
      return Response.json(updated)
    } else {
      const result = await collection.insertOne({ name, items })
      const newOrder = await collection.findOne({ _id: result.insertedId })
      return Response.json(newOrder)
    }
  } catch (error) {
    console.error("Database error:", error)
    return Response.json({ error: "Failed to save order" }, { status: 500 })
  }
}
