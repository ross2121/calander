"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "../atoms/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Edit2, Trash } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface Product {
  id: string;
  title: string;
  text: string;
  date: string;
  time: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const router = useRouter();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ getall: Product[] }>("/api/getall");
      if (response.data.getall.length === 0) {
        setError("No products available.");
      } else {
        setProducts(response.data.getall); 
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching products:", error.message);
        setError(error.response?.data.message || error.message || "Failed to fetch product data.");
      } else {
        console.error("Unknown error fetching products:", error);
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
        await axios.delete(`/api/delete?date=${selectedProduct.date}`);
      setProducts(products.filter((product) => product.id !== selectedProduct.id));
      toast("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product", error);
      toast.error("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const isDeleteEnabled = selectedProduct && inputValue === selectedProduct.title;

  if (loading) {
    return (
      <Table>
        <TableCaption className="mt-16">List of Products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sl.no</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              {Array.from({ length: 6 }).map((__, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-6 w-full rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold flex justify-center my-9">List of Events</h2>
      <div className="mb-4 w-1/2">
        <Input
          type="text"
          placeholder="Search by Event Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
    
      <Table>
        <TableCaption className="mt-16">List of Products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sl.no</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-semibold">
                {/* <Link href={`/manager/chart/${product.id}`}> */}
                  {product.title}
                {/* </Link> */}
              </TableCell>
              <TableCell>{product.text}</TableCell>
              <TableCell>{product.date}</TableCell>
              <TableCell>{product.time}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => router.push(`/edit/${product.id}`)}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        onClick={() => setSelectedProduct(product)}
                        className="cursor-pointer text-red-500 hover:underline"
                      >
                        <Trash className="w-5 h-5" />
                      </div>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>
                          Are you sure you want to delete the event {product.title}?
                        </DrawerTitle>
                        <DrawerDescription>
                          This action cannot be undone.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="my-4">
                        <input
                          type="text"
                          placeholder="Type product name to confirm"
                          value={inputValue}
                          onChange={handleInputChange}
                          className="border p-2 w-full"
                        />
                      </div>
                      <DrawerFooter>
                        <Button
                          variant="destructive"
                          disabled={!isDeleteEnabled}
                          onClick={deleteProduct}
                          className="w-36"
                        >
                          {loading ? "Deleting..." : "Delete Product"}
                          <Trash />
                        </Button>
                        <DrawerClose asChild>
                          <Button variant="outline" className="w-28">
                            Cancel
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ToastContainer />
    </div>
  );
};

export default ProductList;
