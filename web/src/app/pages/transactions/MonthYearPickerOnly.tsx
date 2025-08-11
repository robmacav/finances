import { useState } from "react"

import { CalendarIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatMonthYear(date: Date | undefined): string {
  if (!date) return ""
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()

  return `${month}/${year}`
}

type MonthYearPickerOnlyProps = {
  value: string;
  setValue: (value: string) => void;
};

function MonthYearPickerOnly({ value, setValue }: MonthYearPickerOnlyProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="grid gap-3">
      <Label htmlFor="month-year">Mês e Ano</Label>
      <div className="flex flex-col gap-3">
        <div className="relative flex gap-2">
          <Input
            id="month-year"
            name="month_year"
            value={value}
            placeholder="07/2025"
            className="bg-background pr-10"
            readOnly
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              >
                <CalendarIcon className="size-3.5" />
                <span className="sr-only">Selecionar mês e ano</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={date}
                onMonthChange={(newDate) => {
                  setDate(newDate)
                  const formatted = formatMonthYear(newDate)
                  setValue(formatted)
                  setOpen(false)
                }}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
                modifiers={{ disabled: () => true }}
                showOutsideDays={false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

export default MonthYearPickerOnly;