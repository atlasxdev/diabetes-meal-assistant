"use client";

import { getFeedback } from "@/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircleAlertIcon, Lightbulb, LoaderCircle, Sparkles } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const diabetesTypeMap: { [key: string]: string } = {
  "type-1": "Type 1 Diabetes",
  "type-2": "Type 2 Diabetes",
  gestational: "Gestational Diabetes",
};

const initialState = {
  errors: "",
  success: false,
  feedback: undefined,
  meal: undefined,
  diabetesType: undefined,
};

function SelectDiabetesType() {
  const [state, formAction, isPending] = useActionState(getFeedback, initialState);

  const [diabetesType, setDiabetesType] = useState<string>("type-1");

  useEffect(() => {
    if (Boolean(state.errors)) {
      toast.error(state.errors);
    }

    if (state.success) {
      toast.success("Feedback generated successfully!");
      setDiabetesType("type-1");
    }
  }, [state]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 z-20 w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <form action={formAction} className="p-8 shadow-md border backdrop-blur-3xl">
        <div className="mb-8">
          <div className="relative flex justify-center">
            <h1 className="text-3xl font-black sm:text-4xl">Your Personal Diabetes Meal Assistant</h1>
            <svg
              width="453"
              height="8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-primary absolute -bottom-2 w-max mx-auto max-sm:hidden lg:scale-x-130">
              <path
                d="M2 6.75068C53.4722 -1.10509 368.533 2.14284 451.5 6.75085"
                strokeWidth="3"
                strokeLinecap="round"></path>
            </svg>
          </div>

          <p className="mt-4 text-center text-lg">
            Get instant, <span className="text-primary font-bold">AI-powered</span> feedback on your food choices.
            <br />
            Select your diabetes type and enter a food to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
          <div className="md:col-span-1">
            <Select name="diabetes_type" onValueChange={setDiabetesType} defaultValue={diabetesType}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select Diabetes Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="type-1">Type 1 Diabetes</SelectItem>
                <SelectItem value="type-2">Type 2 Diabetes</SelectItem>
                <SelectItem value="gestational">Gestational Diabetes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Input
              name="meal"
              type="text"
              placeholder="e.g., 'A bowl of oatmeal with berries'"
              className="h-12 text-base"
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <Button disabled={isPending} size="xl" className="w-full sm:w-auto text-lg font-semibold gap-2">
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin size-5" />
                Generating feedback
              </>
            ) : (
              <>
                <Sparkles className="size-5" />
                Get Feedback
              </>
            )}
          </Button>
        </div>

        <div className="mt-8 px-0 md:p-6">
          <div className="ml-4">
            <div className="flex space-x-4">
              <Lightbulb className="h-6 w-6 text-accent" aria-hidden="true" />

              <h2 className="text-xl font-black text-accent">Personalized Feedback</h2>
            </div>
            <div className="prose mt-4 text-base text-accent">
              {state.feedback ? (
                <>
                  <div
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    dangerouslySetInnerHTML={{ __html: state.feedback }}></div>
                  <hr
                    style={{
                      margin: "28px 0",
                      border: "none",
                      borderBottom: "2px solid #006045",
                    }}
                  />
                  <ImportantReminder />
                </>
              ) : (
                <p>
                  [Feedback for <span className="font-semibold">{diabetesTypeMap[diabetesType]}</span> will appear here.
                  For example, how this food might impact your blood sugar and suggestions for healthier alternatives.]
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function ImportantReminder() {
  return (
    <Alert className="bg-primary text-primary-foreground flex justify-between border-none">
      <CircleAlertIcon />
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex-1 flex-col justify-center gap-1">
          <AlertTitle>Important Reminder</AlertTitle>
          <AlertDescription className="text-primary-foreground/80">
            This is general information only and not a substitute for medical advice. Please consult your doctor or
            dietitian for personal guidance.
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}

export default SelectDiabetesType;
