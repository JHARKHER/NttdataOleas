
import React from 'react';

interface EditorProps {
  content: string;
  language: string;
}

const Editor: React.FC<EditorProps> = ({ content, language }) => {
  return (
    <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4 font-mono text-sm leading-relaxed">
      <pre className="text-gray-300">
        <code className={`language-${language}`}>
          {content}
        </code>
      </pre>
    </div>
  );
};

export default Editor;
