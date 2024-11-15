"use client";

import { useForm, FormProvider } from "react-hook-form";
import { SetupFormData } from "@/lib/types";
import { Button } from "../shadcn/button";
import SetWalkingTime from "../setWalkingTime";
import SelectBusStops from "../selectBusStop";
import SelectBusServices from "../selectBusServices";

export default function SetupForm() {
    const methods = useForm<SetupFormData>({
        defaultValues: {
            walkingTime: 5,
        busStop: undefined,
        busServices: [],
    },
    resolver: (values) => {
        const errors: Record<string, { type: string; message: string }> = {};

        if (!values.busStop) {
            errors.busStop = {
                type: 'required',
                message: 'Please select a bus stop'
            };
        }

        return {
            values,
            errors,
        };
    },
});

    const onSubmit = (data: SetupFormData) => {
        console.log(data);
        // Handle form submission
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-2">
                <SetWalkingTime />
                <SelectBusStops />
                <SelectBusServices />
                <Button type="submit" className="w-full text-white font-bold">
                    Catch The Bus!
                </Button>
            </form>
        </FormProvider>
    );
}