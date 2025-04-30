import { useEffect, useState } from "react";

interface CartItem {
  _id: string;
  name: string;
  desc: string;
  price: number;
  category: string;
  quantity: number;
}

export const Cart = ({
  cartItems,
  setCartItems,
}: {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const calculateItemTotal = (item: CartItem) => item.price * item.quantity;

  const calculateCartTotal = () =>
    cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/order/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            orderItems: cartItems.map((item) => ({
              _id: item._id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              itemTotal: item.price * item.quantity,
              category: item.category,
            })),
          }),
        }
      );

      if (response.status === 401) {
        setShowLoginPrompt(true);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setCartItems([]);
        setOrderSuccess(true);
      } else {
        alert(data?.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setShowLoginPrompt(true);
    }
  };

  const handleIncrement = (id: string) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
  };

  const handleDecrement = (id: string) => {
    const updatedCart = cartItems
      .map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updatedCart);
  };

  useEffect(() => {
    if (orderSuccess) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            window.location.href = "/history";
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [orderSuccess]);

  return (
    <div className="mx-2 mt-8 md:mx-20 md:my-4 md:py-4 md:px-4 px-2 py-2">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h2 className="text-xl font-semibold mb-4">Not Logged In</h2>
            <p className="text-gray-700 mb-4">
              You need to log in to place an order.
            </p>
            <button
              onClick={() => {
                setShowLoginPrompt(false);
                window.location.href = "/login";
              }}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold mb-2">Order Placed!</h2>
            <p className="text-gray-700">
              Redirecting to order history in {countdown} second
              {countdown !== 1 && "s"}...
            </p>
          </div>
        </div>
      )}

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded flex flex-col space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-green-700 font-bold">
                  Total: ₹{calculateItemTotal(item)}
                </p>
              </div>
              <p className="text-gray-700">Price per item: ₹{item.price}</p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDecrement(item._id)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span className="text-sm">{item.quantity}</span>
                <button
                  onClick={() => handleIncrement(item._id)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 border-t pt-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Grand Total: ₹{calculateCartTotal()}
            </h2>
            <button
              onClick={handlePlaceOrder}
              className="bg-green-800 text-white px-4 py-2 rounded-md"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
