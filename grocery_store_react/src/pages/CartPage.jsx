import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function TableRow({ idx, name, count, price, total_price, row, handleReload }) {
  const user = useSelector((state) => state.user);
  async function handleDelete() {
    try {
      const resp = await axios.delete(
        import.meta.env.VITE_API_BASE_URL + "/api/cart-items/" + idx,
        {
          headers: {
            Authorization: "Bearer " + user.access_token,
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      console.log(handleReload);
      handleReload();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <tr className={row}>
      <td>{name}</td>
      <td>{count}</td>
      <td>{price}</td>
      <td>{total_price}</td>
      <td>
        <button onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
}

function generate_table_rows(groceryList, handleReload) {
  let total_price = 0;
  const rows = [];
  let item_count = 0;

  if (groceryList.length) {
    for (let i = 0; i < groceryList.length; i++) {
      if (groceryList[i].count > 0) {
        total_price += groceryList[i].count * groceryList[i].price;

        rows.push(
          <TableRow
            key={i}
            idx={groceryList[i].id}
            name={groceryList[i].name}
            count={groceryList[i].count}
            price={groceryList[i].price}
            total_price={groceryList[i].count * groceryList[i].price}
            row={item_count % 2 !== 0 ? "bg-gray-500" : "bg-gray-100"}
            handleReload={handleReload}
          />
        );
        item_count += 1;
      }
    }
  }

  return [
    rows,
    Math.round((total_price + Number.EPSILON) * 100) / 100,
    item_count,
  ];
}

function CartPage() {
  const [groceryList, setGroceryList] = useState([]);
  const user = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(false);
  function handleReload() {
    setReload(!reload);
  }
  async function handleBuy() {
    try {
      const resp = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/api/buy/",
        {},
        {
          headers: {
            Authorization: "Bearer " + user.access_token,
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      setMessage(resp.data.message);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const getcartitems = async () => {
      const data = await axios.get(
        import.meta.env.VITE_API_BASE_URL + "/api/cart-items/",
        {
          headers: {
            Authorization: "Bearer " + user.access_token,
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );

      const itemlist = [];
      for (const item of data.data) {
        const resp = await axios.get(
          import.meta.env.VITE_API_BASE_URL + `/api/items/${item.item}`,
          {
            headers: {
              Authorization: "Bearer " + user.access_token,
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );
        console.log(resp);
        itemlist.push({
          id: item.item,
          name: resp.data.name,
          count: item.count,
          price: resp.data.price,
        });
      }
      setGroceryList(itemlist);
    };
    getcartitems();
  }, [message, reload]);
  const [rows, total_price, item_count] = generate_table_rows(
    groceryList,
    handleReload
  );

  return (
    <div className="h-full w-full flex flex-col justify-center place-items-center">
      <div className="w-[30%] flex flex-col justify-center place-items-center">
        <h1 className="">Bill</h1>
        <table className="table-auto w-full">
          <thead className="text-left">
            <tr className="bg-gray-500">
              <th>Item</th>
              <th>Count</th>
              <th>Price</th>
              <th>Overall Price</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {rows}
            <tr
              className={item_count % 2 !== 0 ? "bg-gray-500" : "bg-gray-100"}
            >
              <td colSpan="3">
                <strong>Total</strong>
              </td>
              <td>
                <strong>
                  <span className="rupee">&#8377;</span>
                  {total_price}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {message ? <p>{message}</p> : <></>}
      <button onClick={handleBuy} className="text-white bg-gray-950">
        Buy
      </button>
    </div>
  );
}

export default CartPage;
