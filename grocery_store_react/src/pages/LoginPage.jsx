import Cookies from "js-cookie";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { set_data } from "../redux/userSlice";
import { Link } from "react-router-dom";

const formModel = {
  email: "",
  password: "",
};

function LoginPage() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState(formModel);
  const navigate = useNavigate();
  function handleChange(e) {
    const newForm = { ...form };
    newForm[e.target.name] = e.target.value;
    setForm(newForm);
  }
  async function handleClick(e) {
    e.preventDefault();
    const resp = await fetch(
      import.meta.env.VITE_API_BASE_URL + "/userauth/api/login/",
      {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(form),
        withCredentials: true,
      }
    );
    if (resp.ok) {
      setForm(formModel);
      const data = await resp.json();
      Cookies.set("access", data.access);
      Cookies.set("refresh", data.refresh);
      dispatch(
        set_data({
          ...user,
          access_token: data.access,
          refresh_token: data.refresh,
        })
      );

      navigate("/");
    } else {
      console.log(await resp.json());
    }
  }
  return (
    <div className="h-full w-full flex flex-col justify-center place-items-center">
      <form className="flex flex-col border-2 border-solid border-gray-300  p-5">
        <label htmlFor="email">Email</label>
        <input
          className="border-2 border-solid border-gray-300 rounded p-2"
          name="email"
          id="email"
          onChange={handleChange}
          type="text"
          value={form.email}
        />
        <label htmlFor="password">Password</label>
        <input
          className="border-2 border-solid border-gray-300 rounded p-2"
          name="password"
          id="password"
          onChange={handleChange}
          type="text"
          value={form.password}
        />

        <p>
          Register ? <Link to="/signup">here</Link>
        </p>
        <button
          onClick={handleClick}
          className="mt-2 border-2 border-solid border-gray-300 text--800 hover:bg-gray-300 hover:text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
