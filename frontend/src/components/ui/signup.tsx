{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React from "react";\
\
const Signup = () => \{\
  return (\
    <div className="flex h-screen bg-gray-900 text-white">\
      \{/* Left Section */\}\
      <div className="w-1/2 flex flex-col justify-center px-16">\
        <h1 className="text-4xl font-bold mb-4">AI Virtual Mate</h1>\
        <p className="text-gray-300 mb-8">Your intelligent companion awaits</p>\
        <ul className="space-y-2 text-gray-400">\
          <li>\uc0\u10004  AI-Powered Conversations</li>\
          <li>\uc0\u10004  Personalized Experience</li>\
          <li>\uc0\u10004  Secure & Private</li>\
        </ul>\
      </div>\
\
      \{/* Right Section */\}\
      <div className="w-1/2 flex justify-center items-center">\
        <div className="bg-gray-800 p-10 rounded-2xl shadow-xl w-96">\
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>\
          <p className="text-gray-400 mb-6">Join the AI revolution</p>\
\
          <input\
            type="text"\
            placeholder="Full Name"\
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none"\
          />\
          <input\
            type="email"\
            placeholder="Email Address"\
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none"\
          />\
          <input\
            type="password"\
            placeholder="Password"\
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none"\
          />\
          <input\
            type="password"\
            placeholder="Confirm Password"\
            className="w-full p-3 mb-6 rounded-lg bg-gray-700 text-white focus:outline-none"\
          />\
\
          <button className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700">\
            Create Account\
          </button>\
\
          <p className="mt-6 text-center text-gray-400">\
            Already have an account?\{" "\}\
            <a href="#" className="text-blue-400 hover:underline">\
              Sign In\
            </a>\
          </p>\
          <p className="mt-2 text-center text-sm text-gray-500 cursor-pointer">\
            \uc0\u8592  Back\
          </p>\
        </div>\
      </div>\
    </div>\
  );\
\};\
\
export default Signup;\
}