"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { BusStop } from "@/lib/types"
import useBusStopSearch from "@/hooks/useBusStopSearch"
import { useFormContext } from "react-hook-form"

import { Button } from "@/components/shadcn/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/shadcn/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/shadcn/popover"
import { Check, ChevronsUpDown } from "lucide-react"

type BusStopComboboxProps = {
    onSelect: (busStop: BusStop) => void
    value?: BusStop
    className?: string
}

export function BusStopCombobox({ onSelect, value, className }: BusStopComboboxProps) {
    const [open, setOpen] = useState(false)
    const { search, handleSearch, data: busStops, isLoading } = useBusStopSearch()
    const { formState: { errors } } = useFormContext();

    const hasError = errors.busStop;

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between relative",
                            hasError ? "border-red-500" : "",
                            className
                        )}
                        disabled={isLoading}
                    >
                        {value
                            ? `${value.Description} (${value.BusStopCode})`
                            : "Search for a bus stop..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Enter bus stop name or code..."
                            value={search}
                            onValueChange={(value) =>
                                handleSearch({ target: { value } } as React.ChangeEvent<HTMLInputElement>)
                            }
                        />
                        <CommandList>
                            <CommandEmpty className="py-2 text-center text-sm text-muted-foreground">
                                {isLoading ? "Searching..." : ""}
                            </CommandEmpty>
                            <CommandGroup>
                                {busStops.map((stop: BusStop) => (
                                    <CommandItem
                                        key={stop.BusStopCode}
                                        value={stop.BusStopCode}
                                        onSelect={() => {
                                            onSelect(stop)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value?.BusStopCode === stop.BusStopCode
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {stop.Description} ({stop.BusStopCode})
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {hasError && (
                <p className="mt-1 text-sm text-red-500">
                    {errors.busStop?.message as string}
                </p>
            )}
        </div>
    )
}