import { useErrorHandler } from './playground/ErrorBoundary';

const ProductPage: React.FC = () => {
  const { throwError } = useErrorHandler();
  async function getDetail() {
    try {
      const res = await fetch('http://auth.syahendra.com/v1/getme')
      if (!res.ok) {
        throw new Error('Terjadi kesalahan')
      }
    } catch (error) {
      console.error(error)
      throwError({
        statusMessage: error.message,
        statusCode: 400,
        data: {
          productId: 12
        }
      })
    }
  }

  return (
    <div>
      <h1>Halaman Produk</h1>
      <button onClick={getDetail}>Produk Valid</button>

    </div>
  );
};

export default ProductPage;