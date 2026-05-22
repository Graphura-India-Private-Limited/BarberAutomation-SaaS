import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

import {
  Search,
  Filter,
  Building2,
  Users,  
  Store,
  Plus,
} from "lucide-react";

export default function SalonManagement() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedSalon, setSelectedSalon] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [newSalon, setNewSalon] = useState({
    name: "",
    owner: "",
    city: "",
    image: "",
  });

  const [salons, setSalons] = useState([
    {
      id: 1,
      name: "Royal Fade Studio",
      owner: "Rahul Sharma",
      city: "Pune",
      status: "Active",
      bookings: 240,
      image:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Urban Barber Hub",
      owner: "Aman Verma",
      city: "Mumbai",
      status: "Inactive",
      bookings: 180,
      image:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop",
    },
  ]);

  // FILTER
  const filteredSalons = salons.filter((salon) => {
    const matchSearch =
      salon.name.toLowerCase().includes(search.toLowerCase()) ||
      salon.city.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" ? true : salon.status === filter;

    return matchSearch && matchFilter;
  });

  // STATUS UPDATE
  const updateStatus = (id, status) => {
    const updated = salons.map((salon) =>
      salon.id === id ? { ...salon, status } : salon
    );

    setSalons(updated);
  };

  // DELETE
  const deleteSalon = (id) => {
    const confirmDelete = window.confirm(
      "Delete this salon?"
    );

    if (confirmDelete) {
      setSalons(
        salons.filter((salon) => salon.id !== id)
      );
    }
  };

  // VIEW
  const viewSalon = (salon) => {
    navigate(`/admin/salon-view/${salon.id}`, {
      state: salon,
    });
  };

  // EDIT
  const editSalon = (salon) => {
    setSelectedSalon(salon);
  };

  // SAVE EDIT
  const saveSalon = () => {
    const updated = salons.map((salon) =>
      salon.id === selectedSalon.id
        ? selectedSalon
        : salon
    );

    setSalons(updated);
    setSelectedSalon(null);
  };

  // ADD SALON
  const addSalon = () => {
    if (
      !newSalon.name ||
      !newSalon.owner ||
      !newSalon.city
    ) {
      alert("Please fill all fields");
      return;
    }

    const salon = {
      id: Date.now(),
      name: newSalon.name,
      owner: newSalon.owner,
      city: newSalon.city,
      status: "Active",
      bookings: 0,
      image:
        newSalon.image ||
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
    };

    setSalons([...salons, salon]);

    setNewSalon({
      name: "",
      owner: "",
      city: "",
      image: "",
    });

    setShowAddModal(false);
  };

  return (
  <div className="flex bg-black text-white min-h-screen">
    
    {/* SIDEBAR */}
    <Sidebar />

    {/* MAIN CONTENT */}
    <div className="flex-1 lg:ml-[260px]">

      {/* HEADER */}
      <div className="border-b border-[#2d2419] bg-[#0a0a0a] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">

          <div>
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#D6B36A] uppercase leading-tight">
              Salon Management
            </h1>

            <p className="text-gray-400 mt-2">
              Manage salons, bookings & status
            </p>
          </div>

          <button
  onClick={() => setShowAddModal(true)}
  className="
  w-full sm:w-auto
  bg-gradient-to-r from-[#D6B36A] to-[#c8a457]
  hover:from-[#e0bf78] hover:to-[#d1ad61]
  text-black
  font-bold
  px-5 sm:px-6
  py-3
  rounded-2xl
  transition-all duration-300
  flex items-center justify-center gap-2
  shadow-lg shadow-[#D6B36A]/20
  hover:scale-105
  active:scale-95
  text-sm sm:text-base
  "
>
  <Plus size={20} />
  Add New Salon
</button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-[#111111] border border-[#2d2419]
        rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-400">
                Total Salons
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {salons.length}
              </h2>
            </div>

            <div className="bg-[#D6B36A]/20 p-4 rounded-2xl">
              <Store
                size={30}
                className="text-[#D6B36A]"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#2d2419]
        rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-400">
                Active Salons
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {
                  salons.filter(
                    (s) => s.status === "Active"
                  ).length
                }
              </h2>
            </div>

            <div className="bg-green-500/20 p-4 rounded-2xl">
              <Building2
                size={30}
                className="text-green-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#2d2419]
        rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-400">
                Customers
              </p>

              <h2 className="text-4xl font-bold mt-2">
                12K+
              </h2>
            </div>

            <div className="bg-[#D6B36A]/20 p-4 rounded-2xl">
              <Users
                size={30}
                className="text-[#D6B36A]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-[#111111] border border-[#2d2419]
rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-8 p-4 sm:p-6">

        <div className="grid md:grid-cols-2 gap-5">

          <div className="flex items-center bg-black
          border border-[#2d2419]
          px-4 py-4 rounded-2xl">

            <Search className="text-[#D6B36A] mr-3" />

            <input
              type="text"
              placeholder="Search salon..."
              className="bg-transparent outline-none w-full"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="flex items-center bg-black
          border border-[#2d2419]
          px-4 py-4 rounded-2xl">

            <Filter className="text-[#D6B36A] mr-3" />

            <select
              className="bg-transparent outline-none w-full"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
            >
              <option className="text-black">
                All
              </option>

              <option className="text-black">
                Active
              </option>

              <option className="text-black">
                Inactive
              </option>

              <option className="text-black">
                Rejected
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 py-10">

        {filteredSalons.map((salon) => (

          <div
            key={salon.id}
            className="bg-[#111111]
            border border-[#2d2419]
            rounded-[30px]
            overflow-hidden
            hover:scale-[1.02]
            transition duration-300"
          >

            <img
              src={salon.image}
              alt={salon.name}
              className="h-52 sm:h-60 w-full object-cover"
            />

            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center">

                <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                  {salon.name}
                </h2>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-bold
                  ${
                    salon.status === "Active"
                      ? "bg-green-500/20 text-green-400"
                      : salon.status === "Inactive"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {salon.status}
                </span>
              </div>

              <p className="text-gray-400 mt-4">
                Owner : {salon.owner}
              </p>

              <p className="text-gray-400">
                City : {salon.city}
              </p>

              <p className="text-[#D6B36A] font-semibold mt-2">
                Bookings : {salon.bookings}
              </p>

             {/* BUTTONS */}
<div className="grid grid-cols-2 gap-3 mt-6">

  <button
    onClick={() =>
      updateStatus(salon.id, "Active")
    }
    className="bg-[#1B3A2F]
    hover:bg-[#244D3E]
    py-3 rounded-xl font-semibold
    text-sm sm:text-base
    transition duration-300"
  >
    Activate
  </button>

  <button
    onClick={() =>
      updateStatus(salon.id, "Inactive")
    }
    className="bg-[#4A3A1E]
    hover:bg-[#5B4725]
    py-3 rounded-xl font-semibold
    text-sm sm:text-base
    transition duration-300"
  >
    Deactivate
  </button>

  <button
    onClick={() =>
      editSalon(salon)
    }
    className="bg-[#D6B36A]
    hover:bg-[#c8a457]
    text-black py-3 rounded-xl
    font-bold text-sm sm:text-base
    transition duration-300"
  >
    Edit
  </button>

  <button
    onClick={() =>
      viewSalon(salon)
    }
    className="bg-[#1E293B]
    hover:bg-[#334155]
    py-3 rounded-xl font-semibold
    text-sm sm:text-base
    transition duration-300"
  >
    View
  </button>


  <button
  onClick={() =>
    deleteSalon(salon.id)
  }
  className="col-span-2 mx-auto w-full sm:w-[220px]
  bg-red-700 hover:bg-red-800
  py-3 rounded-xl font-semibold
  text-sm sm:text-base
  transition duration-300
  flex items-center justify-center"
>
  Delete
</button>

</div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {selectedSalon && (
        <div className="fixed inset-0 bg-black/70
        flex items-center justify-center z-50">

          <div className="bg-[#111111]
          border border-[#2d2419]
         p-5 sm:p-8 rounded-3xl w-[90%] sm:w-[400px]">

            <h2 className="text-3xl font-bold
            text-[#D6B36A] mb-6">
              Edit Salon
            </h2>

            <input
              type="text"
              value={selectedSalon.name}
              onChange={(e) =>
                setSelectedSalon({
                  ...selectedSalon,
                  name: e.target.value,
                })
              }
              className="w-full mb-4 bg-black
              border border-[#2d2419]
            p-3 sm:p-4 rounded-xl outline-none"
            />

            <input
              type="text"
              value={selectedSalon.owner}
              onChange={(e) =>
                setSelectedSalon({
                  ...selectedSalon,
                  owner: e.target.value,
                })
              }
              className="w-full mb-4 bg-black
              border border-[#2d2419]
              p-4 rounded-xl outline-none"
            />

            <input
              type="text"
              value={selectedSalon.city}
              onChange={(e) =>
                setSelectedSalon({
                  ...selectedSalon,
                  city: e.target.value,
                })
              }
              className="w-full mb-6 bg-black
              border border-[#2d2419]
              p-4 rounded-xl outline-none"
            />

            <div className="flex gap-4">

              <button
                onClick={saveSalon}
                className="flex-1 bg-[#D6B36A]
                text-black py-3 rounded-xl font-bold"
              >
                Save
              </button>

              <button
                onClick={() =>
                  setSelectedSalon(null)
                }
                className="flex-1 bg-[#2d2419]
                py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70
        flex items-center justify-center z-50">

          <div className="bg-[#111111]
          border border-[#2d2419]
          p-8 rounded-3xl w-[400px]">

            <h2 className="text-3xl font-bold
            text-[#D6B36A] mb-6">
              Add New Salon
            </h2>

            <input
              type="text"
              placeholder="Salon Name"
              value={newSalon.name}
              onChange={(e) =>
                setNewSalon({
                  ...newSalon,
                  name: e.target.value,
                })
              }
              className="w-full mb-4 bg-black
              border border-[#2d2419]
              p-4 rounded-xl outline-none"
            />

            <input
              type="text"
              placeholder="Owner Name"
              value={newSalon.owner}
              onChange={(e) =>
                setNewSalon({
                  ...newSalon,
                  owner: e.target.value,
                })
              }
              className="w-full mb-4 bg-black
              border border-[#2d2419]
              p-4 rounded-xl outline-none"
            />

            <input
              type="text"
              placeholder="City"
              value={newSalon.city}
              onChange={(e) =>
                setNewSalon({
                  ...newSalon,
                  city: e.target.value,
                })
              }
              className="w-full mb-4 bg-black
              border border-[#2d2419]
              p-4 rounded-xl outline-none"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={newSalon.image}
              onChange={(e) =>
                setNewSalon({
                  ...newSalon,
                  image: e.target.value,
                })
              }
              className="w-full mb-6 bg-black
              border border-[#2d2419]
              p-4 rounded-xl outline-none"
            />

            <div className="flex gap-4">

              <button
                onClick={addSalon}
                className="flex-1 bg-[#D6B36A]
                text-black py-3 rounded-xl font-bold"
              >
                Add Salon
              </button>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
                className="flex-1 bg-[#2d2419]
                py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
            
          </div>
        </div>
      )}
       </div>
  </div>
  );
}