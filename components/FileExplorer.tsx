
import React, { useState } from 'react';
import { JAVA_PROJECT_DATA } from '../services/javaProjectData';
import { Icons } from '../constants';
import { JavaFile } from '../types';

interface FileExplorerProps {
  onFileSelect: (file: JavaFile) => void;
  selectedFilePath?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect, selectedFilePath }) => {
  const [expanded, setExpanded] = useState<string[]>(JAVA_PROJECT_DATA.map(p => p.name));

  const toggleFolder = (name: string) => {
    setExpanded(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  return (
    <div className="w-64 bg-[#1e293b] border-r border-slate-700 overflow-y-auto select-none">
      <div className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Explorer</div>
      {JAVA_PROJECT_DATA.map(project => (
        <div key={project.name}>
          <div 
            onClick={() => toggleFolder(project.name)}
            className="flex items-center gap-2 px-4 py-1 hover:bg-slate-700 cursor-pointer text-sm text-slate-200"
          >
            <span className={`transform transition-transform ${expanded.includes(project.name) ? 'rotate-90' : ''}`}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" /></svg>
            </span>
            <Icons.Folder />
            <span>{project.name}</span>
          </div>
          
          {expanded.includes(project.name) && (
            <div className="pl-6">
              {project.files.map(file => (
                <div 
                  key={file.path}
                  onClick={() => onFileSelect(file)}
                  className={`flex items-center gap-2 px-4 py-1 hover:bg-slate-700 cursor-pointer text-sm transition-colors ${selectedFilePath === file.path ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400'}`}
                >
                  <Icons.File />
                  <span className="truncate">{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileExplorer;
