import Link from "next/link";
import React, { ReactNode } from "react";

type FormProps = {
  backlink: string;
  submitFunction: (e: any) => void;
  children: ReactNode;
};

function Form({ backlink, submitFunction, children }: FormProps) {
  return (
    <div className="mx-16 my-4  rounded-lg bg-green-100 py-4">
      <Link href={backlink}>
        <button className="ml-2 rounded-full bg-red-200 px-2 py-0 hover:opacity-80">
          X
        </button>
      </Link>
      <div className="flex items-center justify-center">
        <form
          className="items-left flex flex-col space-y-4 "
          onSubmit={(e) => submitFunction(e)}
        >
          {children}
        </form>
      </div>
    </div>
  );
}

export default Form;
