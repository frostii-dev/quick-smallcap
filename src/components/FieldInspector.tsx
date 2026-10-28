import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { parse as parseYaml } from "yaml";
import { getProperties } from "properties-file";

type FieldInspectorProps = {
    content: string;
    language: string;
};

type TreeNodeProps = {
    name: string;
    value: unknown;
    depth?: number;
};

const TreeNode = ({ name, value, depth = 0 }: TreeNodeProps) => {
    const [expanded, setExpanded] = useState(depth === 0);

    const isObject = value !== null && typeof value === "object";

    const entries = isObject
        ? Object.entries(value as Record<string, unknown>)
        : [];

    const isEmpty = isObject && entries.length === 0;
    const isArray = Array.isArray(value);

    const renderValue = () => {
        if (value === null) {
            return <span className="text-orange-400">null</span>;
        }

        if (typeof value === "string") {
            return <span className="text-green-400 break-all">"{value}"</span>;
        }

        if (typeof value === "number") {
            return <span className="text-purple-400">{value}</span>;
        }

        if (typeof value === "boolean") {
            return <span className="text-orange-400">{String(value)}</span>;
        }

        return <span className="text-zinc-500">Unknown value</span>;
    };

    const toggleExpanded = () => {
        if (isObject && !isEmpty) {
            setExpanded((current) => !current);
        }
    };

    return (
        <div>
            <div
                className="flex min-h-6 items-start gap-1 rounded px-1 hover:bg-zinc-800 cursor-pointer"
                style={{ paddingLeft: depth * 16 + 4 }}
                onClick={toggleExpanded}>
                {isObject && !isEmpty ? (
                    expanded ? (
                        <ChevronDown
                            size={14}
                            className="mt-1 shrink-0 text-zinc-400"
                        />
                    ) : (
                        <ChevronRight
                            size={14}
                            className="mt-1 shrink-0 text-zinc-400"
                        />
                    )
                ) : (
                    <span className="w-3.5 shrink-0" />
                )}

                <span className="text-blue-300 break-all">{name}</span>

                <span className="text-zinc-500">:</span>

                {isObject ? (
                    <span className="text-zinc-400">
                        {isArray ? "Array" : "Object"}
                        {isEmpty
                            ? isArray
                                ? " []"
                                : " {}"
                            : !expanded
                              ? ` (${entries.length})`
                              : ""}
                    </span>
                ) : (
                    renderValue()
                )}
            </div>

            {isObject && expanded && !isEmpty && (
                <div>
                    {entries.map(([key, child]) => (
                        <TreeNode
                            key={key}
                            name={isArray ? `[${key}]` : key}
                            value={child}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const FieldInspector = ({ content, language }: FieldInspectorProps) => {
    let data: unknown;

    try {
        switch (language.toLowerCase()) {
            case "json":
                data = JSON.parse(content);
                break;

            case "yaml":
            case "yml":
                data = parseYaml(content);
                break;

            case "properties":
                data = getProperties(content);
                break;

            default:
                return (
                    <div className="p-4 text-sm text-zinc-500">
                        Unsupported file format.
                    </div>
                );
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unable to parse file.";

        return (
            <div className="h-full overflow-auto p-4">
                <p className="text-sm font-medium text-red-400">
                    Invalid {language.toUpperCase()} content
                </p>

                <p className="mt-2 whitespace-pre-wrap wrap-break-word text-xs text-zinc-500">
                    {message}
                </p>
            </div>
        );
    }

    if (data === null || data === undefined || typeof data !== "object") {
        return (
            <div className="p-4 text-sm text-zinc-500">
                No fields to display.
            </div>
        );
    }

    const entries = Object.entries(data as Record<string, unknown>);

    if (entries.length === 0) {
        return (
            <div className="p-4 text-sm text-zinc-500">
                No fields to display.
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto p-2 font-mono text-sm text-zinc-200">
            {entries.map(([key, value]) => (
                <TreeNode
                    key={key}
                    name={Array.isArray(data) ? `[${key}]` : key}
                    value={value}
                />
            ))}
        </div>
    );
};

export default FieldInspector;
