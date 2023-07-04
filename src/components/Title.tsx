import React from "react";

type Props = {
  name: string;
  date: boolean;
};

function Title({ name, date }: Props) {
  const today = new Date();
  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <div className="text-4xl font-semibold">{name}</div>
      {date ? (
        <div className="mt-4 italic">
          {today.getMonth()+1}/{today.getDate()}/{today.getFullYear()}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Title;