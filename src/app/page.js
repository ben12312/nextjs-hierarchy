"use client";
import Sidebar from "@/components/sideBar";
import React, { useState, useEffect, createContext, useContext } from "react";
import fetchData from "@/fetch/fetch";
import Modal from "../components/modal";
import { findInNestedArray } from "@/helper/function";
import MyContext from '../helper/context';
import ConfirmModal from "@/components/confirm";
const DataContext = createContext();

const TreeNode = ({ menu }) => {
  const [expanded, setExpanded] = React.useState(false);
  const {menus, setMenus} = useContext(DataContext);
  const {selectedMenu, setSelectedMenu} = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { fetchPosts } = useContext(MyContext);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);
  const handleConfirm = async () => {
    if (selectedMenu.children.length > 0) return alert('Can not delete parent, remove child first!');
    try {
      const res = await fetchData(`/menu/${selectedMenu.id}`, "DELETE");
      if (res.status == 200) await fetchPosts();
    } catch (error) {
      console.log(error);
    }
    alert('You confirmed!');
    closeConfirmModal();
  };

  function handleClick() {
    setExpanded(!expanded)
    if (!menu.depth) menu.depth = '';
    menu.parent = getParent(menu);
    setSelectedMenu(menu)
  }

  function getParent(obj) {
    let slugArray = obj.slug.split(":");
    let meIndex = slugArray.indexOf(`${obj.id}`);
    let previousData = meIndex > 0 ? slugArray[meIndex - 1] : "-";
    if (previousData !== "-") return findInNestedArray(menus ,previousData);
    return previousData
  }

  function createMenu() {
    openModal()
  }

  function deleteMenu() {
    openConfirmModal()
  }

  return (
    <div style={{ marginLeft: "20px" }}>
      <div onClick={handleClick} style={{ cursor: "pointer" }} className="flex space-x-4">
        {menu.children && menu.children.length > 0 && (
          <span>{expanded ? "▼" : "▶"} </span>
        )}
        <div>{menu.name}</div>
        <div>
          <button onClick={() => createMenu(menu)} className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center opacity-10 hover:opacity-100 transition-opacity duration-300">+</button>
        </div>
        <button onClick={() => deleteMenu(menu)} className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-10 hover:opacity-100 transition-opacity duration-300">-</button>
      </div>
      {expanded && menu.children && (
        <div>
          {menu.children.map((child, index) => (
            <TreeNode key={index} menu={child} />
          ))}
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} menu={menu}/>
      <ConfirmModal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} onConfirm={handleConfirm}></ConfirmModal>
    </div>
  );
};

const Home = () => {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState({
    id: '',
    name: '',
    depth: '',
    parent: '',
    slug: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  function handleDataFromChild(data) {
    setSelectedMenu(data);
  }

  async function fetchPosts() {
    try {
      const res = await fetchData("/menu", "GET");
      const data = await res.json();
      generateChild(data);
    } catch (error) {
      console.log(error);
    }
  }

  function generateChild(data) {
    const menuMap = {};
    const rootMenus = [];

    data.forEach((item) => {
      menuMap[item.id] = { ...item, children: [] };
    });

    data.forEach((item) => {
      const levels = item.slug.split(":");
      if (levels.length > 1) {
        const parentId = parseInt(levels[levels.length - 2]);
        const parent = menuMap[parentId];
        if (parent) parent.children.push(menuMap[item.id]);
      } else {
        rootMenus.push(menuMap[item.id]);
      }
    });
    setMenus(rootMenus);
    return rootMenus;
  }

  const handleChange = (e) => {    
    const { name, value } = e.target;    
    setSelectedMenu((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function updateMenu() {
    try {
      const res = await fetchData(`/menu/${selectedMenu.id}`, "PATCH", { name: selectedMenu.name });
      if (res.status == 200) await fetchPosts();
    } catch (error) {
      console.log(error);
    }
  }

  if (menus.length == 0) return <div>Loading...</div>
  return (
    <DataContext.Provider value={{ selectedMenu, setSelectedMenu, menus, setMenus }}>
      <MyContext.Provider value={{ fetchPosts }}>
      <div style={{ display: "flex" }}>
        <Sidebar />
      
          <div className="container pt-10 pl-5">
            <div className="left" style={{ flex: 1, padding: "20px" }}>
              <div className="flex items-center space-x-2 pb-5">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full">
                  <span className="text-xl">&#10003;</span>
                </div>
                <span className="text-blue-500 font-medium text-2xl">Menus</span>
              </div>

            <form class="max-w-sm pb-5">
              <label for="countries" class="">Menu</label>
              <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {
                  menus.filter(el => el.slug.split(':').length == 1).map((menu, index) => (
                    <option key={index} value={menu.id}>{menu.name}</option>
                  ))
                }
              </select>
            </form>

            {menus.map((menu, index) => (
              <TreeNode key={index} menu={menu} selectedMenu={handleDataFromChild}/>
            ))}
          </div>

          <div className="right" style={{ flex: 1, padding: "20px" }}>
            <form className="max-w-sm mx-auto pt-20">
              <div className="mb-5">
                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Menu ID</label>
                <input type="text" id="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="21d1316e3e1y1ne81y8713"
                  value={selectedMenu.id}
                  name="id"
                  disabled
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Depth</label>
                <input type="text" id="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={selectedMenu.slug.split(':').length - 1}
                  onChange={handleChange}
                  name="depth"
                  disabled
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Parent Data</label>
                <input type="text" id="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={selectedMenu.parent}
                  onChange={handleChange}
                  name="parent"
                  disabled
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Name</label>
                <input type="text" id="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={selectedMenu.name}
                  onChange={handleChange}
                  name="name"
                  required
                />
              </div>

              {
                selectedMenu.id && 
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={updateMenu}
                >
                  Save
                </button>
              }

            </form>
          </div>
        </div>

      </div>
      </MyContext.Provider>
    </DataContext.Provider>
  );
};

export default Home;