import {
  ArrayValue,
  CValue,
  declareConst,
  declareStaticConst,
  DictionaryValue,
  FunctionCallValue,
  headerGuard,
  ListValue,
  ln,
  makeBool,
  makeDefineList,
  makeText,
  OrListValue,
  StructValue,
  TypeCast,
  writeToDataFile,
  writeToIncludeFile
} from "@/model/serialize/common";
import { GameModel } from "@/model/model";

export function compilePokemon() {
  buildPokemonBaseStats();
  buildLearnsets();
  buildTMHMLearnsets();
  buildIDs();
  buildNames();
  buildTutorLearnsets();
  buildEggMoves();
  buildDexEntries();
  buildDexOrders();
  buildEvos();
}

function buildEvos() {
  const evos = new DictionaryValue(
    Object.entries(GameModel.model.pokemon)
      .filter(([, mon]) => mon.evos !== undefined)
      .map(([id, mon]) => ({
        key: `SPECIES_${id}`,
        value: new ListValue(
          mon.evos!.map(
            evo =>
              new ArrayValue([
                `EVO_${evo.kind}`,
                typeof evo.param === "string" ? `ITEM_${evo.param}` : evo.param,
                `SPECIES_${evo.evolvedForm}`
              ])
          )
        )
      }))
  );

  writeToDataFile(
    "evolution.h",
    declareConst(
      "struct Evolution gEvolutionTable[NUM_SPECIES][EVOS_PER_MON]",
      evos
    )
  );
}

function buildDexOrders() {
  let pokemons = { ...GameModel.model.pokemon };
  delete pokemons.NONE;

  const orderAlpha = declareConst(
    "u16 gPokedexOrder_Alphabetical[]",
    new ListValue(
      Object.entries(pokemons)
        .sort(([, mon1], [, mon2]) =>
          mon1.name.toUpperCase().localeCompare(mon2.name.toUpperCase())
        )
        .map(([id]) => `NATIONAL_DEX_${id}`)
    )
  );

  const orderWeight = declareConst(
    "u16 gPokedexOrder_Weight[]",
    new ListValue(
      Object.entries(pokemons)
        .sort(([, mon1], [, mon2]) => mon1.weight - mon2.weight)
        .map(([id]) => `NATIONAL_DEX_${id}`)
    )
  );

  const orderHeight = declareConst(
    "u16 gPokedexOrder_Height[]",
    new ListValue(
      Object.entries(pokemons)
        .sort(([, mon1], [, mon2]) => mon1.height - mon2.height)
        .map(([id]) => `NATIONAL_DEX_${id}`)
    )
  );

  writeToDataFile(
    "pokedex_orders.h",
    `${orderAlpha}\n${orderWeight}\n${orderHeight}`
  );
}

function buildDexEntries() {
  const entries = new DictionaryValue(
    Object.entries(GameModel.model.pokemon).map(([id, mon]) => ({
      key: `NATIONAL_DEX_${id}`,
      value: new StructValue({
        categoryName: makeText(mon.categoryName),
        height: mon.height,
        weight: mon.weight,
        description: new TypeCast("const u8[]", makeText(mon.description)),
        pokemonScale: mon.pokemonScale,
        pokemonOffset: mon.pokemonOffset,
        trainerScale: mon.trainerScale,
        trainerOffset: mon.trainerOffset
      })
    }))
  );

  writeToDataFile(
    "pokedex_entries.h",
    declareConst("struct PokedexEntry gPokedexEntries[]", entries)
  );
}

function buildEggMoves() {
  const moves = new ListValue(
    Object.entries(GameModel.model.pokemon)
      .filter(([id, mon]) => mon.eggMoves !== undefined)
      .map<CValue>(
        ([id, mon]) =>
          new FunctionCallValue("egg_moves", [
            id,
            ...mon.eggMoves!.map(m => `MOVE_${m}`)
          ])
      )
      .concat("EGG_MOVES_TERMINATOR")
  );

  writeToDataFile(
    "egg_moves.h",
    "#define EGG_MOVES_SPECIES_OFFSET 20000\n" +
      "#define EGG_MOVES_TERMINATOR 0xFFFF\n" +
      "#define egg_moves(species, moves...) (SPECIES_##species + EGG_MOVES_SPECIES_OFFSET), moves\n\n" +
      declareConst("u16 gEggMoves[]", moves)
  );
}

function buildTutorLearnsets() {
  const learnsets = new DictionaryValue(
    Object.entries(GameModel.model.pokemon).map(([id, mon]) => ({
      key: `SPECIES_${id}`,
      value:
        mon.tutorMoves.length == 0
          ? 0
          : new OrListValue(mon.tutorMoves.map(tm => `TUTOR(MOVE_${tm})`))
    }))
  );

  // TODO: Adjust ITEM_TM01_FOCUS_PUNCH to always be the first TM.
  writeToDataFile(
    "tutor_learnsets.h",
    "#define TUTOR(move) (1u << (TUTOR_##move))\n\n" +
      declareStaticConst("u32 sTutorLearnsets[]", learnsets)
  );
}

function buildNames() {
  const names = new DictionaryValue(
    Object.entries(GameModel.model.pokemon).map(([id, mon]) => ({
      key: `SPECIES_${id}`,
      value: makeText(mon.name)
    }))
  );

  writeToDataFile(
    "species_names.h",
    declareConst("u8 gSpeciesNames[][POKEMON_NAME_LENGTH + 1]", names)
  );
}

function buildIDs() {
  const monIDs = makeDefineList(
    Object.keys(GameModel.model.pokemon)
      .concat(
        "EGG",
        "UNOWN_B",
        "UNOWN_C",
        "UNOWN_D",
        "UNOWN_E",
        "UNOWN_F",
        "UNOWN_G",
        "UNOWN_H",
        "UNOWN_I",
        "UNOWN_J",
        "UNOWN_K",
        "UNOWN_L",
        "UNOWN_M",
        "UNOWN_N",
        "UNOWN_O",
        "UNOWN_P",
        "UNOWN_Q",
        "UNOWN_R",
        "UNOWN_S",
        "UNOWN_T",
        "UNOWN_U",
        "UNOWN_V",
        "UNOWN_W",
        "UNOWN_X",
        "UNOWN_Y",
        "UNOWN_Z",
        "UNOWN_EMARK",
        "UNOWN_QMARK"
      )
      .map((id, i) => ({
        key: `SPECIES_${id}`,
        value: i.toString()
      }))
      .concat({
        key: "NUM_SPECIES",
        value: "SPECIES_EGG"
      })
  );

  const nationalDex = makeDefineList(
    Object.entries(GameModel.model.pokemon).map(([id, mon]) => ({
      key: `NATIONAL_DEX_${id}`,
      value: mon.nationalDexId.toString()
    }))
  );

  const hoennDex = makeDefineList(
    Object.entries(GameModel.model.pokemon).map(([id, mon]) => ({
      key: `HOENN_DEX_${id}`,
      value: mon.hoennDexId.toString()
    }))
  );

  writeToIncludeFile(
    "species.h",
    headerGuard(
      "GENERATED_SPECIES_H",
      ln(monIDs) + ln(nationalDex) + ln(hoennDex)
    )
  );
}

function buildTMHMLearnsets() {
  const learnsets = new DictionaryValue(
    Object.entries(GameModel.model.pokemon).map(([id, mon]) => ({
      key: `SPECIES_${id}`,
      value: new FunctionCallValue("TMHM_LEARNSET", [
        mon.tmhmLearnset.length == 0
          ? 0
          : new OrListValue(mon.tmhmLearnset.map(tm => `TMHM(${tm})`))
      ])
    }))
  );

  // TODO: Adjust ITEM_TM01_FOCUS_PUNCH to always be the first TM.
  writeToDataFile(
    "tmhm_learnsets.h",
    "#define TMHM_LEARNSET(moves) {(u32)(moves), ((u64)(moves) >> 32)}\n" +
      "#define TMHM(tmhm) ((u64)1 << (ITEM_##tmhm - ITEM_TM01_FOCUS_PUNCH))\n\n" +
      declareConst("u32 gTMHMLearnsets[][2]", learnsets)
  );
}

function buildLearnsets() {
  const learnsets = new DictionaryValue(
    Object.entries(GameModel.model.pokemon).map(([id, mon]) => ({
      key: `SPECIES_${id}`,
      value: new TypeCast(
        "const u16[]",
        new ListValue(
          mon.moves
            .map(learn => `LEVEL_UP_MOVE(${learn.level}, MOVE_${learn.move})`)
            .concat("LEVEL_UP_END")
        )
      )
    }))
  );
  writeToDataFile(
    "level_up_learnsets.h",
    "#define LEVEL_UP_MOVE(lvl, move) ((lvl << 9) | move)\n\n" +
      declareConst("u16 *const gLevelUpLearnsets[NUM_SPECIES]", learnsets)
  );
}

function buildPokemonBaseStats() {
  const mons = new DictionaryValue(
    Object.entries(GameModel.model.pokemon).map(([id, mon]) => ({
      key: `SPECIES_${id}`,
      value: new StructValue({
        baseHP: mon.baseHP,
        baseAttack: mon.baseAttack,
        baseDefense: mon.baseDefense,
        baseSpeed: mon.baseSpeed,
        baseSpAttack: mon.baseSpAttack,
        baseSpDefense: mon.baseSpDefense,
        type1: `TYPE_${mon.type1}`,
        type2: `TYPE_${mon.type2}`,
        catchRate: mon.catchRate,
        expYield: mon.expYield,
        evYield_HP: mon.evYield_HP,
        evYield_Attack: mon.evYield_Attack,
        evYield_Defense: mon.evYield_Defense,
        evYield_Speed: mon.evYield_Speed,
        evYield_SpAttack: mon.evYield_SpAttack,
        evYield_SpDefense: mon.evYield_SpDefense,
        item1: `ITEM_${mon.item1}`,
        item2: `ITEM_${mon.item2}`,
        genderRatio: mon.genderRatio,
        eggCycles: mon.eggCycles,
        friendship: mon.friendship,
        growthRate: `GROWTH_${mon.growthRate}`,
        eggGroup1: `EGG_GROUP_${mon.eggGroup1}`,
        eggGroup2: `EGG_GROUP_${mon.eggGroup2}`,
        abilities: new ArrayValue(mon.abilities.map(a => `ABILITY_${a}`)),
        safariZoneFleeRate: mon.safariZoneFleeRate,
        bodyColor: `BODY_COLOR_${mon.bodyColor}`,
        noFlip: makeBool(mon.noFlip)
      })
    }))
  );

  writeToDataFile(
    "base_stats.h",
    declareConst("struct BaseStats gBaseStats[]", mons)
  );
}
