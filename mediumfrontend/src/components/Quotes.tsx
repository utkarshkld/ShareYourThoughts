import React from "react";

const Quotes = () => {
  return (
    <div className="bg-slate-200 h-screen flex items-center justify-center p-5">
      <div className="flex flex-col">
        <div className="text-2xl font-bold  max-w-lg mb-4">
          "The Customer service I recieved was exceptional. The support team
          went above and beyond the address of my concerns."
        </div>
        <div className="text-lg font-bold ">Jules Winnfield</div>
        <div className="text-md font-semibold text-gray-500">CEO | Acme Inc</div>
      </div>
    </div>
  );
};

export default Quotes;
