import React from "react";
import { Button } from "../ui/button";

const products = [
  {
    id: 1,
    name: "Premium Coffee Beans",
    price: "Rs 24.99",
    packSize: "500g",
    remainingQty: 15,
    image: "https://i.postimg.cc/2Sbvrt49/Add-a-heading-2.png",
  },
  {
    id: 2,
    name: "Organic Tea Leaves",
    price: "Rs 18.50",
    packSize: "250g",
    remainingQty: 8,
    image: "https://i.postimg.cc/sDrc2snQ/Add-a-heading.png",
  },
  {
    id: 3,
    name: "Dark Roast Blend",
    price: "Rs 32.00",
    packSize: "1kg",
    remainingQty: 23,
    image: "https://i.postimg.cc/PJmQMRq5/Add-a-heading-1.png",
  },
  {
    id: 4,
    name: "Green Tea Special",
    price: "Rs 15.75",
    packSize: "200g",
    remainingQty: 5,
    image: "https://i.postimg.cc/ZY3HZCLz/Add-a-heading-3.png",
  },
  {
    id: 5,
    name: "Espresso Blend",
    price: "Rs 28.99",
    packSize: "750g",
    remainingQty: 12,
    image: "https://i.postimg.cc/65tkgh64/Add-a-heading-8.png",
  },
  {
    id: 6,
    name: "Herbal Mix",
    price: "Rs 22.25",
    packSize: "300g",
    remainingQty: 18,
    image: "https://i.postimg.cc/v8rR0Kyd/Add-a-heading-7.png",
  },
  {
    id: 7,
    name: "Green Tea Special",
    price: "Rs 15.75",
    packSize: "200g",
    remainingQty: 5,
    image: "https://i.postimg.cc/Kjrd41fY/Add-a-heading-6.png",
  },
  {
    id: 8,
    name: "Espresso Blend",
    price: "Rs 28.99",
    packSize: "750g",
    remainingQty: 12,
    image: "https://i.postimg.cc/JnJwV6BZ/Add-a-heading-5.png",
  },
  {
    id: 9,
    name: "Herbal Mix",
    price: "Rs 22.25",
    packSize: "300g",
    remainingQty: 18,
    image: "https://i.postimg.cc/L5McHtz7/Add-a-heading-4.png",
  },
];

export default function ProductLayout() {
  return (
    <div className="">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 bg-white rounded-sm overflow-hidden "
          >
            <div className="">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 sm:p-3">
              <div className="mb-1 flex justify-between">
                <div className="w-5/7">
                  <h3 className="font-bold text-xs sm:text-sm md:text-xs lg:text-base text-gray-800 mb-1 truncate leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base font-semibold text-green-600 mb-1">
                    {product.price}
                  </p>
                </div>
                <div className="w-1/6 flex justify-end">
                  <div className="cursor-pointer w-6 h-6 bg-black text-white flex justify-center items-center rounded-xs text-xs" >+</div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-0.5">
                    {product.packSize}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Qty: {product.remainingQty}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
