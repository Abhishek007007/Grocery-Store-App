import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const formModel = {
  username: "",
  email: "",
  password1: "",
  password2: "",
};

function SignUpPage() {
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
      import.meta.env.VITE_API_BASE_URL + "/userauth/api/signup/",
      {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    if (resp.ok) {
      console.log(await resp.json());
      setForm(formModel);
      navigate("/login");
    } else {
      console.log(await resp.json());
    }
  }
  return (
    <div className="h-full w-full flex flex-col justify-center place-items-center">
      <form className="flex flex-col border-2 border-solid border-gray-300  p-5">
        <label htmlFor="username">Username </label>
        <input
          className="border-2 border-solid border-gray-300 rounded p-2"
          name="username"
          id="username"
          onChange={handleChange}
          type="text"
          value={form.username}
        />
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
        <label htmlFor="password_confirm">Password Confirm</label>
        <input
          className="border-2 border-solid border-gray-300 rounded p-2"
          name="password_confirm"
          id="password_confirm"
          onChange={handleChange}
          type="text"
          value={form.password_confirm}
        />
        <p>
          Login ? <Link to="/login">here</Link>
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

export default SignUpPage;
