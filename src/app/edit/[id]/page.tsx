import Editform from "@/components/(frontend)/update";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  console.log("Page params:", params); // Debug log
  return (
    <div>
      <Editform formId={params.id} />
    </div>
  );
};

export default Page;
