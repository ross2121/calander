"use client";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "@/db/firebase";
import axios, { AxiosError } from "axios";
import { Label } from "../atoms/label";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import Image from "next/image";
import { Edit2,Trash } from "lucide-react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";


const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  text: z.string().min(1, "Text is required"),
  time: z.string().min(1, "Time is required"),
  picture: z.any().optional(), 
});
export const Form = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<{
    title: string;
    text: string;
    time: string;
    picture: string | File;
  }>({
    title: "",
    text: "",
    time: "",
    picture: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pictureUrl, setPictureUrl] = useState("");
  const [existingEvent, setExistingEvent] = useState({ title: "",
    text: "",
    time: "",
    picture: "",
    id:"",
  });
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: files && files[0] ? files[0] : value,
    }));
  };

  const handleDateSelect = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    console.log(selectedDate);
    await fetchEvents(selectedDate);
    setIsModalOpen(true);
  };

  
  const deleteForm = async () => {
    try {
      await axios.delete(`/api/delete?date=${date?.toLocaleDateString("en-IN")}`);
      toast.success("Form deleted Sucessfull");
      setExistingEvent({title: "",
        text: "",
        time: "",
        picture: "",
        id:"",});
      handleCancel();
    } catch (error) {
      console.log("Error deleting event", error);
    }
  };

  const fetchEvents = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    console.log(selectedDate);
    try {
      const response = await axios.get(`/api/event?date=${selectedDate.toLocaleDateString("en-IN")}`);
      setExistingEvent(response.data?.form || null);
      setError("");
      console.log(response.data.form.id);
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setForm({
      title: "",
      text: "",
      time: "",
      picture: "",
    });
    setExistingEvent({title: "",
      text: "",
      time: "",
      picture: "",
      id:"",});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const validation = formSchema.safeParse(form);
    if (!validation.success) {
      setError(validation.error.errors.map((err) => err.message).join(", "));
      setLoading(false);
      return;
    }

    try {
      if (form.picture && form.picture instanceof File) {
        setUploading(true);
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${form.picture.name}`);
        await uploadBytes(storageRef, form.picture);
        const downloadUrl = await getDownloadURL(storageRef);
        setPictureUrl(downloadUrl);
        form.picture = downloadUrl;
      }
      const formData = {
        title: form.title,
        date: date?.toLocaleDateString("en-IN"),
        time: form.time,
        text: form.text,
        picture: pictureUrl || form.picture,
      };
      await axios.post("/api/form", formData);
      toast.success("Form created Sucessfull");
      handleCancel();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Failed to create form");
        toast.error(error.response?.data?.message || "Failed to create form");
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-md border"
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-3/4 max-w-lg shadow-lg">
            {existingEvent ? (
             <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
             <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
               Event for {date?.toLocaleDateString("en-IN")}
             </h2>
             <p className="text-xl font-bold text-gray-700 mb-3">
               <strong>Title:</strong> {existingEvent.title}
             </p>
             <p className="text-lg text-gray-600 mb-4">
               <strong>Description:</strong> {existingEvent.text}
             </p>
             <p className="text-lg text-gray-600 mb-4">
               <strong>Time:</strong> {existingEvent.time}
             </p>
             {existingEvent.picture && (
               <div className="flex justify-center mb-6">
                 <Image
                   src={existingEvent.picture}
                   width={200}
                   height={200}
                   alt="Uploaded Picture"
                   className="rounded-lg shadow-md"
                 />
               </div>
             )}
             <div className="flex justify-between items-center mt-6">
               <Link href={`/edit/${existingEvent.id}`}>
                 <Edit2 className="w-6 h-6 text-gray-500 hover:text-green-600 transition-transform transform hover:scale-110" />
               </Link>
               <Trash
                 onClick={deleteForm}
                 className="w-6 h-6 text-gray-500 hover:text-red-600 transition-transform transform hover:scale-110"
               />
               <button
                 onClick={handleCancel}
                 className="px-6 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition"
               >
                 Close
               </button>
             </div>
           </div>
           
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold">Create Form</h1>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <Label title="Title" error={error}>
                  <Input
                    placeholder="Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                  />
                </Label>
                <Label title="Text" error={error}>
                  <Input
                    placeholder="Text"
                    name="text"
                    value={form.text}
                    onChange={handleChange}
                  />
                </Label>
                <Label title="Time" error={error}>
                  <Input
                    type="time"
                    placeholder="Time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                  />
                </Label>
                <Label title="Image" error={error}>
                  <Input
                    type="file"
                    accept="image/*"
                    name="picture"
                    onChange={handleChange}
                  />
                  {pictureUrl && (
                    <Image
                      src={pictureUrl}
                      width={100}
                      height={100}
                      alt="Uploaded Picture"
                      style={{ maxWidth: "200px" }}
                    />
                  )}
                </Label>
                <div className="flex justify-end mt-4">
                  <Button loading={loading || uploading} type="submit">
                    Submit
                  </Button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="ml-2 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
       <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
