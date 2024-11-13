import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

function ItemCard({ item }) {
  const [itemCount, setItemCount] = useState(0);
  const user = useSelector((state) => state.user);
  const range = (start, stop, step) =>
    Array.from(
      { length: Math.ceil((stop - start) / step) },
      (_, i) => start + i * step
    );

  // console.log("access " + user.access_token);
  // console.log("refresh " + user.refresh_token);
  async function handleAdd() {
    console.log(
      JSON.stringify({
        item_id: item.id,
        count: itemCount,
      })
    );
    await axios.post(
      import.meta.env.VITE_API_BASE_URL + "/api/cart-items/",
      JSON.stringify({
        item_id: item.id,
        count: itemCount,
      }),
      {
        headers: {
          Authorization: "Bearer " + user.access_token,
          "Content-Type": "application/json",
        },
      }
    );
    setItemCount(0);
  }
  return (
    <div className="h-96 border-2 border-solid border-gray-100 hover:border-gray-800  rounded p-1">
      <h2 className="text-xl text-bold">{item.name}</h2>
      <div className="h-[40%] rounded-full overflow-hidden">
        <img
          className="object-cover h-full w-full"
          src={import.meta.env.VITE_API_BASE_URL + item.image}
          alt={item.name + "Image N/A"}
        />
      </div>
      <div className="px-3">
        <p className="">
          Quantity : {item.quantity} {item.unit}
        </p>
        <p className="">Type : {item.grocery_type}</p>
        <p className="">
          Stock : <span>{item.stock} remaining</span>
        </p>
        <p className="">
          Price : <span className="">&#8377;</span>
          <i>{item.price}</i>
        </p>

        <label>
          Quantity:
          <select
            value={itemCount}
            onChange={(e) => {
              setItemCount(e.target.value);
            }}
          >
            {range(0, parseInt(item.stock) + 1, 1).map((val, idx) => {
              return (
                <option value={val} key={idx}>
                  {val}
                </option>
              );
            })}
          </select>
        </label>
      </div>
      <button
        className="mx-3 bg-gray-950 text-white rounded"
        onClick={handleAdd}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ItemCard;
