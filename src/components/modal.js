import { useState, useContext } from "react";
import fetchData from "@/fetch/fetch";
import MyContext from "../helper/context";

const Modal = ({ isOpen, onClose, menu }) => {
  const { fetchPosts } = useContext(MyContext);

  if (!isOpen) return null;
  const [selectedMenu, setSelectedMenu] = useState({
    name: "",
    parent: "",
    slug: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedMenu((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function createMenu() {
    try {
      const res = await fetchData(`/menu`, "POST", {
        name: selectedMenu.name,
        parent: menu.slug,
      });
      await fetchPosts();
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-4">Create Menu</h2>
        <p className="mb-4">Insert the name of the menu</p>

        <div className="right">
          <form className="max-w-sm mx-auto">
            <div className="mb-5">
              <label
                htmlFor="text"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Parent Data
              </label>
              <input
                type="text"
                id="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={menu.parent}
                onChange={handleChange}
                name="parent"
                disabled
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="text"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Name
              </label>
              <input
                type="text"
                id="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={selectedMenu.name}
                onChange={handleChange}
                name="name"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={createMenu}
              >
                Create
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
