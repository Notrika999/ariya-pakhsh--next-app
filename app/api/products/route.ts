import { products } from "@/lib/mocks/products"

export async function GET() {
  return Response.json(products)
}
