declare module "jascpal" {
  export = create;

  function create(buffer?: string | Buffer | Array<any>): Palette;

  type Color = [number, number, number];

  interface Palette {
    [n: number]: Color;
    toString(): string;
    setColor(n: number, color: Color): void;
    getColor(n: number): Color;
  }
}
