import { useFormContext, Controller } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button, Group, Input, NumberField } from "react-aria-components";

export default function WalkingTimeInput() {
    const { control } = useFormContext();

    return (
        <Controller
            name="walkingTime"
            control={control}
            rules={{
                required: "Walking time is required",
                min: { value: 1, message: "Walking time cannot be less than 1 minute" },
                max: { value: 15, message: "Walking time cannot exceed 15 minutes" }
            }}
            render={({ field: { onChange, value } }) => (
                <NumberField
                    value={value}
                    onChange={onChange}
                    defaultValue={5}
                    minValue={1}
                    maxValue={15}
                    formatOptions={{
                        style: "unit",
                        unit: "minute",
                        unitDisplay: "short"
                    }}
                >
                    <div className="space-y-2">
                        <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 ring-offset-background transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring/30 data-[focus-within]:ring-offset-2">
                            <Input
                                className="flex-1 bg-background px-3 py-2 tabular-nums text-foreground focus:outline-none"
                            />
                            <div className="flex h-[calc(100%+2px)] flex-col">
                                <Button
                                    slot="increment"
                                    className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronUp size={12} strokeWidth={2} aria-hidden="true" />
                                </Button>
                                <Button
                                    slot="decrement"
                                    className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronDown size={12} strokeWidth={2} aria-hidden="true" />
                                </Button>
                            </div>
                        </Group>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground" role="region" aria-live="polite">
                        Time it takes to walk to your bus stop!
                    </p>
                </NumberField>
            )}
        />
    );
}