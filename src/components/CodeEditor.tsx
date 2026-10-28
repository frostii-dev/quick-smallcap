import { Editor } from "@monaco-editor/react";

type CodeEditorProps = {
    content: string;
    language: string;
    onChange: (value: string | undefined) => void;
};

const CodeEditor = ({ content, language, onChange }: CodeEditorProps) => {
    return (
        <Editor
            height="100%"
            width="100%"
            theme="vs-dark"
            onChange={onChange}
            value={content}
            language={language}
            options={{
                fontFamily: "JetBrains Mono",
                fontLigatures: true,
                automaticLayout: true,
                minimap: {
                    enabled: false,
                },
            }}
        />
    );
};

export default CodeEditor;
