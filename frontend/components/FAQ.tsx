'use client';

import { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="card overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-5 text-left gap-4"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4 animate-fade-in">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
