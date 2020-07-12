import { GameModel, Tileset } from "@/model/model";

export function renderTileOnTile(
  imgData: ImageData,
  buffer: Buffer,
  id: number,
  palette: string[],
  scale: number = 1,
  flipx: boolean = false,
  flipy: boolean = false,
  useTransparency = false
) {
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
}

export function renderTile(
  buffer: Buffer,
  id: number,
  palette: string[],
  scale: number = 1,
  flipx: boolean = false,
  flipy: boolean = false
): ImageData {
  const imgData = new ImageData(8 * scale, 8 * scale);
  renderTileOnTile(imgData, buffer, id, palette, scale, flipx, flipy, false);
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
  primaryTileset: Buffer | undefined,
  secondaryTileset: Buffer | undefined,
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
      const lower = getTileInfo(metatile[y * 2 + x]);
      const upper = getTileInfo(metatile[4 + y * 2 + x]);
      // TODO: Let's not crash if the required primary / secondary tileset is not given

      const tile = renderTile(
        lower.tileID < 0x200 ? primaryTileset! : secondaryTileset!,
        lower.tileID < 0x200 ? lower.tileID : lower.tileID - 0x200,
        palettes[lower.paletteID],
        scale,
        lower.flipx,
        lower.flipy
      );
      renderTileOnTile(
        tile,
        upper.tileID < 0x200 ? primaryTileset! : secondaryTileset!,
        upper.tileID < 0x200 ? upper.tileID : upper.tileID - 0x200,
        palettes[upper.paletteID],
        scale,
        upper.flipx,
        upper.flipy,
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
