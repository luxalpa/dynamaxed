import { GameModel, Tileset } from "@/model/model";
import fs from "fs";
import { PathManager } from "@/modules/path-manager";
import { getTilesetPath } from "@/model/serialize/tilesets";
import { decode } from "upng-js";

export function renderTile(
  buffer: Buffer,
  id: number,
  palette: string[],
  scale: number = 1,
  flipx: boolean = false,
  flipy: boolean = false,
  useTransparency = false
): ImageData {
  const imgData = new ImageData(8 * scale, 8 * scale);
  for (let i = 0; i < 8 * 8; i++) {
    const sourceX = (id % 16) * 8 + (i % 8);
    const sourceY = Math.floor(id / 16) * 8 + Math.floor(i / 8);
    const sourceIdx = sourceY * 8 * 16 + sourceX;

    // Sometimes it appears to refer to tiles that don't exist :/
    if (Math.floor(sourceIdx / 2) >= buffer.length) {
      continue;
    }

    let px = buffer.readUInt8(Math.floor(sourceIdx / 2));
    if (sourceIdx % 2) {
      px = px & 0x0f;
    } else {
      px = px >> 4;
    }

    // Transparent pixels have palette index 0
    if (useTransparency && px == 0) {
      continue;
    }

    const color = palette[px];

    const bigint = parseInt(color, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Scale the image
    const basex = scale * (flipx ? 7 - (i % 8) : i % 8);
    const basey = scale * (flipy ? 7 - Math.floor(i / 8) : Math.floor(i / 8));

    for (let y = basey; y < basey + scale; y++) {
      for (let x = basex; x < basex + scale; x++) {
        const idx = y * (scale * 8) + x;
        const npos = idx * 4;

        imgData.data[npos] = r;
        imgData.data[npos + 1] = g;
        imgData.data[npos + 2] = b;
        imgData.data[npos + 3] = 255;
      }
    }
  }
  return imgData;
}

interface TileInfo {
  tileID: number;
  flipx: boolean;
  flipy: boolean;
  paletteID: number;
}

function getTileInfo(compressedTile: number): TileInfo {
  return {
    tileID: compressedTile & 0x3ff,
    flipx: !!(compressedTile & (1 << 10)),
    flipy: !!(compressedTile & (1 << 11)),
    paletteID: (compressedTile & (0xf << 12)) >> 12
  };
}

export function renderMetaTile(
  metatile: number[],
  baseTileset: Buffer | undefined,
  extensionTileset: Buffer | undefined,
  palettes: string[][],
  scale: number = 1
): OffscreenCanvas {
  const canvas = new OffscreenCanvas(16 * scale, 16 * scale);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("2D Context is null!");
  }

  const lower = renderMetatileLayer(
    metatile.slice(0, 4),
    baseTileset,
    extensionTileset,
    palettes,
    scale
  );
  const upper = renderMetatileLayer(
    metatile.slice(4, 8),
    baseTileset,
    extensionTileset,
    palettes,
    scale
  );

  context.drawImage(lower, 0, 0);
  context.drawImage(upper, 0, 0);

  return canvas;
}

export function renderMetatileLayer(
  layer: number[],
  baseTileset: Buffer | undefined,
  extensionTileset: Buffer | undefined,
  palettes: string[][],
  scale: number = 1
): OffscreenCanvas {
  const canvas = new OffscreenCanvas(16 * scale, 16 * scale);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("2D Context is null!");
  }

  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      const tileInfo = getTileInfo(layer[y * 2 + x]);
      // TODO: Let's not crash if the required primary / secondary tileset is not given

      const tile = renderTile(
        tileInfo.tileID < 0x200 ? baseTileset! : extensionTileset!,
        tileInfo.tileID < 0x200 ? tileInfo.tileID : tileInfo.tileID - 0x200,
        palettes[tileInfo.paletteID],
        scale,
        tileInfo.flipx,
        tileInfo.flipy,
        true
      );
      context.putImageData(tile, x * 8 * scale, y * 8 * scale);
    }
  }

  return canvas;
}

export interface PrimarySecondaryTilesetInfo {
  base: string;
  extension?: string;
}

export function getTilesetExtInfo(
  tilesetID: string
): PrimarySecondaryTilesetInfo {
  const tileset = GameModel.model.tilesets[tilesetID];

  if (tileset.extension) {
    return {
      base: tileset.assoc,
      extension: tilesetID
    };
  }
  return {
    base: tilesetID
  };
}

export interface TilesetPalettesInfo {
  base: string[][];
  extension?: string[][];
}

export function getTilesetPalettes(tilesetID: string): TilesetPalettesInfo {
  const info = getTilesetExtInfo(tilesetID);

  return {
    base: GameModel.model.tilesets[info.base].palettes.slice(0, 6),
    extension: info.extension
      ? GameModel.model.tilesets[info.extension].palettes.slice(6, 13)
      : undefined
  };
}

export interface TilesInfo {
  buffer: Buffer;
  name: string;
  numTiles: number;
}

export const NoTilesInfo: TilesInfo = {
  buffer: new Buffer(""),
  name: "",
  numTiles: 0
};

export function getTilesInfo(id: string): TilesInfo {
  if (id === "") {
    return NoTilesInfo;
  }

  const pngData = fs.readFileSync(
    PathManager.projectPath(getTilesetPath(id), "tiles.png")
  );

  const img = decode(pngData);

  const buffer = new Buffer(img.data);

  return {
    buffer,
    numTiles: (img.height / 8) * (img.width / 8),
    name: id
  };
}
