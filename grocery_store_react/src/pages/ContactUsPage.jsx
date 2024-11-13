import { useState } from "react";

const formModel = {
  name: "",
  email: "",
  phone: "",
  desc: "",
};

function ContactUsPage() {
  const [form, setForm] = useState(formModel);

  function handleChange(e) {
    const newForm = { ...form };
    newForm[e.target.name] = e.target.value;
    setForm(newForm);
  }
  async function handleClick(e) {
    e.preventDefault();
    const resp = await fetch(
      import.meta.env.VITE_API_BASE_URL + "/contactus/api/",
      {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    if (resp.ok) {
      setForm(formModel);
    } else {
      console.log(await resp.json());
    }
  }
  return (
    <div className="h-full w-full flex flex-col justify-center place-items-center">
      <form className="flex flex-col border-2 border-solid border-gray-300  p-5">
        <label htmlFor="name">Name </label>
        <input
          className="border-2 border-solid border-gray-300 rounded p-2"
          name="name"
          id="name"
          onChange={handleChange}
          type="text"
          value={form.name}
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
        <label htmlFor="phone">Phone Number</label>
        <input
          className="border-2 border-solid border-gray-300 rounded p-2"
          name="phone"
          id="phone"
          onChange={handleChange}
          type="text"
          value={form.phone}
        />
        <label htmlFor="desc"> Description</label>
        <textarea
          className="border-2 border-solid border-gray-300 rounded p-2"
          onChange={handleChange}
          name="desc"
          id="desc"
          cols="30"
          rows="5"
          value={form.desc}
        ></textarea>

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

export default ContactUsPage;
