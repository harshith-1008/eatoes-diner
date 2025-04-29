import { History, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export const Navabar = ({ cartItems }: { cartItems: any[] }) => {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="flex justify-between md:mx-20 md:my-4 md:py-4 md:px-4 px-4 py-6 items-center border-b-[0.025rem] border-b-gray-400 relative">
      <Link to="/">
        <img
          src="https://connectapp.fra1.digitaloceanspaces.com/uploads/1738845376665_eatoes%20transparent%20logo%20dark.png"
          alt="Eatoes Logo"
          className="h-6 md:h-8 w-auto"
          loading="eager"
        />
      </Link>

      <div className="space-x-6 flex items-center justify-center relative">
        <Link to="/cart">
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
        </Link>
        <Link to="/history">
          <History className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
};
