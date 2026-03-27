"use client"

import { useId, useState } from "react"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type MultiComboboxOption = {
  value: string
  label: string
  keywords?: string[]
}

type MultiComboboxProps = {
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  options: MultiComboboxOption[]
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
  triggerClassName?: string
}

const MultiCombobox = ({
  label,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  options,
  value,
  onChange,
  disabled = false,
  triggerClassName,
}: MultiComboboxProps) => {
  const id = useId()
  const [open, setOpen] = useState(false)

  const toggleSelection = (val: string) => {
    onChange(
      value.includes(val) ? value.filter((v) => v !== val) : [...value, val],
    )
  }

  const removeSelection = (val: string) => {
    onChange(value.filter((v) => v !== val))
  }
  return (
    <div className="w-full space-y-2">
      {label && (
        <Label
          htmlFor={id}
          className="font-baloo2 font-bold text-darkBrown"
        >
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={
              triggerClassName ??
              "h-auto min-h-8 w-full justify-between hover:!bg-transparent"
            }
          >
            <div className="flex flex-wrap items-center gap-1 pr-2.5">
              {value.length > 0 ? (
                value.map((val) => {
                  const option = options.find((o) => o.value === val)
                  if (!option) return null

                  return (
                    <Badge key={val} variant="outline" className="rounded-sm">
                      {option.label}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-4"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeSelection(val)
                        }}
                        asChild
                      >
                        <span>
                          <XIcon className="size-3" />
                        </span>
                      </Button>
                    </Badge>
                  )
                })
              ) : (
                <span className="text-brown/50">{placeholder}</span>
              )}
            </div>

            <ChevronsUpDownIcon
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="z-[10050] w-(--radix-popper-anchor-width) p-0 pointer-events-auto">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>No result found.</CommandEmpty>

              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={option.keywords ?? [option.label]}
                    onSelect={() => {
                      toggleSelection(option.value)
                      setOpen(true)
                    }}
                    className="flex w-full cursor-pointer items-center gap-2"
                  >
                    <span className="truncate">{option.label}</span>
                    {value.includes(option.value) ? (
                      <CheckIcon size={16} className="ml-auto shrink-0" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default MultiCombobox
