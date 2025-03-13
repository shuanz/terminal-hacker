import { useState, useCallback } from 'react';

export const useTerminal = () => {
  const [output, setOutput] = useState<string>('');

  const appendOutput = useCallback((text: string) => {
    setOutput(prev => prev + text + '\n');
  }, []);

  const clearOutput = useCallback(() => {
    setOutput('');
  }, []);

  return {
    output,
    appendOutput,
    clearOutput
  };
}; 