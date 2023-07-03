import React from "react";

type Props = {
  name: string;
  date: boolean;
};

function Title({ name, date }: Props) {
  const today = new Date();
  return (
    <div className="mt-12 flex flex-col justify-center items-center">
      <div className="text-4xl font-semibold">{name}</div>
      {date ? (
        <div className="mt-4 italic">
          {today.getDate()}/{today.getMonth()}/{today.getFullYear()}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Title;
