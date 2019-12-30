import fs from "fs";
import { PathManager } from "@/modules/path-manager";
import * as path from "path";

export interface DictionaryEntry {
  key: string;
  value: CValue;
}

export interface DefineListEntry {
  key: string;
  value: string;
}

export function makeDefineList(entries: DefineListEntry[]): string {
  return entries.map(e => `#define ${e.key} ${e.value}\n`).join("");
}

export function indentation(indent: number): string {
  return "    ".repeat(indent);
}

export function indentate(indent: number, value: string) {
  return indentation(indent) + value;
}

export function ln(value: string) {
  return value + "\n";
}

export abstract class ComplexCValue {
  abstract render(indent: number): string;
}

export type CValue = ComplexCValue | string | number;

function render(value: CValue, indent = 0) {
  if (value instanceof ComplexCValue) {
    return value.render(indent);
  }
  return "" + value;
}

export function makeBool(b: boolean) {
  return b ? "TRUE" : "FALSE";
}

export function makeText(str: string) {
  return `_("${escapeForString(str)}")`;
}

export function makeFlags(flags: string[]) {
  if (flags.length === 0) {
    return "0";
  }
  return flags.join(" | ");
}

export class ListValue extends ComplexCValue {
  constructor(public entries: CValue[]) {
    super();
  }
  render(indent: number): string {
    if (this.entries.length === 1) {
      return `{${render(this.entries[0], indent + 1)}}`;
    }

    const entries = this.entries
      .map(e => {
        const v = render(e, indent + 1);
        return ln(indentate(indent + 1, `${v},`));
      })
      .join("");

    return ln("{") + entries + indentate(indent, "}");
  }
}

export class DictionaryValue extends ComplexCValue {
  constructor(public entries: DictionaryEntry[]) {
    super();
  }
  render(indent: number): string {
    const entries = this.entries
      .map(e => {
        const v = render(e.value, indent + 1);
        return ln(indentate(indent + 1, `[${e.key}] = ${v},`));
      })
      .join("");

    return ln("{") + entries + indentate(indent, "}");
  }
}

export class StructValue extends ComplexCValue {
  constructor(public entries: Record<string, CValue>) {
    super();
  }
  render(indent: number): string {
    const entries = Object.entries(this.entries)
      .map(([field, value]) =>
        ln(indentate(indent + 1, `.${field} = ${render(value, indent + 1)},`))
      )
      .join("");

    return ln("{") + entries + indentate(indent, "}");
  }
}

export class ArrayValue extends ComplexCValue {
  constructor(public entries: CValue[]) {
    super();
  }

  render(indent: number): string {
    const entries = this.entries
      .map(e => `${render(e, indent + 1)}`)
      .join(", ");
    return `{${entries}}`;
  }
}

export class TypeCast extends ComplexCValue {
  constructor(public cast: string, public value: CValue) {
    super();
  }

  render(indent: number): string {
    return `(${this.cast}) ${render(this.value, indent)}`;
  }
}

export class FunctionCallValue extends ComplexCValue {
  constructor(public fn: string, public params: CValue[]) {
    super();
  }

  render(indent: number): string {
    const contents = this.params.map(p => render(p, indent + 1)).join(", ");
    return `${this.fn}(${contents})`;
  }
}

export class OrListValue extends ComplexCValue {
  constructor(public entries: CValue[]) {
    super();
  }

  render(indent: number): string {
    return this.entries
      .map(e => render(e, indent + 1))
      .join("\n" + indentation(indent + 1) + "| ");
  }
}

export function declareConst(dec: string, contents: CValue) {
  return `const ${dec} = ${render(contents, 0)};\n`;
}

export function declareStaticConst(dec: string, contents: CValue) {
  return `static ${declareConst(dec, contents)}`;
}

export function writeToFile(contents: string, ...filepath: string[]) {
  const dirPath = PathManager.projectPath(...filepath);
  fs.mkdirSync(path.dirname(dirPath), { recursive: true });
  fs.writeFileSync(dirPath, contents);
}

export function writeToDataFile(filename: string, contents: string) {
  writeToFile(contents, "src/data/generated", filename);
}

export function writeToIncludeFile(filename: string, contents: string) {
  writeToFile(contents, "include/generated", filename);
}

export function writeToASMDataFile(filename: string, contents: string) {
  writeToFile(contents, "data/generated", filename);
}

export function escapeForString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

export function headerGuard(name: string, contents: string): string {
  const guard = `GUARD_${name}`;
  return `#ifndef ${guard}\n#define ${guard}\n\n${contents}\n#endif // ${guard}\n`;
}

export function declareASM(name: string, commands: string[]) {
  const body = commands.map(c => `\t${c}\n`).join("");
  return `${name}::\n${body}`;
}
