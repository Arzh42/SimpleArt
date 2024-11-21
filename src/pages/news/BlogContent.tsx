import Markdown from "react-markdown";
import {
  findAssetAttribute,
  findMarkdownAttribute,
  findTextAttribute,
  getElement,
} from "@stoati/astro";
import { useEffect, useState } from "react";

const fetchData = async (
  setData: (
    data: {
      title: string;
      illustrationUrl: string;
      content: string;
    }[]
  ) => void
) => {
  const element = await getElement("blogpost");

  const blogposts = element.map((item) => {
    const asset = findAssetAttribute(item.data, "mainAsset");
    const content = findMarkdownAttribute(item.data, "content");
    const title = findTextAttribute(item.data, "title");

    return {
      title: title?.data.text ?? "",
      illustrationUrl: asset?.data.url ?? "",
      content: content?.data.markdown ?? "",
    };
  });

  if (blogposts) {
    setData(blogposts);
  }
};

const BlogContent = ({
  initialData,
}: {
  initialData: {
    title: string;
    illustrationUrl?: string;
    content: string;
  }[];
}) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (setData) {
      fetchData(setData);
    }
  }, [setData]);

  return (
    <div className="flex flex-col max-w-screen-md w-full gap-6 pt-12">
      {data.map((item) => {
        return (
          <div className="flex flex-col gap-4 border-b-2 pb-6">
            <h2 className="font-bold text-xl">{item.title}</h2>
            {item.illustrationUrl && (
              <img
                src={item.illustrationUrl}
                className="max-w-screen-md max-h-[300px] self-center"
              />
            )}
            <Markdown className="prose">{item.content}</Markdown>
          </div>
        );
      })}
    </div>
  );
};

export default BlogContent;
