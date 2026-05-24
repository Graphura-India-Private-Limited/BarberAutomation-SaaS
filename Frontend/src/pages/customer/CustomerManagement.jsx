import React, { useState } from "react";
import {
  Users,
  Search,
  Star,
  TrendingUp,
  Crown,
  Calendar,
} from "lucide-react";

export default function CustomerManagement() {

  const [search, setSearch] = useState("");

  const customers = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      bookings: 8,
      visits: 12,
      amount: 45000,
      rating: 4.8,
      status: "VIP",
    },
    {
      id: 2,
      name: "Priya Patil",
      email: "priya@gmail.com",
      bookings: 5,
      visits: 7,
      amount: 28000,
      rating: 4.5,
      status: "Regular",
    },
    {
      id: 3,
      name: "Amit Joshi",
      email: "amit@gmail.com",
      bookings: 10,
      visits: 15,
      amount: 62000,
      rating: 5,
      status: "VIP",
    },
    {
      id: 4,
      name: "Sneha Kulkarni",
      email: "sneha@gmail.com",
      bookings: 3,
      visits: 4,
      amount: 15000,
      rating: 4.2,
      status: "Regular",
    },
  ];

  const filtered = customers.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const cardStyle =
    "bg-white rounded-3xl p-5 md:p-6 shadow hover:shadow-xl duration-300";


  return (
    <div className="min-h-screen bg-[#F8F4EF] p-4 md:p-8">

      {/* Header */}
      <div
        className="
        flex
        flex-col
        lg:flex-row
        gap-5
        lg:items-center
        lg:justify-between
        mb-10"
      >

        <div>

          <h1
            className="
            text-2xl
            md:text-4xl
            font-bold
            text-[#2E1A12]"
          >
            Customer Management
          </h1>

          <p className="text-[#8B5E3C] mt-2">
            Customer analytics & insights
          </p>

        </div>


        {/* Search */}
        <div className="relative w-full lg:w-[320px]">

          <Search
            size={18}
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400"
          />

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
            w-full
            pl-12
            pr-4
            py-3
            rounded-full
            border
            bg-white
            outline-none"
          />

        </div>

      </div>



      {/* Stats */}
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-10"
      >

        <div className={cardStyle}>
          <Users />
          <h2 className="text-2xl md:text-3xl font-bold mt-4">
            245
          </h2>
          <p>Total Customers</p>
        </div>


        <div className={cardStyle}>
          <TrendingUp />
          <h2 className="text-2xl md:text-3xl font-bold mt-4">
            52
          </h2>
          <p>Frequent Users</p>
        </div>


        <div className={cardStyle}>
          <Crown />
          <h2 className="text-2xl md:text-3xl font-bold mt-4">
            18
          </h2>
          <p>VIP Customers</p>
        </div>


        <div className={cardStyle}>
          <Star />
          <h2 className="text-2xl md:text-3xl font-bold mt-4">
            4.8
          </h2>
          <p>Reviews</p>
        </div>

      </div>



      {/* Customer Cards */}
      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6"
      >

        {filtered.map((customer) => (

          <div
            key={customer.id}
            className="
            bg-white
            rounded-3xl
            p-5 md:p-6
            shadow
            hover:-translate-y-1
            hover:shadow-xl
            duration-300"
          >

            {/* Top */}
            <div
              className="
              flex
              flex-col
              sm:flex-row
              gap-4
              sm:justify-between"
            >

              <div className="flex gap-4">

                <div
                  className="
                  w-12 h-12 md:w-14 md:h-14
                  rounded-full
                  bg-[#2E1A12]
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold"
                >
                  {customer.name.charAt(0)}
                </div>


                <div className="min-w-0">

                  <h2 className="font-bold text-lg">
                    {customer.name}
                  </h2>

                  <p
                    className="
                    text-sm
                    text-gray-500
                    truncate"
                  >
                    {customer.email}
                  </p>

                </div>

              </div>



              <span
                className={`
                inline-flex
                items-center
                justify-center
                self-start
                min-w-[90px]
                h-10
                px-4
                rounded-full
                text-sm
                font-semibold
                border
                ${
                  customer.status === "VIP"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : "bg-blue-100 text-blue-700 border-blue-200"
                }
              `}
              >
                {customer.status}
              </span>

            </div>



            {/* Info */}
            <div className="grid grid-cols-3 mt-8 gap-4">

              <div>
                <p className="text-sm text-gray-400">
                  Bookings
                </p>
                <h3 className="font-bold">
                  {customer.bookings}
                </h3>
              </div>


              <div>
                <p className="text-sm text-gray-400">
                  Visits
                </p>
                <h3 className="font-bold">
                  {customer.visits}
                </h3>
              </div>


              <div>
                <p className="text-sm text-gray-400">
                  Rating
                </p>
                <h3 className="font-bold">
                  {customer.rating}
                </h3>
              </div>

            </div>



            {/* Progress */}
            <div className="mt-8">

              <div className="flex justify-between mb-2">

                <p>Total Spending</p>

                <p className="font-bold">
                  ₹{customer.amount}
                </p>

              </div>


              <div className="h-3 rounded-full bg-gray-200">

                <div
                  className="
                  h-3
                  rounded-full
                  bg-[#2E1A12]"
                  style={{
                    width: `${customer.amount / 700}%`,
                  }}
                />

              </div>

            </div>

          </div>

        ))}

      </div>



      {/* Insights */}
      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-8
        mt-12"
      >

        <div className={cardStyle}>

          <div className="flex gap-3 mb-5">
            <Calendar />
            <h2 className="font-bold">
              Frequent Customers
            </h2>
          </div>

          {customers
            .filter((x) => x.visits > 8)
            .map((x) => (

              <div
                key={x.id}
                className="
                flex
                justify-between
                py-3"
              >
                <p>{x.name}</p>
                <p>{x.visits} visits</p>
              </div>

            ))}

        </div>



        <div className={cardStyle}>

          <div className="flex gap-3 mb-5">
            <Crown />
            <h2 className="font-bold">
              High Value Users
            </h2>
          </div>

          {customers
            .filter((x) => x.status === "VIP")
            .map((x) => (

              <div
                key={x.id}
                className="
                flex
                justify-between
                py-3"
              >
                <p>{x.name}</p>
                <p>₹{x.amount}</p>
              </div>

            ))}

        </div>

      </div>

    </div>
  );
}