import init from 'terminal-hacker-core';

let wasmModule: any = null;

export const getWasmModule = async () => {
  if (!wasmModule) {
    wasmModule = await init();
  }
  return wasmModule;
};

export const initWasm = async () => {
  return await getWasmModule();
}; 