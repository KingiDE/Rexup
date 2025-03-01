import { useEffect, useRef } from "react";

export default function useShowDocumentationPopup() {
  const documentationPopupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (documentationPopupRef.current === null) return;
    documentationPopupRef.current.style.opacity = "0";
    documentationPopupRef.current.style.display = "none";
  }, []);

  async function showDocumentation() {
    if (documentationPopupRef.current === null) return;
    documentationPopupRef.current.style.display = "block";
    await new Promise((resolve) => setTimeout(resolve, 25));
    documentationPopupRef.current.style.opacity = "1";
  }

  async function hideDocumentation() {
    if (documentationPopupRef.current === null) return;
    documentationPopupRef.current.style.opacity = "0";
    await new Promise((resolve) => setTimeout(resolve, 175));
    documentationPopupRef.current.style.display = "none";
  }

  return {
    showDocumentation,
    hideDocumentation,
    documentationPopupRef,
  };
}
