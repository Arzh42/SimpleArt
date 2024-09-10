import { useForm, useWatch } from "react-hook-form";
import Altcha from "./Altcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "astro/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const FormSchema = z.object({
  title: z.string(),
  content: z.string(),
  challenge: z.any(),
});

export default function ContactForm() {
  const [messageSent, setMessageSent] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      challenge: null,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const response = await fetch(
      `${import.meta.env.PUBLIC_STOATI_URL}/shops/${
        import.meta.env.PUBLIC_STOATI_ID
      }/messages`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          data: "",
          type: "Contact",
        }),
      }
    );

    if (response.ok) {
      setMessageSent(true);
    }
  };

  const challenge = useWatch({ control: form.control, name: "challenge" });

  if (messageSent) {
    return (
      <div className="max-w-md w-full space-y-6 flex flex-col items-center justify-stretch">
        Merci pour ce message !!
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return form.handleSubmit(onSubmit)();
        }}
        className="max-w-md w-full space-y-6 flex flex-col items-center justify-stretch"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="challenge"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Altcha
                  onValueChange={(val) => {
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={challenge === null}>Envoyer</Button>
      </form>
    </Form>
  );
}
