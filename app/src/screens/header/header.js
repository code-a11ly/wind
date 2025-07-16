

import React from "react";

const sectionImgs = [
  '/images/Clothing_&_Fashion_img.jpg',
  '/images/Electronics_&_Technology_img.jpg',
  '/images/Home_&_Furniture_img.jpg',
  '/images/Sports_&_Outdoor_img.jpg'
]

export default function Header() {

  return (
    <div className="bg-white">


      <div className="flex flex-row items-center relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="flex flex-col items-center mx-auto max-w-xl  mt-16">
          <img
            src={sectionImgs[0]}
            alt="Dynamic example"
            className="w-32 rounded-lg shadow-lg rotate-12"
          />
          <div className="mt-16 hover:rotate-0 hover:scale-100 transition-transform duration-300 ease-in-out">
          <img
            src={sectionImgs[1]}
            alt="Dynamic example"
            className="h-32 rounded-lg shadow-lg"
          />
          </div>
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-18 lg:py-16">

          <div className="text-center">

            <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              find <p className="text-indigo-500 text-5xl">WHAT YOU NEED, WITH</p> just some<br/><p className="text-indigo-500 text-5xl">LITTLE CLICKS</p>
            </h1>
            <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
              so you have time with other things
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a href="#" className="text-sm/6 font-semibold text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mx-auto max-w-xl  mt-16">
          <img
            src={sectionImgs[2]}
            alt="Dynamic example"
            className="w-32 rounded-lg shadow-lg rotate-12"
          />
          <img
            src={sectionImgs[3]}
            alt="Dynamic example"
            className="h-32 rounded-lg shadow-lg mt-16 rotate-12"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  )
};
