{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React, \{ useState \} from "react";\
\
const Settings = () => \{\
  const [activeTab, setActiveTab] = useState("Personality");\
\
  const tabs = ["Personality", "Voice", "Appearance", "Advanced"];\
\
  return (\
    <div className="h-screen bg-gray-900 text-white flex flex-col">\
      <h1 className="text-3xl font-bold p-6">AI Configuration Center</h1>\
      <p className="px-6 text-gray-400 mb-4">\
        Customize your AI companion\'92s personality and behavior\
      </p>\
\
      \{/* Tabs */\}\
      <div className="flex space-x-6 border-b border-gray-700 px-6">\
        \{tabs.map((tab) => (\
          <button\
            key=\{tab\}\
            onClick=\{() => setActiveTab(tab)\}\
            className=\{`pb-3 $\{\
              activeTab === tab\
                ? "border-b-2 border-blue-500 text-blue-400"\
                : "text-gray-400 hover:text-white"\
            \}`\}\
          >\
            \{tab\}\
          </button>\
        ))\}\
      </div>\
\
      \{/* Content */\}\
      <div className="flex flex-1 p-6 space-x-10">\
        \{/* Left Panel */\}\
        <div className="flex-1">\
          \{activeTab === "Personality" && (\
            <div>\
              <h2 className="text-xl font-bold mb-4">Personality Traits</h2>\
              \{["Creativity", "Empathy", "Intelligence", "Energy", "Humor"].map(\
                (trait, i) => (\
                  <div key=\{i\} className="mb-4">\
                    <label className="block mb-1">\{trait\}</label>\
                    <input\
                      type="range"\
                      defaultValue=\{70\}\
                      className="w-full accent-blue-500"\
                    />\
                  </div>\
                )\
              )\}\
            </div>\
          )\}\
\
          \{activeTab === "Voice" && (\
            <div>\
              <h2 className="text-xl font-bold mb-4">Voice Settings</h2>\
              <select className="w-full p-3 mb-4 rounded-lg bg-gray-700">\
                <option>Friendly (Warm & Approachable)</option>\
                <option>Professional</option>\
                <option>Casual</option>\
              </select>\
              <select className="w-full p-3 rounded-lg bg-gray-700">\
                <option>US English</option>\
                <option>British English</option>\
                <option>Hindi</option>\
              </select>\
            </div>\
          )\}\
\
          \{activeTab === "Appearance" && (\
            <div>\
              <h2 className="text-xl font-bold mb-4">Theme & Appearance</h2>\
              <label className="flex items-center mb-4 space-x-3">\
                <input type="checkbox" defaultChecked /> <span>Dark Mode</span>\
              </label>\
              <label className="flex items-center mb-4 space-x-3">\
                <input type="checkbox" /> <span>Animations</span>\
              </label>\
              <label className="flex items-center space-x-3">\
                <input type="checkbox" defaultChecked /> <span>Particle Effects</span>\
              </label>\
            </div>\
          )\}\
\
          \{activeTab === "Advanced" && (\
            <div>\
              <h2 className="text-xl font-bold mb-4">Advanced Settings</h2>\
              <label className="flex items-center mb-4 space-x-3">\
                <input type="checkbox" defaultChecked /> <span>Push Notifications</span>\
              </label>\
              <label className="flex items-center mb-4 space-x-3">\
                <input type="checkbox" defaultChecked /> <span>Learning Mode</span>\
              </label>\
              <label className="flex items-center mb-4 space-x-3">\
                <input type="checkbox" defaultChecked /> <span>Context Memory</span>\
              </label>\
              <label className="flex items-center space-x-3">\
                <input type="checkbox" /> <span>Privacy Mode</span>\
              </label>\
            </div>\
          )\}\
        </div>\
\
        \{/* Right Panel */\}\
        <div className="w-1/3 bg-gray-800 p-6 rounded-xl shadow-lg">\
          <h3 className="text-lg font-bold mb-2">Live Preview</h3>\
          <div className="flex items-center space-x-4">\
            <div className="w-16 h-16 bg-blue-500 rounded-full"></div>\
            <div>\
              <p className="font-semibold">Friendly Voice</p>\
              <button className="mt-2 bg-blue-600 px-4 py-1 rounded-lg hover:bg-blue-700">\
                \uc0\u9654  Play\
              </button>\
            </div>\
          </div>\
        </div>\
      </div>\
\
      \{/* Bottom Buttons */\}\
      <div className="flex space-x-4 p-6 border-t border-gray-700">\
        <button className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700">\
          Save Changes\
        </button>\
        <button className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600">\
          Reset to Defaults\
        </button>\
        <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">\
          Continue to Chat\
        </button>\
        <button className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600">\
          Back to Profile\
        </button>\
      </div>\
    </div>\
  );\
\};\
\
export default Settings;\
}