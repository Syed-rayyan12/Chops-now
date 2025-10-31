"use client"

import { Send } from "lucide-react"

export function Newsletter() {
  return (
    <section className=" py-32 relative">
      <img
        src="/cusine-shape-2.png"
        alt="Cuisine shape"
        className="absolute top-70 left-40 w-30 max-sm:left-0 max-md:left-0 md:left-12 max-sm:top-135 max-sm:w-30 pointer-events-none select-none  float-shape" />
      <img
        src="/changa.png"
        alt="Cuisine shape"
        className="absolute top-4 right-10 w-40 max-sm:right-0 max-sm:w-30 pointer-events-none select-none  float-shape" />

      <div className="mx-auto max-sm:px-18 max-md:px-14 md:px-12 text-center max-w-3xl">
        <div className="bg-secondary w-18 h-18 mx-auto flex justify-center items-center rounded-full mb-5">
          <Send className="text-white" />
        </div>
        <h2 className="font-fredoka-one text-5xl max-sm:text-2xl font-extrabold mb-4 leading-15">
          Get Afro-Caribbean Stories in Your Inbox
        </h2>
        <div className="bg-secondary h-1 w-24 mx-auto mt-6 mb-6"></div>
        <p className="text-[16px] font-ubuntu mb-8 px-44 max-sm:px-0">
          Join our food lovers’ circle and never miss a taste of home.
        </p>
        <div className="flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-primary/40 rounded-[10px] w-full px-4 py-2 mr-4 bg-input text-foreground"
          />
          <button className="bg-primary rounded-[10px] text-white px-6 py-3 hover:bg-primary/90 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  )
}