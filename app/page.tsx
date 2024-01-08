"use client";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Tiptap from "@/components/Tiptap";
import * as z from "zod";
import { Button } from "@/components/ui/button";

export default function Home() {
  const formSchema = z.object({
    title: z
      .string()
      .min(5, { message: "Title needs to be at least five characters." })
      .max(100, { message: "Title too long" }),
    price: z.number().min(5, { message: "More numbers needed" }),
    description: z
      .string()
      .min(5, { message: "Title needs to be at least five characters." })
      .max(100, { message: "Description too long" })
      .trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      price: 9.99,
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    values.title;
  }

  return (
    <main className="p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Main title for your product" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Tiptap description={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="my-4" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}
