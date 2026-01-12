"use client";

import { getFeedback } from "@/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, LoaderCircle, Sparkles } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

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
    }
  }, [state]);

  return (
    <div className="z-20 w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <form action={formAction} className="p-8 shadow-md border backdrop-blur-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Your Personal Diabetes Meal Assistant</h1>
          <p className="mt-4 text-lg">
            Get instant, AI-powered feedback on your food choices.
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

        <div className="mt-8 p-6 rounded-lg border-l-4 border-emerald-400 bg-emerald-50">
          <div className="flex">
            <div className="shrink-0">
              <Lightbulb className="h-6 w-6 text-emerald-600" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-black text-emerald-800">Personalized Feedback</h2>

              <div className="prose mt-2 text-base text-emerald-700">
                {state.feedback ? (
                  <div
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    dangerouslySetInnerHTML={{ __html: state.feedback }}></div>
                ) : (
                  <p>
                    [Feedback for <span className="font-semibold">{diabetesTypeMap[diabetesType]}</span> will appear
                    here. For example, how this food might impact your blood sugar and suggestions for healthier
                    alternatives.]
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SelectDiabetesType;
