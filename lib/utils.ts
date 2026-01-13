import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormatMealHTMLInput = {
  meal: string;
  type: string;
  content: string;
};

export function formatMealResponseToHTML({ meal, type, content }: FormatMealHTMLInput): string {
  let mainContent = content.replace(/\*\*Disclaimer:\*\*[\s\S]*$/i, "").trim();

  mainContent = mainContent.replace(/\*\*Tags:\*\*\s*([#\w\s]+)/gi, (_, tagString) => {
    const tags = tagString.split(/\s+/).filter((t: string) => t.startsWith("#"));

    return `
        <div style="margin:24px 0;">
          <strong>Tags:</strong>
          <div style="margin-top:8px;">
            ${tags
              .map(
                (t: string) => `
                <span style="
                  display:inline-block;
                  background:#e3f2fd;
                  padding:4px 12px;
                  border-radius:20px;
                  margin:4px 8px 4px 0;
                  font-size:13px;
                  font-weight:600;
                  color:#1976d2;
                  border:1px solid #bbdefb;
                ">
                  ${t.replace("#", "")}
                </span>
              `
              )
              .join("")}
          </div>
        </div>
      `;
  });

  mainContent = mainContent.replace(
    /\*\*(Meal Analysis|Improvement Ideas|Portion Tip):\*\*/gi,
    (_, title) => `
      <h4 style="
        margin:24px 0 12px;
        font-size:1.1rem;
        font-weight: 700;
        padding-bottom:6px;
      ">
        ${title}
      </h4>
    `
  );

  mainContent = mainContent.replace(
    /---/g,
    "<hr style='margin:28px 0; border:none;  border-bottom:2px solid #006045;'/>"
  );

  mainContent = mainContent.replace(/(?:^|\n)- (.+)/g, "<li>$1</li>");

  mainContent = mainContent.replace(/(<li>[\s\S]*?<\/li>)/g, `<ul style="padding-left:20px; margin:12px 0;">$1</ul>`);

  mainContent = mainContent.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  const segments = mainContent.split(/\n{2,}/);

  const formattedContent = segments
    .map((seg) => {
      const trimmed = seg.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<")) return trimmed;

      return `
        <p style="
          margin-bottom:16px;
          line-height:1.7;
        ">
          ${trimmed.replace(/\n/g, "<br/>")}
        </p>
      `;
    })
    .join("");

  return `
    <div style="line-height:1.6;">
      <div style="
        margin-bottom:24px;
        padding-bottom:16px;
        border-bottom:2px solid #006045;
      ">
        <h2 style="
          margin:0 0 12px;
          font-size:1.6rem;
          text-align:center;
        ">
          🍽️ <strong>Meal Plan Guide</strong>
        </h2>

        <p style="margin:4px 0; font-size:0.95em;">
          <strong>Meal:</strong>
          <span style="text-transform:capitalize; font-weight:600;">
            ${meal}
          </span>
        </p>

        <p style="margin:4px 0; font-size:0.95em;">
          <strong>Type:</strong>
          <span style="text-transform:capitalize; font-weight:600;">
            ${type}
          </span>
        </p>
      </div>

      <div class="content-body">
        ${formattedContent}
      </div>
    </div>
  `;
}

export function genAIPrompt({ diabetesType, meal }: { diabetesType: string; meal: string }) {
  return `
You are **Diabetes Meal Assistant**, an AI agent that helps users with diabetes make safer, balanced, and practical food choices based on their meals. 

### Persona and Tone
You are friendly, calm, and encouraging. Always use simple, non-medical language that's easy to understand. Avoid judgmental phrasing. Structure responses with short paragraphs and bullet points for readability. Keep responses under 400 words.

### User Information
- **Diabetes Type:** ${diabetesType}
- **Meal Description:** "${meal}"

### Your Task
1. **Infer meal type** (breakfast, lunch, dinner, snack) from the description.
2. Analyze the meal based on the user's diabetes type and overall nutritional balance.
3. Describe how the meal's components (carbs, protein, vegetables, fats, fiber) may affect blood sugar.
4. If balanced, explain why it works well using encouraging language.
5. If it could be improved, suggest **specific Filipino food swaps**:
   - Example: "Instead of white rice, try brown rice or half portions with sautéed ampalaya."
   - Example: "Grilled bangus or tilapia instead of fried meats."
6. Offer **plate method** portion tips: "Half vegetables, ¼ protein, ¼ carbs."
7. Add quick fiber/veggie improvement ideas.

### Filipino Food Priorities (Low-GI first)
- **Carbs:** Brown rice, kamote, oats < white rice, pandesal
- **Proteins:** Grilled bangus, tilapia, tofu < fried meats
- **Veggies:** Ampalaya, kangkong, okra, malunggay
- **Fiber:** Monggo, beans, fruits (papaya, guava)

### Meal Tags (Required)
End with: **Tags:** #mealType #ingredient1 #ingredient2 #ingredient3
- Meal types: breakfast | lunch | dinner | snack
- Ingredients: rice | fish | meat | vegetables | fruits | others

### Safety Rules
- NO medical diagnoses or medication advice
- NO product/supplement promotion
- Food advice only

### Response Structure
**Meal Analysis:** [Your short analysis here]

**Improvement Ideas:** 
- Bullet 1
- Bullet 2

**Portion Tip:** [Plate method reminder]

**Tags:** #lunch #rice #fish #vegetables

---

**Disclaimer:**
**This is general information only and not a substitute for medical advice. Please consult your doctor or dietitian for personal guidance.**
`;
}
