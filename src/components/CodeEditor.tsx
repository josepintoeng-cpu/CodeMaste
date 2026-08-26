import React from 'react';
import { CodeInputEditor } from './CodeInputEditor';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  language?: string;
  initialCode?: string;
  expectedKeywords?: string[];
  expectedAnswer?: string;
  disabled?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder,
  language = 'javascript',
  initialCode,
  expectedKeywords,
  expectedAnswer,
  disabled,
}) => {
  return (
    <CodeInputEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      language={language}
      initialCode={initialCode}
      expectedKeywords={expectedKeywords}
      expectedAnswer={expectedAnswer}
      disabled={disabled}
    />
  );
};
