"use client";

import { useEffect } from "react";

export default function CodeBlockCopy() {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll("pre");

    codeBlocks.forEach((pre) => {
      if (pre.parentElement?.classList.contains("code-block-wrapper")) {
        return;
      }

      // Create positioning wrapper
      const wrapper = document.createElement("div");

      wrapper.className = `
        code-block-wrapper
        relative
        w-full
        min-w-0
        border-2
        border-border-color
        bg-muted
        shadow-comic-md
      `;

      // Insert wrapper before pre
      pre.parentNode?.insertBefore(wrapper, pre);

      // Move pre into wrapper
      wrapper.appendChild(pre);

      // PRE = horizontal scrolling area
      pre.className = `
        w-full
        min-w-0
        max-w-full
        overflow-x-auto
        p-4
        pr-24
        m-0
      `;

      // Create button OUTSIDE pre
      const button = document.createElement("button");

      button.type = "button";

      button.className = `
        copy-btn
        absolute
        top-2
        right-2
        z-20
        flex
        items-center
        gap-1
        bg-primary
        text-primary-foreground
        px-2
        py-1
        text-xs
        rounded
        border-2
        border-border-color
        shadow-comic-sm
      `;

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

      // Button is sibling of pre
      wrapper.appendChild(button);
    });
  }, []);

  return null;
}
