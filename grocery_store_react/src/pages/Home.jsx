import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ItemCard from "../components/ItemCard";
import Cookies from "js-cookie";
import axios from "axios";
import { useSelector } from "react-redux";

function Home() {
  const [groceryList, setGroceryList] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await axios.get(
          import.meta.env.VITE_API_BASE_URL + "/api/items/",
          {
            headers: {
              Authorization: "Bearer " + user.access_token,
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );

        if (data) {
          setGroceryList([...data.data]);
        }
      } catch (error) {
        navigate((to = "/login"));
      }
    };
    getData();
  }, []);

  return (
    <div className="grid grid-cols-4 p-20 gap-4">
      {groceryList.map((item, idx) => {
        return <ItemCard item={item} key={idx} idx={idx} />;
      })}
    </div>
  );
}

export default Home;
