import * as React from "react";

interface CardProps {
  img: string;
  title: string;
  author: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ img, title, author }, ref) => {
    return (
      <div className="flex flex-col" ref={ref}>
        <div className="flex flex-col items-center overflow-hidden rounded-lg bg-white pb-5 shadow-lg">
          <div className="w-full sm:h-[14rem]">
            <img
              src={img}
              width={500}
              height={500}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-5 mt-4 flex flex-col self-start">
            <h1 className="mb-2 font-bold">{title}</h1>
            <p className="text-sm">{author}</p>
          </div>
        </div>
      </div>
    );
  },
);

export default Card;
