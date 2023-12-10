import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/slices/CartSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { addItemInCart, deleteOneItemInCart } from "../../data";

const Card = ({ shoe }) => {
  const cart = useSelector((state) => state.cart);
  const img = shoe.original_picture_url.S;
  const price = shoe.retail_price_cents.N;
  const desc = shoe.story_html.S;
  const id = shoe.id.N;

  const dispatch = useDispatch();

  const add = () => {
    dispatch(addToCart(shoe));
    const itemInformation = {
      itemId: shoe.id.N,
      userId: localStorage.getItem("userId")
    }
    addItemInCart(itemInformation).then(
      () => {
        toast.success("Added to cart");
      }
    )
  };

  const remove = (itemIdx) => {
    dispatch(removeFromCart(itemIdx));
    deleteOneItemInCart({
      itemId: shoe.id.N,
      userId: localStorage.getItem("userId")
    }).then(
      () => {
        toast.error("Removed item from cart");
      }
    )
  };

  return (
    <div>
      <div className="w-[300px] h-[420px] shadow-sm rounded-2xl p-4 bg-slate-50 dark:bg-[#1f1b24] dark:hover:bg-[#121015] dark:text-white dark:outline-none dark:border-none border border-slate-100 outline outline-slate-100  hover:shadow-2xl relative">
        <div className=" flex flex-col gap-6">
          <div>
            <img
              src={img}
              width={200}
              height={200}
              alt="shoe"
              className="mx-auto"
            />
            <Link to={`/preview/${id}`}>
              <button className="absolute bg-slate-600 dark:bg-slate-800 dark:font-semibold text-white text-xs p-1 top-2 right-2 rounded-md animate-pulse">
                preview
              </button>
            </Link>
          </div>

          <p className="text-base font-medium max-h-[96px] overflow-y-hidden">
            {desc.split(" ").slice(0, 20).join(" ") + "..."}
          </p>

          <div className="flex  items-center justify-between">
            {cart.some((item) => item.id.N === shoe.id.N) ? (
              <button
                onClick={() => remove(shoe.id.N)}
                className="bg-red-400 text-white p-2 rounded-md text-sm "
              >
                Remove Item
              </button>
            ) : (
              <button
                onClick={add}
                className="bg-black dark:bg-slate-800 dark:hover:bg-black text-white p-2 rounded-md text-sm "
              >
                Add to Cart
              </button>
            )}
            <span className="text-xl font-semibold">₹ {price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
