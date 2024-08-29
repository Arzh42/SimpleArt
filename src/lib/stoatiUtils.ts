import { z } from "astro/zod";

const Attribute = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  templateCode: z.string(),
  data: z.any(),
});

type Attribute = z.infer<typeof Attribute>;

export const getElement = async (elementId: string) => {
  const response = await fetch(
    `http://localhost:8000/shops/${
      import.meta.env.STOATI_ID
    }/products?productTemplateId=${elementId}&withData=true`,
    {
      headers: {
        authorization: `Bearer ${import.meta.env.STOATI_SECRET}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = await response.json();

  return z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        data: z.array(Attribute),
      })
    )
    .parse(json);
};

export const findTextAttribute = (
  data: Attribute[],
  templateAttributeCode: string,
  locale: "fr-FR" = "fr-FR"
) => {
  const found = findAttribute(data, templateAttributeCode);

  if (!found) {
    return null;
  }

  return convertToTextData(found, locale);
};

export const findMarkdownAttribute = (
  data: Attribute[],
  templateAttributeCode: string,
  locale: "fr-FR" = "fr-FR"
) => {
  const found = findAttribute(data, templateAttributeCode);

  if (!found) {
    return null;
  }

  return convertToMarkdownData(found, locale);
};

export const findAssetAttribute = (
  data: Attribute[],
  templateAttributeCode: string
) => {
  const found = findAttribute(data, templateAttributeCode);

  if (!found) {
    return null;
  }

  return convertToAssetData(found);
};

export const findAttribute = (
  data: Attribute[],
  templateAttributeCode: string
) => {
  const found = data.find(
    (item) => item.templateCode === templateAttributeCode
  );

  if (!found) {
    console.error(
      "Stoati: Attribute with code " + templateAttributeCode + " not found"
    );
    return null;
  }

  return found;
};

export const convertToTextData = (data: Attribute, locale: "fr-FR") => {
  if (data.type !== "text") {
    console.error("Stoati: Given data doesn't have the good type (text)");
    return {
      ...data,
      data: { text: "" },
    };
  }

  const parseResult = z
    .array(
      z.object({
        locale: z.string(),
        value: z.string(),
      })
    )
    .safeParse(data.data);

  if (parseResult.success) {
    const localizedValue = parseResult.data.find(
      (item) => item.locale === locale
    );
    if (localizedValue) {
      return {
        ...data,
        data: {
          text: localizedValue.value,
        },
      };
    }

    console.error("Stoati: No value have been found with this locale");
    return {
      ...data,
      data: {
        text: "",
      },
    };
  }

  console.error("Stoati: Asset data parsing failed");
  return {
    ...data,
    data: {
      text: "",
    },
  };
};

export const convertToMarkdownData = (data: Attribute, locale: "fr-FR") => {
  if (data.type !== "markdown") {
    console.error("Stoati: Given data doesn't have the good type (markdown)");
    return {
      ...data,
      data: { markdown: "" },
    };
  }

  const parseResult = z
    .array(
      z.object({
        locale: z.string(),
        value: z.string(),
      })
    )
    .safeParse(data.data);

  if (parseResult.success) {
    const localizedValue = parseResult.data.find(
      (item) => item.locale === locale
    );
    if (localizedValue) {
      return {
        ...data,
        data: {
          markdown: localizedValue.value,
        },
      };
    }

    console.error("Stoati: No value have been found with this locale");
    return {
      ...data,
      data: {
        markdown: "",
      },
    };
  }

  console.error("Stoati: Asset data parsing failed");
  return {
    ...data,
    data: {
      markdown: "",
    },
  };
};

export const convertToAssetData = (data: Attribute) => {
  if (data.type !== "asset") {
    console.error("Stoati: Given data doesn't have the good type (asset)");
    return {
      ...data,
      data: { url: "" },
    };
  }

  const parseResult = z
    .array(
      z.object({
        url: z.string(),
      })
    )
    .safeParse(data.data);

  if (parseResult.success) {
    return {
      ...data,
      data: {
        url: parseResult.data[0].url,
      },
    };
  }

  console.error("Stoati: Asset data parsing failed");
  return {
    ...data,
    data: {
      url: "",
    },
  };
};
