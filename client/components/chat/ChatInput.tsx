"use client";

import { ArrowRight, ChevronDown, Paperclip } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "motion/react";
import { MODELS } from "@/lib/constants";

interface ChatInputProps {
  onSend: (message: string, model: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const AI_MODELS = [
    { key: MODELS.GEMINI_PRO, label: "Gemini Pro", description: "Powerful & balanced" },
    { key: MODELS.GEMINI_FLASH, label: "Gemini Flash", description: "Fast & efficient" },
];

const MODEL_ICONS: Record<string, React.ReactNode> = {
    [MODELS.GEMINI_PRO]: (
        <svg
            height="1em"
            style={{ flex: "none", lineHeight: "1" }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient
                    id="gemini-gradient"
                    x1="0%"
                    x2="68.73%"
                    y1="100%"
                    y2="30.395%"
                >
                    <stop offset="0%" stopColor="#1C7DFF" />
                    <stop offset="52.021%" stopColor="#1C69FF" />
                    <stop offset="100%" stopColor="#F0DCD6" />
                </linearGradient>
            </defs>
            <path
                d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                fill="url(#gemini-gradient)"
            />
        </svg>
    ),
    [MODELS.GEMINI_FLASH]: (
        <svg
            height="1em"
            style={{ flex: "none", lineHeight: "1" }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient
                    id="gemini-gradient"
                    x1="0%"
                    x2="68.73%"
                    y1="100%"
                    y2="30.395%"
                >
                    <stop offset="0%" stopColor="#1C7DFF" />
                    <stop offset="52.021%" stopColor="#1C69FF" />
                    <stop offset="100%" stopColor="#F0DCD6" />
                </linearGradient>
            </defs>
            <path
                d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                fill="url(#gemini-gradient)"
            />
        </svg>
    ),
};

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });
    const [selectedModel, setSelectedModel] = useState<string>(MODELS.GEMINI_PRO);

    const getModelLabel = (modelKey: string) => {
        return AI_MODELS.find((m) => m.key === modelKey)?.label || modelKey;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !isLoading) {
                onSend(value.trim(), selectedModel);
                setValue("");
                adjustHeight(true);
            }
        }
    };

    const handleSend = () => {
        if (value.trim() && !isLoading) {
            onSend(value.trim(), selectedModel);
            setValue("");
            adjustHeight(true);
        }
    };

    return (
        <div className="w-full py-4 px-4">
            <div className="max-w-4xl mx-auto translate-x-8 rounded-2xl p-1.5 pt-4 bg-card border border-border shadow-sm">
                <div className="relative flex flex-col">
                    <div
                        className="overflow-y-auto"
                        style={{ maxHeight: "400px" }}
                    >
                        <Textarea
                            id="chat-input"
                            value={value}
                            placeholder={disabled ? "Offline - waiting for connection..." : "What can I do for you?"}
                            className={cn(
                                "w-full rounded-xl rounded-b-none px-4 py-3 bg-muted/50 border-none text-foreground placeholder:text-muted-foreground resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                                "min-h-[72px]"
                            )}
                            ref={textareaRef}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            disabled={isLoading || disabled}
                        />
                    </div>

                    <div className="h-14 bg-muted/50 rounded-b-xl flex items-center border-t border-border">
                        <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center gap-1 h-8 px-2 text-xs hover:bg-accent focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary"
                                        >
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={selectedModel}
                                                    initial={{
                                                        opacity: 0,
                                                        y: -5,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: 5,
                                                    }}
                                                    transition={{
                                                        duration: 0.15,
                                                    }}
                                                    className="flex items-center gap-1"
                                                >
                                                    {MODEL_ICONS[selectedModel]}
                                                    <span className="text-muted-foreground">
                                                        {getModelLabel(selectedModel)}
                                                    </span>
                                                    <ChevronDown className="w-3 h-3 opacity-60" />
                                                </motion.div>
                                            </AnimatePresence>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className={cn(
                                            "min-w-40",
                                            "border border-border",
                                            "bg-linear-to-b from-card via-card to-muted"
                                        )}
                                    >
                                        {AI_MODELS.map((model) => (
                                            <DropdownMenuItem
                                                key={model.key}
                                                onSelect={() =>
                                                    setSelectedModel(model.key)
                                                }
                                                className={cn(
                                                    "flex flex-col gap-1 cursor-pointer text-left",
                                                    selectedModel === model.key && "bg-accent"
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 shrink-0">
                                                        {MODEL_ICONS[model.key]}
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {model.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {model.description}
                                                </p>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <div className="h-4 w-px bg-border mx-0.5" />
                                <label
                                    className={cn(
                                        "rounded-lg p-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                                        "focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary"
                                    )}
                                    aria-label="Attach file"
                                >
                                    <input type="file" className="hidden" />
                                    <Paperclip className="w-4 h-4" />
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={handleSend}
                                className={cn(
                                    "rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                                    "focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                                aria-label="Send message"
                                disabled={!value.trim() || isLoading || disabled}
                            >
                                <ArrowRight
                                    className={cn(
                                        "w-4 h-4 transition-opacity duration-200",
                                        value.trim() && !isLoading && !disabled
                                            ? "opacity-100"
                                            : "opacity-40"
                                    )}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
