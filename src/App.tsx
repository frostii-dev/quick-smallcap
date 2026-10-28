import { useState } from "react";
import { Group, Panel } from "react-resizable-panels";

import "./App.css";
import CodeEditor from "./components/CodeEditor";

import NavBar from "./components/NavBar";
import FieldInspector from "./components/FieldInspector";

const App = () => {
    const [content, setContent] = useState(
        "# Upload a file or paste content here.",
    );
    const [language, setLanguage] = useState("yaml");
    const [fileName, setFileName] = useState("");

    const languageMap: Record<string, string> = {
        ".json": "json",
        ".properties": "properties",
        ".txt": "plaintext",
        ".yaml": "yaml",
        ".yml": "yaml",
    };

    const handleUpload = async (file: File) => {
        if (!file) return;

        const fileContent = await file.text();

        setContent(fileContent);
        setFileName(file.name);

        const extention = file.name
            .slice(file.name.lastIndexOf("."))
            .toLocaleLowerCase();

        setLanguage(languageMap[extention] ?? "plaintext");
    };

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            <NavBar fileName={fileName} onUpload={handleUpload} />
            <Group orientation="horizontal">
                <Panel defaultSize="70%" minSize="30%">
                    <div className="h-full w-full min-h-0 min-w-0 overflow-hidden">
                        <CodeEditor
                            content={content}
                            language={language}
                            onChange={(value) => setContent(value ?? "")}
                        />
                    </div>
                </Panel>

                <Panel defaultSize="30%" minSize="15%">
                    <div className="h-full min-h-0 min-w-0 overflow-hidden bg-zinc-900">
                        {["json", "yaml", "yml", "properties"].includes(
                            language,
                        ) ? (
                            <FieldInspector
                                content={content}
                                language={language}
                            />
                        ) : (
                            <div className="p-4 text-sm text-zinc-500">
                                Select a JSON, YAML, or .properties file to
                                inspect its fields.
                            </div>
                        )}
                    </div>
                </Panel>
            </Group>
        </div>
    );
};

export default App;
