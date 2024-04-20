"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ContactForm = {
  email: string;
  subject: string;
  body: string;
};

const ContactUs = () => {
  const [content, setContent] = React.useState<ContactForm>({
    email: "mailto:sp_msc@ichat.sp.edu.sg",
    subject: "",
    body: "",
  });

  const [url, setUrl] = React.useState(`${content.email}`);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setContent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setContent({
      ...content,
      subject: "",
      body: "",
    });
    setUrl(`${content.email}`);
  };

  const handleSubmit = () => {
    setUrl(`${content.email}?subject=${content.subject}&body=${content.body}`);
  };

  return (
    <div
      className="flex flex-col items-center justify-center space-y-8 bg-primary-blue py-8 sm:flex-row sm:items-start sm:space-x-8 sm:space-y-0"
      id="contact"
    >
      <div className="flex flex-col space-y-4 font-sansation">
        <h1 className="font-sansation-bold text-5xl text-white">CONTACT</h1>
        <h1 className="bg-white p-2 text-xl text-primary-blue">QUESTIONS?</h1>
        <h1 className="bg-white p-2 text-xl text-primary-blue">FEEDBACK?</h1>
      </div>
      <form
        className="flex w-full max-w-sm flex-col space-y-4 bg-white p-4 sm:max-w-lg"
        onSubmit={handleSubmit}
        action={url}
        method="post"
      >
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email" className="text-lg">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            className="bg-gray-300 text-xl !ring-0 !ring-offset-0"
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="subject" className="text-lg">
            Subject
          </Label>
          <Input
            onChange={handleInput}
            type="text"
            id="subject"
            name="subject"
            className="bg-gray-300 text-xl !ring-0 !ring-offset-0"
          />
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="message" className="text-lg">
            Message
          </Label>
          <Textarea
            onChange={handleInput}
            id="message"
            name="body"
            className="resize-none bg-gray-300 text-xl !ring-0 !ring-offset-0"
          />
        </div>

        <div className="flex w-full items-center justify-end space-x-2">
          <Button
            type="reset"
            variant="outline"
            className="text-lg"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            className="bg-primary-blue text-lg hover:bg-primary-blue hover:opacity-90"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
