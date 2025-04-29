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
  const calculateItemTotal = (item: CartItem) => {
    return item.price * item.quantity;
  };

  const calculateCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/order/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            orderItems: cartItems.map((item) => ({
              _id: item._id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              category: item.category,
            })),
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Order placed successfully!");
        setCartItems([]);
      } else {
        alert(data?.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong while placing order.");
    }
  };

  return (
    <div className="mx-2 mt-8 md:mx-20 md:my-4 md:py-4 md:px-4 px-2 py-2">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded flex flex-col space-y-1"
            >
              <div className="items-center flex justify-between">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-green-700 font-bold">
                  Total: ₹{calculateItemTotal(item)}
                </p>
              </div>

              <p className="text-gray-700">Quantity: {item.quantity}</p>
              <p className="text-gray-700">Price per item: ₹{item.price}</p>
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
