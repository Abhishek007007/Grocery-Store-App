import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { set_data } from "../redux/userSlice";

function Navbar({ handleReload }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  function handleLogout() {
    Cookies.remove("access");
    Cookies.remove("refresh");

    dispatch(
      set_data({
        username: "",
        email: "",
        access_token: "",
        refresh_token: "",
        isLoggedIn: false,
      })
    );
    handleReload();
    navigate("/login");
  }
  return (
    <nav className="bg-gray-100 h-10 flex flex-row justify-between">
      <ul className="h-full flex flex-row text-base">
        <li className="inline-block ">
          <NavLink
            className="h-full place-content-center block hover:bg-gray-200 p-1"
            to="/"
          >
            Grocery Store
          </NavLink>
        </li>
        <li className="inline-block">
          <NavLink
            className="h-full place-content-center block hover:bg-gray-200 p-1"
            to="/contact-us"
          >
            Contact Us
          </NavLink>
        </li>
      </ul>

      <div className="flex flex-row">
        {user.username !== "" ? (
          <>
            <p>{user.username}</p>
            <button
              className="h-full place-content-center block hover:bg-gray-200 p-1"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <></>
        )}

        <button
          onClick={() => navigate("/cart-page")}
          className=" h-10 w-30 p-1 text-green-800 hover:bg-green-800 hover:text-white flex flex-row place-items-center"
        >
          <span className="">Cart</span>
          <svg
            className="h-6 w-6  fill-current"
            width="50"
            height="50"
            viewBox="0 0 48 48"
          >
            <path d="M3.5 6a1.5 1.5 0 1 0 0 3h2.756c.728 0 1.335.503 1.473 1.219l.298 1.562 3.225 16.936A6.518 6.518 0 0 0 17.639 34H36.36a6.516 6.516 0 0 0 6.387-5.283l3.225-16.936A1.5 1.5 0 0 0 44.5 10H10.74l-.064-.342A4.516 4.516 0 0 0 6.256 6H3.5zm7.813 7h31.374l-2.886 15.156A3.485 3.485 0 0 1 36.36 31H17.64a3.487 3.487 0 0 1-3.44-2.844v-.002L11.313 13zM20 36a3 3 0 0 0 0 6 3 3 0 0 0 0-6zm14 0a3 3 0 0 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
