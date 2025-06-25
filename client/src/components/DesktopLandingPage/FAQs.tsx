import { useState } from "react";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const FAQS = [
    {
      question: "What is Schedget?",
      answer:
        "Schedgy is an all-in-one platform to organize your schedule and budget, designed for students and young professionals.",
    },
    {
      question: "Is my financial data secure?",
      answer: "No...",
    },
    {
      question: "Can I use Schedget for free?",
      answer:
        "Schedget is free for all college students although its recommended not to use the deployed version for personal use",
    },
    {
      question: "Why did I make Schedget?",
      answer:
        "I created Schedget because I needed a way to keep track of assignments more efficiently and with less clutter than Google Calendar. I also wanted a simple way to manage the income from my on-campus job. So, I built Schedget to help me manage my time and money wisely while also learning a bit of web development along the way",
    },
    {
      question: "Who can I contact for support?",
      answer:
        "I am no longer updating this app, but if you have any bugs, reach out to me at tejassraman@gmail.com",
    },
  ];

  return (
    <section className="w-full bg-[#EED2D2] py-20 px-8 flex justify-center">
      <div id="faq" className="flex w-full max-w-[980px] gap-12">
        <div className="flex-shrink-0 w-[220px] flex items-start">
          <h2 className="text-4xl font-bold font-(family-name:--font-IBMPlexMono) text-[#5C543C] mt-2">
            FAQs
          </h2>
        </div>
        <div className="flex-1 pl-22">
          <div className="w-full bg-[#EED2D2] rounded-2xl shadow-none border-none">
            {FAQS.map((faq, idx) => (
              <div key={faq.question}>
                <div className="border-t border-[#CBBABA] w-full" />
                <button
                  className="w-full flex items-center justify-between py-5 px-2 focus:outline-none text-left"
                  onClick={() => handleToggle(idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                  style={{ background: "none" }}
                >
                  <span className="font-bold text-lg text-[#5C543C] font-(family-name:--font-IBMPlexSans)">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 ml-4 transition-transform duration-200 ${
                      openIndex === idx ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="#5C543C"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === idx && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-2 pb-5 text-[#5C543C] font-(family-name:--font-IBMPlexSans) text-base animate-fadeIn"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-[#CBBABA] w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
