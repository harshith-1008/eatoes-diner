import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Order {
  id: number;
  totalPrice: number;
  items: { name: string; price: number; quantity?: number }[];
  createdAt: string;
}

export const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/order/orders`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

        setOrders(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="mx-2 mt-8 md:mx-20 md:my-4 md:py-4 md:px-4 px-2 py-2">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <div className="text-red-600">
          <button
            onClick={() => navigate("/login")}
            className="mt-2 text-blue-600 underline"
          >
            Login to view order history
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-700">
          <p className="text-lg font-medium mb-2">
            You haven't placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded-md shadow-sm space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-800">
                  Order ID: #{order.id}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <p>
                      {item.name}
                      {item.quantity && item.quantity > 1
                        ? ` × ${item.quantity}`
                        : ""}
                    </p>
                    <p>₹{item.price * (item.quantity || 1)}</p>
                  </div>
                ))}
              </div>

              <div className="text-right font-semibold text-green-800">
                Total: ₹{order.totalPrice}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
