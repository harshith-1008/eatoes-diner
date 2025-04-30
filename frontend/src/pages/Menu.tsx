import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { useState, useEffect } from "react";

interface MenuItem {
  _id: string;
  name: string;
  desc: string;
  price: number;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface MenuProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export const Menu = ({ cartItems, setCartItems }: MenuProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [error, setError] = useState(
    " Please wait a moment. Render may take ~50s to start the server."
  );
  const [loading, setLoading] = useState(true);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    recommended: true,
  });

  const fetchMenuItems = async (category = "") => {
    try {
      setLoading(true);
      setError("");

      let url = `${import.meta.env.VITE_BACKEND_URL}/menu`;
      if (category) {
        url += `?category=${category}`;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) throw new Error("Failed to fetch menu");

      const data = await response.json();
      if (data?.data) {
        setMenuItems(data.data);
      }
    } catch (err: any) {
      setError(
        "Please wait a moment. Render may take ~50s to start the server."
      );
      console.error("Menu fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    fetchMenuItems(category);
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getItemsByCategory = (category: string) => {
    return menuItems.filter((item) => item.category === category);
  };

  const handleAddToCart = (item: any) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      const updatedCart = cartItems.map((cartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
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

  if (error) {
    return (
      <div className="text-red-600 text-center mt-10">
        <p>{error}</p>
        <button
          onClick={() => fetchMenuItems()}
          className="mt-4 text-blue-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="mx-2 mt-8 md:mx-20 md:my-4 md:py-4 md:px-4 px-2 py-2">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-mono font-bold">Dominos Pizza</h1>
          <span className="bg-green-800 rounded-md px-2 space-x-1 py-2 flex flex-row text-white items-center justify-center">
            <Star size={15} />
            <p className="text-sm">4.2</p>
          </span>
        </div>
        <p className="text-sm">
          Freshly baked pizzas loaded with delicious toppings, made to satisfy
          every craving. Order Domino's now for quick delivery and unbeatable
          taste!
        </p>
      </div>

      <div className="flex flex-row items-center space-x-2 mt-4">
        {["starter", "main-course", "dessert", "drinks"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              handleCategoryClick(cat);
              setOpenSections((prev) => ({
                ...prev,
                [cat]: true,
              }));
            }}
            className={`border-[0.1px] px-3 py-1 rounded-full text-sm ${
              activeCategory === cat
                ? "bg-green-800 text-white"
                : "text-gray-600"
            } drop-shadow-2xl`}
          >
            {cat === "starter" && "Starters"}
            {cat === "main-course" && "Main Course"}
            {cat === "dessert" && "Desserts"}
            {cat === "drinks" && "Drinks"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {activeCategory === "" && (
          <div className="border-[0.001rem] border-gray-400 px-3 py-2 rounded-lg text-gray-800">
            <div
              className="flex flex-row justify-between items-center cursor-pointer"
              onClick={() => toggleSection("recommended")}
            >
              <p className="text-xl">Recommended</p>
              {openSections["recommended"] ? <ChevronUp /> : <ChevronDown />}
            </div>
            {openSections["recommended"] && (
              <div className="flex flex-col mt-2">
                {menuItems.slice(0, 2).map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-row justify-between items-center pb-2 border-gray-600"
                  >
                    <div className="flex flex-col w-[70%]">
                      <h2 className="text-xl font-semibold text-gray-700">
                        {item.name}
                      </h2>
                      <p className="text-black">₹{item.price}</p>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </div>
                    {cartItems.find((cartItem) => cartItem._id === item._id) ? (
                      <div className="flex items-center space-x-2 border-[0.1px] px-2 py-1 rounded-md">
                        <button
                          onClick={() => handleDecrement(item._id)}
                          className="text-green-800 font-bold text-lg"
                        >
                          -
                        </button>
                        <p className="font-semibold">
                          {
                            cartItems.find(
                              (cartItem) => cartItem._id === item._id
                            )?.quantity
                          }
                        </p>
                        <button
                          onClick={() => handleIncrement(item._id)}
                          className="text-green-800 font-bold text-lg"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => handleAddToCart(item)}
                        className="text-green-800 border-[0.001rem] text-sm px-4 font-bold py-2 rounded-md cursor-pointer"
                      >
                        ADD
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {["starter", "main-course", "dessert", "drinks"].map((cat) => (
          <div
            key={cat}
            className="border-[0.001rem] border-gray-400 px-3 py-2 rounded-lg text-gray-800"
          >
            <div
              className="flex flex-row justify-between items-center cursor-pointer"
              onClick={() => toggleSection(cat)}
            >
              <p className="text-xl">
                {cat === "starter" && "Starters"}
                {cat === "main-course" && "Main Course"}
                {cat === "dessert" && "Desserts"}
                {cat === "drinks" && "Drinks"}
              </p>
              {openSections[cat] ? <ChevronUp /> : <ChevronDown />}
            </div>

            {openSections[cat] && (
              <div className="flex flex-col mt-2">
                {getItemsByCategory(cat).map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-row justify-between items-center pb-2 border-gray-600"
                  >
                    <div className="flex flex-col w-[70%]">
                      <h2 className="text-xl font-semibold text-gray-700">
                        {item.name}
                      </h2>
                      <p className="text-black">₹{item.price}</p>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </div>
                    {cartItems.find((cartItem) => cartItem._id === item._id) ? (
                      <div className="flex items-center space-x-2 border-[0.1px] px-2 py-1 rounded-md">
                        <button
                          onClick={() => handleDecrement(item._id)}
                          className="text-green-800 font-bold text-lg"
                        >
                          -
                        </button>
                        <p className="font-semibold">
                          {
                            cartItems.find(
                              (cartItem) => cartItem._id === item._id
                            )?.quantity
                          }
                        </p>
                        <button
                          onClick={() => handleIncrement(item._id)}
                          className="text-green-800 font-bold text-lg"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => handleAddToCart(item)}
                        className="text-green-800 border-[0.001rem] text-sm px-4 font-bold py-2 rounded-md cursor-pointer"
                      >
                        ADD
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
