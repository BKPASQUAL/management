"use client";

import React, { useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import AddCartModal from "../model/AddCartModel";

interface Product {
  id: number;
  name: string;
  price: string;
  packSize: string;
  remainingQty: number;
  image: string;
}

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const categories = [
  {
    value: "coffee",
    label: "Coffee",
  },
  {
    value: "tea",
    label: "Tea",
  },
  {
    value: "organic",
    label: "Organic",
  },
  {
    value: "herbal",
    label: "Herbal",
  },
  {
    value: "premium",
    label: "Premium",
  },
];

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
    image:
      "https://i.postimg.cc/m2LZymSw/Champika-Hardware-Logo-Flat-Vector-Style-3.png",
  },
  {
    id: 10,
    name: "Herbal Mix",
    price: "Rs 22.25",
    packSize: "300g",
    remainingQty: 18,
    image:
      "https://i.postimg.cc/0jyvnmnX/Champika-Hardware-Logo-Flat-Vector-Style-1.png",
  },
];

export default function ProductLayout() {
  // Separate state for each popover to prevent conflicts
  const [frameworkOpen, setFrameworkOpen] = React.useState(false);
  const [frameworkValue, setFrameworkValue] = React.useState("");

  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [categoryValue, setCategoryValue] = React.useState("");

  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddCartOpen, setIsAddCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="w-full">
      {/* Desktop and Tablet Layout */}
      <div className="hidden sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-4 mb-4">
        <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          {/* Framework Popover */}
          <Popover open={frameworkOpen} onOpenChange={setFrameworkOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={frameworkOpen}
                className="w-full sm:w-[200px] md:w-[250px] justify-between text-sm"
              >
                <span className="truncate">
                  {frameworkValue
                    ? frameworks.find(
                        (framework) => framework.value === frameworkValue
                      )?.label
                    : "Select framework..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full sm:w-[200px] md:w-[250px] p-0">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setFrameworkValue(
                            currentValue === frameworkValue ? "" : currentValue
                          );
                          setFrameworkOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            frameworkValue === framework.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Category Popover */}
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categoryOpen}
                className="w-full sm:w-[200px] md:w-[250px] justify-between text-sm"
              >
                <span className="truncate">
                  {categoryValue
                    ? categories.find(
                        (category) => category.value === categoryValue
                      )?.label
                    : "Select category..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full sm:w-[200px] md:w-[250px] p-0">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.value}
                        value={category.value}
                        onSelect={(currentValue) => {
                          setCategoryValue(
                            currentValue === categoryValue ? "" : currentValue
                          );
                          setCategoryOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            categoryValue === category.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {category.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3 mb-4">
        <div className="w-full">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 gap-3">
          {/* Framework Popover - Mobile */}
          <Popover open={frameworkOpen} onOpenChange={setFrameworkOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={frameworkOpen}
                className="w-full justify-between text-sm"
              >
                <span className="truncate">
                  {frameworkValue
                    ? frameworks.find(
                        (framework) => framework.value === frameworkValue
                      )?.label
                    : "Select framework..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setFrameworkValue(
                            currentValue === frameworkValue ? "" : currentValue
                          );
                          setFrameworkOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            frameworkValue === framework.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Category Popover - Mobile */}
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categoryOpen}
                className="w-full justify-between text-sm"
              >
                <span className="truncate">
                  {categoryValue
                    ? categories.find(
                        (category) => category.value === categoryValue
                      )?.label
                    : "Select category..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.value}
                        value={category.value}
                        onSelect={(currentValue) => {
                          setCategoryValue(
                            currentValue === categoryValue ? "" : currentValue
                          );
                          setCategoryOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            categoryValue === category.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {category.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-xs"
          >
            <div className="">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-1 sm:p-2">
              <div className="mb-1 flex justify-between">
                <div className="w-5/7">
                  <h3 className="font-bold text-xs sm:text-sm md:text-xs lg:text-base text-gray-800  truncate leading-tight">
                    {product.name}
                  </h3>
                </div>
                <div className="w-1/6 flex justify-end">
                  <div
                    className="cursor-pointer w-6 h-6 bg-black text-white flex justify-center items-center rounded-sm text-xs hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setSelectedProduct(product); // Set the selected product
                      setIsAddCartOpen(true);
                    }}
                  >
                    +
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-0.5">
                    {/* {product.packSize} */}
                    Orange
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-500  ">
                    {product.price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddCartModal
        open={isAddCartOpen}
        onClose={() => {
          setIsAddCartOpen(false);
          setSelectedProduct(null); // Clear selected product when closing
        }}
        product={selectedProduct}
      />
    </div>
  );
}
