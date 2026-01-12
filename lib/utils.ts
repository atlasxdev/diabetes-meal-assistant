import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormatMealHTMLInput = {
  meal: string;
  type: string;
  content: string; // raw AI text
};

export function formatMealResponseToHTML({ meal, type, content }: FormatMealHTMLInput): string {
  let formatted = content;

  // Convert bold titles "**Title:**" into strong labels
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert bullet points starting with "* "
  formatted = formatted.replace(/^\* (.*)$/gm, "<li>$1</li>");

  // Group list items into <ul>
  formatted = formatted.replace(
    /(<li>[\s\S]*?<\/li>)/g,
    `<ul style="padding-left:18px; margin-top:8px; margin-bottom:8px; list-style-type:disc;">
        $1
     </ul>`
  );

  // Convert line breaks into paragraphs
  formatted = formatted.replace(/\n\n/g, "</p><p>");

  // Convert separator ---
  formatted = formatted.replace(/---/g, "<hr style='margin:16px 0;'/>");

  // Wrap plain text into paragraphs
  formatted = `<p>${formatted}</p>`;

  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      
      <h2 style="margin-bottom:6px;">Your Results</h2>
      
      <p style="text-transform: capitalize;"><strong>Meal:</strong> ${meal}</p>
      <p style="text-transform: capitalize;"><strong>Type:</strong> ${type}</p>

      <div style="margin-top:12px;">
        ${formatted}
      </div>

    </div>
  `;
}
