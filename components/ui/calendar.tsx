"use client"

import * as React from "react"
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react"
import {
    DayPicker,
    getDefaultClassNames,
    type DayButton,
    type DayProps,
    type DayPickerProps, // Import DayPickerProps
    type SelectSingleEventHandler, // Import the specific handler type
} from "react-day-picker"
import { startOfDay, format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

// Define Goal type (copied from goals-management.tsx, ideally would be in a shared types file)
interface Goal {
    id: string; // Changed to string for UUID from Supabase
    user_id: string; // Added user_id
    created_at: string; // Added created_at
    name: string;
    description: string;
    recurrence: 'daily' | 'weekly' | 'monthly' | 'once';
    days_of_week?: number[]; // Column name changed to match DB convention
    target_value?: number; // Column name changed to match DB convention
    progress: { date: string, value?: number, completed: boolean }[];
}

// Base props for the Calendar component, including custom ones
type CalendarBaseProps = {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"];
    goalsByDate?: Record<string, Goal[]>;
    className?: string; // Add className as it's often passed to the wrapper
};

// Define CalendarProps using conditional types for `onSelect`
type CalendarProps = CalendarBaseProps & (
    | ({ mode: 'single'; selected?: Date; onSelect?: SelectSingleEventHandler } & DayPickerProps)
    | ({ mode: 'multiple' | 'range' | undefined } & DayPickerProps)
    | (DayPickerProps & { mode?: undefined }) // Handles default mode and no mode specified
);


function Calendar(props: CalendarProps) {
    const {
        className,
        classNames,
        showOutsideDays = true,
        captionLayout = "label",
        buttonVariant = "ghost",
        formatters,
        components,
        goalsByDate,
        ...rest
    } = props
    const defaultClassNames = getDefaultClassNames()

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn(
                "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
                String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
                String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
                className
            )}
            captionLayout={captionLayout}
            formatters={{
                formatMonthDropdown: (date) =>
                    date.toLocaleString("default", { month: "short" }),
                ...formatters,
            }}
            classNames={{
                root: cn("w-full", defaultClassNames.root),
                months: cn(
                    "flex gap-4 flex-col md:flex-row relative",
                    defaultClassNames.months
                ),
                month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
                nav: cn(
                    "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
                    defaultClassNames.nav
                ),
                button_previous: cn(
                    buttonVariants({ variant: buttonVariant }),
                    "[size:var(--cell-size)] aria-disabled:opacity-50 p-0 select-none",
                    defaultClassNames.button_previous
                ),
                button_next: cn(
                    buttonVariants({ variant: buttonVariant }),
                    "[size:var(--cell-size)] aria-disabled:opacity-50 p-0 select-none",
                    defaultClassNames.button_next
                ),
                month_caption: cn(
                    "flex items-center justify-center [height:var(--cell-size)] w-full [padding-left:var(--cell-size)] [padding-right:var(--cell-size)]",
                    defaultClassNames.month_caption
                ),
                dropdowns: cn(
                    "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
                    defaultClassNames.dropdowns
                ),
                dropdown_root: cn(
                    "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
                    defaultClassNames.dropdown_root
                ),
                dropdown: cn(
                    "absolute bg-popover inset-0 opacity-0",
                    defaultClassNames.dropdown
                ),
                caption_label: cn(
                    "select-none font-medium",
                    captionLayout === "label"
                        ? "text-sm"
                        : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
                    defaultClassNames.caption_label
                ),
                table: "w-full border-collapse",
                weekdays: cn("flex", defaultClassNames.weekdays),
                weekday: cn(
                    "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
                    defaultClassNames.weekday
                ),
                week: cn("flex w-full mt-2", defaultClassNames.week),
                week_number_header: cn(
                    "select-none w-(--cell-size)",
                    defaultClassNames.week_number_header
                ),
                week_number: cn(
                    "text-[0.8rem] select-none text-muted-foreground",
                    defaultClassNames.week_number
                ),
                day: cn(
                    "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
                    props.showWeekNumber
                        ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
                        : "[&:first-child[data-selected=true]_button]:rounded-l-md",
                    defaultClassNames.day
                ),
                range_start: cn(
                    "rounded-l-md bg-accent",
                    defaultClassNames.range_start
                ),
                range_middle: cn("rounded-none", defaultClassNames.range_middle),
                range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
                today: cn(
                    "bg-primary text-primary-foreground rounded-md data-[selected=true]:rounded-none",
                    defaultClassNames.today
                ),
                outside: cn(
                    "text-muted-foreground aria-selected:text-muted-foreground",
                    defaultClassNames.outside
                ),
                disabled: cn(
                    "text-muted-foreground opacity-50",
                    defaultClassNames.disabled
                ),
                hidden: cn("invisible", defaultClassNames.hidden),
                ...classNames,
            }}
            components={{
                Root: ({ className, rootRef, ...props }) => {
                    return (
                        <div
                            data-slot="calendar"
                            ref={rootRef}
                            className={cn(className)}
                            {...props}
                        />
                    )
                },
                Chevron: ({ className, orientation, ...props }) => {
                    if (orientation === "left") {
                        return (
                            <ChevronLeftIcon className={cn("size-4", className)} {...props} />
                        )
                    }

                    if (orientation === "right") {
                        return (
                            <ChevronRightIcon
                                className={cn("size-4", className)}
                                {...props}
                            />
                        )
                    }

                    return (
                        <ChevronDownIcon className={cn("size-4", className)} {...props} />
                    )
                },
                Day: (dayProps) => (
                    <CustomDay
                        {...dayProps}
                        goalsByDate={goalsByDate}
                    />
                ),
                WeekNumber: ({ children, ...props }) => {
                    return (
                        <td {...props}>
                            <div className="flex size-(--cell-size) items-center justify-center text-center">
                                {children}
                            </div>
                        </td>
                    )
                },
                ...components,
            }}
            disabled={{ before: startOfDay(new Date()) }} // Desabilita datas passadas, mas permite a seleção do dia atual
            {...rest}
        />
    )
}

interface CustomDayProps extends DayProps {
    goalsByDate?: Record<string, Goal[]>;
}

function CustomDay(props: CustomDayProps) {
    const { goalsByDate, day, modifiers } = props;
    const date = day.date;
    const dayString = format(date, 'yyyy-MM-dd');
    const dayGoals = goalsByDate?.[dayString] || [];
    const hasGoals = dayGoals.length > 0;
    const isToday = modifiers.today;

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full">
            <span className="text-sm">{format(date, 'd')}</span>
            {hasGoals && (
                <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-1">
                    {dayGoals.map(goal => (
                        <div key={goal.id} className="size-1.5 rounded-full bg-primary" title={goal.name}></div>
                    ))}
                </div>
            )}
            {isToday && (
                <div className="absolute bottom-0.5 left-0.5 size-1.5 rounded-full bg-red-500"></div> // A small red dot for today
            )}
        </div>
    );
}
// Removed CalendarDayButton as it's no longer needed
// The DayPicker's default Day button will be used, and CustomDayContent will be its content.
export { Calendar } // Export only Calendar
