"use client"
import { menu_list } from "../assets/assets"

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() => setCategory((prev) => (prev === item.menu_name ? "All" : item.menu_name))}
              key={index}
              className="flex flex-col items-center cursor-pointer min-w-[100px]"
            >
              <div
                className={`w-20 h-20 rounded-full overflow-hidden mb-2 ${
                  category === item.menu_name
                    ? "ring-4 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-dark"
                    : "ring-2 ring-gray-200 dark:ring-gray-700"
                }`}
              >
                <img
                  src={item.menu_image || "/placeholder.svg"}
                  alt={item.menu_name}
                  className="w-full h-full object-cover transition-transform hover:scale-110"
                />
              </div>
              <p className="text-center text-sm font-medium text-dark dark:text-white">{item.menu_name}</p>
            </div>
          )
        })}
      </div>
      <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
    </div>
  )
}

export default ExploreMenu
