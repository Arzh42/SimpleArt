import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  MoveLeft,
  MoveRight,
  X,
} from "lucide-react";
import { useState } from "react";

const Gallery = ({
  images,
}: {
  images: { url: string; text: string; name: string }[];
}) => {
  const [openImageIndex, setOpenImageIndex] = useState<null | number>(null);

  const list1: {
    url: string;
    text: string;
    name: string;
    mainIndex: number;
  }[] = [];
  const list2: {
    url: string;
    text: string;
    name: string;
    mainIndex: number;
  }[] = [];
  const list3: {
    url: string;
    text: string;
    name: string;
    mainIndex: number;
  }[] = [];

  images.forEach((item, index) => {
    if (index % 3 === 0) {
      list1.push({ ...item, mainIndex: index });
    } else if (index % 3 === 1) {
      list2.push({ ...item, mainIndex: index });
    } else {
      list3.push({ ...item, mainIndex: index });
    }
  });

  return (
    <div className="flex w-full max-w-screen-lg gap-2">
      <div
        className={cn(
          "bg-black/50 flex items-center justify-center  fixed top-0 w-screen h-screen left-0 z-50",
          openImageIndex !== null ? "flex" : "hidden"
        )}
      >
        {openImageIndex !== null && (
          <img
            src={images[openImageIndex].url}
            className="max-w-[90vw] max-h-[90vh]"
          />
        )}
        <Button
          size="icon"
          variant={"outline"}
          className="absolute top-2 right-2"
          onClick={() => {
            setOpenImageIndex(null);
          }}
        >
          <X />
        </Button>
        <Button
          size="icon"
          variant={"outline"}
          className="absolute top-50 left-2"
          onClick={() => {
            if (openImageIndex === null) {
              return setOpenImageIndex(0);
            }

            if (openImageIndex === 0) {
              return setOpenImageIndex(images.length - 1);
            }

            return setOpenImageIndex(openImageIndex - 1);
          }}
        >
          <ChevronLeft />
        </Button>
        <Button
          size="icon"
          variant={"outline"}
          className="absolute top-50 right-2"
          onClick={() => {
            if (openImageIndex === null) {
              return setOpenImageIndex(0);
            }

            if (openImageIndex === images.length - 1) {
              return setOpenImageIndex(0);
            }

            return setOpenImageIndex(openImageIndex + 1);
          }}
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="flex flex-col gap-2 w-1/3">
        {list1.map((item) => {
          return (
            <button
              className="group relative"
              onClick={() => {
                setOpenImageIndex(item.mainIndex);
              }}
            >
              <img
                src={item.url}
                className="transition ease-in-out duration-300 w-full group-hover:brightness-50"
              />
              <div className="transition ease-in-out duration-300 opacity-0 group-hover:opacity-100 py-4 absolute bottom-0 w-full flex flex-col items-start px-4 text-white bg-black">
                <span className="font-semibold text-lg">{item.name}</span>
                <p>{item.text}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 w-1/3">
        {list2.map((item) => {
          return (
            <button
              className="group relative"
              onClick={() => {
                setOpenImageIndex(item.mainIndex);
              }}
            >
              <img
                src={item.url}
                className="transition ease-in-out duration-300 w-full group-hover:brightness-50"
              />
              <div className="transition ease-in-out duration-300 opacity-0 group-hover:opacity-100 py-4 absolute bottom-0 w-full flex flex-col items-start px-4 text-white bg-black">
                <span className="font-semibold text-lg">{item.name}</span>
                <p>{item.text}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 w-1/3">
        {list3.map((item) => {
          return (
            <button
              className="group relative"
              onClick={() => {
                setOpenImageIndex(item.mainIndex);
              }}
            >
              <img
                src={item.url}
                className="transition ease-in-out duration-300 w-full group-hover:brightness-50"
              />
              <div className="transition ease-in-out duration-300 opacity-0 group-hover:opacity-100 py-4 absolute bottom-0 w-full flex flex-col items-start px-4 text-white bg-black">
                <span className="font-semibold text-lg">{item.name}</span>
                <p>{item.text}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
