import {
  CommandGroup,
  CommandEmpty,
  CommandLoading,
  CommandItem,
  CommandList,
  Command,
} from "@prpr/ui/components/command";
import { Command as CommandPrimitive } from "cmdk";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Popover, PopoverContent } from "@prpr/ui/components/popover";

import { cn } from "@prpr/ui/lib/utils";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { Input } from "@prpr/ui/components/input";
import { Check } from "lucide-react";

export type Option = {
  value: string;
  label: string;
};

export type ComboboxProps = {
  options: Option[];
  option?: Option;
  shouldFilter?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  isLoading?: boolean;
  isError?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onType?: (value: string) => void;
  onSelectOption: (option: Option) => void;
  popoverClassName?: string;
};

export default function Combobox({
  options,
  option,
  shouldFilter = true,
  placeholder = "Search...",
  onSelectOption,
  onType,
  emptyMessage = "No options available",
  loadingMessage = "Loading...",
  errorMessage = "An error occurred",
  isLoading = false,
  isError = false,
  disabled = false,
  popoverClassName,
}: ComboboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option>();
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (option && option.value !== selected?.value) {
      setSelected(option);
      setInputValue(option.label);
    }
  }, [option, selected?.value]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      if (!open) {
        setOpen(true);
      }

      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options[0];

        if (optionToSelect) {
          setSelected(optionToSelect);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [open, options]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);

    if (selected && shouldFilter === false) {
      setInputValue(selected.label);
    }
  }, [selected, shouldFilter]);

  const handleFocus = useCallback(() => {
    setOpen(true);

    if (selected && shouldFilter === false) {
      setInputValue("");
    }
  }, [selected, shouldFilter]);

  const handleMouseDown = useCallback(() => {
    if (inputValue.trim() !== "") {
      setOpen(true);
    }

    if (selected && shouldFilter === false) {
      setInputValue("");
    }
  }, [inputValue, selected, shouldFilter]);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);
      setSelected(selectedOption);

      onSelectOption(selectedOption);

      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onSelectOption]
  );

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command
          className="overflow-visible bg-transparent"
          shouldFilter={shouldFilter}
          onKeyDown={handleKeyDown}
        >
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              ref={inputRef}
              onValueChange={(v) => {
                setInputValue(v);
                onType?.(v);
              }}
              onKeyDown={handleKeyDown}
              onMouseDown={handleMouseDown}
              onBlur={handleBlur}
              onFocus={handleFocus}
              disabled={disabled}
            >
              <Input
                value={inputValue}
                placeholder={placeholder}
                className="w-full"
              />
            </CommandPrimitive.Input>
          </PopoverAnchor>

          {!open && <CommandList aria-hidden="true" className="hidden" />}

          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className={cn(
              "w-[var(--radix-popper-anchor-width)] max-w-[95vw] md:max-w-[85vw] lg:max-w-[55vw] p-0 mx-2",
              popoverClassName
            )}
          >
            <CommandList>
              {!isError && !isLoading && options.length <= 0 && (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              )}

              {isError && <CommandEmpty>{errorMessage}</CommandEmpty>}

              {isLoading && <CommandLoading>{loadingMessage}</CommandLoading>}

              {!isLoading && !isError && (
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      disabled={disabled}
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onSelect={() => {
                        handleSelectOption(option);

                        // setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected?.value === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
