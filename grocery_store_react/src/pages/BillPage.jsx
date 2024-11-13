import { useState, useEffect } from "react";
import { useLocation } from "react-router";

function TableRow({ name, count, price, total_price, row }) {
  return (
    <tr className={row}>
      <td>{name}</td>
      <td>{count}</td>
      <td>{price}</td>
      <td>{total_price}</td>
    </tr>
  );
}

function generate_table_rows(itemCount, groceryList) {
  let total_price = 0;
  const rows = [];
  let item_count = 0;

  if (groceryList.length) {
    for (let i = 0; i < itemCount.length; i++) {
      if (itemCount[i] > 0) {
        total_price += itemCount[i] * groceryList[i].price;

        rows.push(
          <TableRow
            key={i}
            name={groceryList[i].name}
            count={itemCount[i]}
            price={groceryList[i].price}
            total_price={itemCount[i] * groceryList[i].price}
            row={item_count % 2 !== 0 ? "bg-gray-500" : "bg-gray-100"}
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

function BillPage() {
  const location = useLocation();
  const { itemCount } = location.state;

  const [groceryList, setGroceryList] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const data = await (
        await fetch(import.meta.env.VITE_API_BASE_URL + "/api/items/")
      ).json();
      setGroceryList(data);
    };
    getData();
  }, []);
  const [rows, total_price, item_count] = generate_table_rows(
    itemCount,
    groceryList
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
    </div>
  );
}

export default BillPage;
