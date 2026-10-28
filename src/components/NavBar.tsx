import { useRef } from "react";
import { Box, UploadCloud, DownloadCloud, Copy } from "lucide-react";

type NavBarProps = {
    fileName: string;
    onUpload: (file: File) => void | Promise<void>;
};

const NavBar = ({ fileName, onUpload }: NavBarProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const extensionStyles: Record<string, { label: string; color: string }> = {
        ".json": { label: "JSON", color: "bg-yellow-500/20 text-yellow-300" },
        ".properties": {
            label: "PROPERTIES",
            color: "bg-purple-500/20 text-purple-300",
        },
        ".txt": { label: "TEXT", color: "bg-gray-500/20 text-gray-300" },
        ".yaml": { label: "YAML", color: "bg-red-500/20 text-red-300" },
        ".yml": { label: "YAML", color: "bg-red-500/20 text-red-300" },
    };

    return (
        <div className="bg-zinc-800 px-32 flex items-center-safe justify-between select-none">
            <div className="flex items-center-safe gap-2 py-4">
                <Box size={32} />
                <h1 className="text-2xl">Quick-SmallCap</h1>
                <h3 className="opacity-50">{fileName}</h3>
                {(() => {
                    const extension = fileName.includes(".")
                        ? fileName
                              .slice(fileName.lastIndexOf("."))
                              .toLowerCase()
                        : "";

                    const style = extensionStyles[extension];

                    return style ? (
                        <span
                            className={`text-xs font-semibold px-2 py-1 rounded-md ${style.color}`}>
                            {style.label}
                        </span>
                    ) : null;
                })()}
            </div>

            <div className="flex overflow-hidden">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".yaml,.yml,.json,.txt"
                    hidden
                    onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                            void onUpload(file);
                        }

                        event.target.value = "";
                    }}
                />

                <button
                    type="button"
                    className="py-2 px-4 bg-red-400 hover:bg-red-500 cursor-pointer duration-100">
                    <div className="flex items-center-safe gap-2">
                        <Copy size={24} />
                        <p>Copy</p>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-4 bg-blue-400 hover:bg-blue-500 cursor-pointer duration-100">
                    <div className="flex items-center-safe gap-2">
                        <UploadCloud size={24} />
                        <p>Upload</p>
                    </div>
                </button>

                <button
                    type="button"
                    className="py-2 px-4 bg-green-400 hover:bg-green-500 cursor-pointer duration-100">
                    <div className="flex items-center-safe gap-2">
                        <DownloadCloud size={24} />
                        <p>Download</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default NavBar;
