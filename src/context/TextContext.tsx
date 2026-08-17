"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const TextContext = createContext<any>(null);

export function TextProvider({ children }: { children: React.ReactNode }) {
  const [textData, setTextData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/beranda/text')
      .then(res => res.json())
      .then(data => setTextData(data))
      .catch(console.error);
  }, []);

  return (
    <TextContext.Provider value={textData}>
      {children}
    </TextContext.Provider>
  );
}

export function useTextData() {
  return useContext(TextContext);
}
