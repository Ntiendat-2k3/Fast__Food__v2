"use client";

import { useContext, useState } from "react";
import { Search } from "lucide-react";
import { StoreContext } from "../context/StoreContext";
import FoodItem from "./FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  console.log(food_list)
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFoodList = food_list.filter(
    (item) =>
      (category === "All" || category === item.category) &&
      (searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  console.log(filteredFoodList)

  return (
    <div className="mt-8">
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 dark:border-dark-lighter dark:bg-dark-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      {filteredFoodList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoodList.map((item, index) => (
            <FoodItem
              key={item.name}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-dark-light rounded-2xl shadow-custom">
          <img
            src="/placeholder.svg?height=120&width=120"
            alt="Không có kết quả"
            className="mx-auto mb-4 opacity-50"
          />
          <h3 className="text-xl text-gray-500 dark:text-gray-400 mb-2">
            Không tìm thấy món ăn
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Hãy thử thay đổi tìm kiếm hoặc danh mục
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
