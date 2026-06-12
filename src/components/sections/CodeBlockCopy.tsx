"use client";

import { useEffect } from "react";
import { Copy, Check } from "lucide-react";

export default function CodeBlockCopy() {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll("pre");

    codeBlocks.forEach((pre, index) => {
      if (pre.querySelector(".copy-btn")) return;

      pre.classList.add("relative");

      const button = document.createElement("button");
      button.className =
        "copy-btn absolute top-2 right-2 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 text-xs rounded border-2 border-border-color";
      button.innerHTML = `
        <span class="copy-text">Copy</span>
      `;

      button.onclick = async () => {
        const code = pre.querySelector("code")?.textContent || "";

        try {
          await navigator.clipboard.writeText(code);

          button.innerHTML = `
            <span class="copy-text">Copied!</span>
          `;

          setTimeout(() => {
            button.innerHTML = `
              <span class="copy-text">Copy</span>
            `;
          }, 2000);
        } catch (err) {
          console.error(err);
        }
      };

      pre.appendChild(button);
    });
  }, []);

  return null;
}