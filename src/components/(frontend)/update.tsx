"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface IEditFormProps {
  formId: string;
}

const Editform = ({ formId }: IEditFormProps) => {
  const [form, setForm] = useState<{
    title: string;
    text: string;
    time: string;
  }>({
    title: "",
    text: "",
    time: "",
  });

  const router = useRouter();

  useEffect(() => {
    const  fetchform = async () => {
      try {
        const response = await axios.get(
          `https://calander-five.vercel.app/api/getbyid?id=${formId}`
        );
        console.log("Fetched data:", response.data); // Debug log
        setForm(response.data.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

  fetchform();
  }, [formId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.patch(
        `https://calander-five.vercel.app/api/update?id=${formId}`,
        form
      );
      toast("Form updated successfully");
      router.push("/");
    } catch (error) {
      console.error("Error updating Fomr:", error);
      console.log(form); 
      toast.error("Error updating Form");
    }
  };

  return (
    <div className="w-80 flex justify-center items-center mt-20 mx-auto">
      <ToastContainer position="bottom-right" autoClose={5000} />
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            name="text"
            value={form.text}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Time</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
         {/* <div>Editing Form with ID: {formId}</div>; */}
        <Button onClick={handleSubmit} variant="outline">
          Update Form
        </Button>
      </div>
    </div>
  );
};

export default Editform;
