"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

// ── Context ─────────────────────────────────────────────────────────────────
interface AccordionContextType {
  value: string | null
  onValueChange: (val: string) => void
  type: "single" | "multiple"
  collapsible: boolean
  multipleValues: string[]
}
const AccordionContext = React.createContext<AccordionContextType>({
  value: null,
  onValueChange: () => {},
  type: "single",
  collapsible: true,
  multipleValues: [],
})

// ── Root ─────────────────────────────────────────────────────────────────────
interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string
}
function Accordion({
  type = "single",
  collapsible = true,
  defaultValue,
  className,
  children,
  ...props
}: AccordionProps) {
  const [value, setValue] = React.useState<string | null>(defaultValue ?? null)
  const [multipleValues, setMultipleValues] = React.useState<string[]>([])

  const onValueChange = (val: string) => {
    if (type === "multiple") {
      setMultipleValues(prev =>
        prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
      )
    } else {
      setValue(prev => (prev === val && collapsible ? null : val))
    }
  }

  return (
    <AccordionContext.Provider value={{ value, onValueChange, type, collapsible, multipleValues }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

// ── Item ─────────────────────────────────────────────────────────────────────
interface AccordionItemContextType { value: string }
const AccordionItemContext = React.createContext<AccordionItemContextType>({ value: "" })

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}
function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn("border-b", className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

// ── Trigger ───────────────────────────────────────────────────────────────────
interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const { value: itemValue } = React.useContext(AccordionItemContext)
  const { value, multipleValues, type, onValueChange } = React.useContext(AccordionContext)

  const isOpen =
    type === "multiple" ? multipleValues.includes(itemValue) : value === itemValue

  return (
    <div className="flex">
      <button
        type="button"
        onClick={() => onValueChange(itemValue)}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────
interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}
function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const { value: itemValue } = React.useContext(AccordionItemContext)
  const { value, multipleValues, type } = React.useContext(AccordionContext)

  const isOpen =
    type === "multiple" ? multipleValues.includes(itemValue) : value === itemValue

  if (!isOpen) return null

  return (
    <div
      className={cn("overflow-hidden text-sm", className)}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
