import type { ReactNode } from 'react'
import { Template, useSlots, ref } from 'use-react-utilities'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface ProductCardProps {
  product: Product
  children: ReactNode
}

interface SlotProps {
  product: Product;
  AddToCart: () => void

}
function ProductCard({ product, children }: Readonly<ProductCardProps>) {
  const { slots, scopedSlots } = useSlots<Product>(children)

  function AddToCart() {
    alert('wewe')
  }

  const slotProps = {
    AddToCart
  } as SlotProps;

  const combinedProps: Product & SlotProps = {
    ...product,
    ...slotProps,
  };

  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      {slots.header && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
          {slots.header}
        </div>
      )}

      <div className="p-4">
        {scopedSlots.body ? scopedSlots.body(product) : (
          <div>
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600">Rp {product.price.toLocaleString('id-ID')}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 border-t">
        {scopedSlots.footer ? scopedSlots.footer(combinedProps) : slots.footer}
      </div>
    </div>
  )
}

export default function App() {
  const count = ref(0)
  const product: Product = {
    id: 1,
    name: "Laptop Gaming",
    price: 15000000,
    stock: 5
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <button onClick={() => count.value += 1}>Add Count</button>
        <ProductCard product={product}>
          <Template name="header">
            🔥 New Product
          </Template>

          <Template name="body">
            {(prod: Product) => (
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">{prod.name}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-blue-600">
                    Rp {prod.price.toLocaleString('id-ID')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${prod.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {prod.stock > 0 ? `Stok: ${prod.stock}` : 'Habis'}
                  </span>
                </div>
                <p className="text-gray-600">
                  Computer gaming
                </p>
              </div>
            )}
          </Template>

          <Template name="footer">
            {
              (props: SlotProps) => (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={props.AddToCart}
                >
                  Add to Cart
                </button>
              )
            }
          </Template>
        </ProductCard>
      </div>
    </div>
  )
}