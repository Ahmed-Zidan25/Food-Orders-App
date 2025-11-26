import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb+srv://ahmadibrahimzidan_db_user:wTKdaiRY5LwWfUFq@clusterfoodorders.a8zt98p.mongodb.net/?appName=Clusterfoodorders"

async function connectDB() {
  const client = new MongoClient(uri)
  await client.connect()
  return client.db("food_orders")
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectDB()
    const collection = db.collection("orders")

    await collection.deleteOne({ _id: new ObjectId(params.id) })
    return Response.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return Response.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
