import { GameModel } from "@/model/model";
import path from "path";
import { pascalToSnake } from "@/utils";
import { PathManager } from "@/modules/path-manager";
import jascpal from "jascpal";
import { makeBool, writeToFile } from "@/model/serialize/common";

export function compileTilesets() {
  for (const tileset of Object.keys(GameModel.model.tilesets)) {
    buildMetatiles(tileset);
    buildMetatileAttributes(tileset);
    buildPalettes(tileset);
  }
  buildMetatilesInc();
  buildGraphicsInc();
  buildHeadersInc();
}

function getTilesetPath(name: string): string {
  const subpath = GameModel.model.tilesets[name].secondary
    ? "secondary"
    : "primary";

  return path.join("data/tilesets", subpath, pascalToSnake(name));
}

function buildMetatileAttributes(tileset: string) {
  const { metatileAttributes } = GameModel.model.tilesets[tileset];
  const buf = new Buffer(metatileAttributes.length * 2);
  for (let i = 0; i < metatileAttributes.length; i++) {
    buf.writeUInt16LE(metatileAttributes[i], i * 2);
  }

  writeToFile(
    buf,
    path.join(getTilesetPath(tileset), "metatile_attributes.bin")
  );
}

function buildMetatiles(tileset: string) {
  const { metatiles } = GameModel.model.tilesets[tileset];
  const buf = new Buffer(metatiles.length * 8 * 2);
  for (let i = 0; i < metatiles.length; i++) {
    for (let j = 0; j < 8; j++) {
      buf.writeUInt16LE(metatiles[i][j], i * 8 * 2 + j * 2);
    }
  }

  writeToFile(buf, path.join(getTilesetPath(tileset), "metatiles.bin"));
}

function buildPalettes(tileset: string) {
  const { palettes } = GameModel.model.tilesets[tileset];
  for (let i = 0; i < palettes.length; i++) {
    buildPalette(tileset, i);
  }
}

function hexToColor(hex: string): [number, number, number] {
  const rawInt = parseInt(hex, 16);
  return [
    (rawInt & 0xff0000) >> 16,
    (rawInt & 0x00ff00) >> 8,
    rawInt & 0x0000ff
  ];
}

function buildPalette(tileset: string, id: number) {
  const filename = `palettes/${id < 10 ? "0" : ""}${id}.pal`;
  const { palettes } = GameModel.model.tilesets[tileset];
  const p = palettes[id].map(color => hexToColor(color));

  writeToFile(
    jascpal(p)
      .toString()
      .replace(/\n/g, "\r\n") + "\r\n", // needs Carriage Return linefeeds for whatever reason
    path.join(getTilesetPath(tileset), filename)
  );
}

function buildMetatilesInc() {
  const str = Object.entries(GameModel.model.tilesets)
    .map(([name, obj]) => {
      const snakeName = pascalToSnake(name);
      const order = obj.secondary ? "secondary" : "primary";
      return (
        `\t.align 1\ngMetatiles_${name}::\n` +
        `\t.incbin "data/tilesets/${order}/${snakeName}/metatiles.bin"\n\n` +
        `\t.align 1\ngMetatileAttributes_${name}::\n` +
        `\t.incbin "data/tilesets/${order}/${snakeName}/metatile_attributes.bin"\n`
      );
    })
    .join("\n");

  writeToFile(str, "data/tilesets/metatiles.inc");
}

function buildGraphicsInc() {
  const str = Object.entries(GameModel.model.tilesets)
    .map(([name, obj]) => {
      const snakeName = pascalToSnake(name);
      const order = obj.secondary ? "secondary" : "primary";
      const ext = obj.compressed ? ".lz" : "";

      const palList = obj.palettes
        .map(
          (_, id) =>
            `\t.incbin "data/tilesets/${order}/${snakeName}/palettes/${(id < 10
              ? "0"
              : "") + id}.gbapal"`
        )
        .join("\n");
      return (
        `\t.align 2\ngTilesetTiles_${name}::\n` +
        `\t.incbin "data/tilesets/${order}/${snakeName}/tiles.4bpp${ext}"\n\n` +
        `\t.align 2\ngTilesetPalettes_${name}::\n${palList}\n`
      );
    })
    .join("\n");

  writeToFile(str, "data/tilesets/graphics.inc");
}

function buildHeadersInc() {
  let pointerStr =
    `\t.align 2\ngTilesetPointer_SecretBase::\n` +
    `\t.4byte gTileset_SecretBase\n\n` +
    `\t.align 2\ngTilesetPointer_SecretBaseRedCave::\n` +
    `\t.4byte gTileset_SecretBaseRedCave\n\n`;
  const str = Object.entries(GameModel.model.tilesets)
    .map(([name, obj]) => {
      return (
        `\t.align 2\n` +
        `gTileset_${name}::\n` +
        `\t.byte ${makeBool(obj.compressed)} @ is compressed\n` +
        `\t.byte ${makeBool(obj.secondary)} @ is secondary tileset\n` +
        `\t.2byte 0 @ padding\n` +
        `\t.4byte gTilesetTiles_${name}\n` +
        `\t.4byte gTilesetPalettes_${name}\n` +
        `\t.4byte gMetatiles_${name}\n` +
        `\t.4byte gMetatileAttributes_${name}\n` +
        `\t.4byte ${
          obj.animated ? `InitTilesetAnim_${name}` : "NULL"
        } @ animation callback\n`
      );
    })
    .join("\n");
  writeToFile(pointerStr + str, "data/tilesets/headers.inc");
}
