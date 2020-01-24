import { Component, Prop, Vue } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { FlexColumn, FlexRow, Window, WindowLayout } from "@/components/layout";
import { Portal } from "portal-vue";
import { IDDisplay } from "@/components/displays/id-display";
import { GameModel, Pokemon, PokemonEvolution } from "@/model/model";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { Sprite } from "@/components/sprite";
import { PathManager } from "@/modules/path-manager";
import { Spacer } from "@/components/spacer";
import { MoveDisplay } from "@/components/displays/move-display";
import { Dialog, DialogManager } from "@/modules/dialog-manager";
import { InputTextDialog } from "@/components/dialogs/input-text-dialog";
import { createTextValidator, validateID } from "@/input-validators";
import { IDManager } from "@/modules/id-manager";
import {
  ChooseAbilityDialog,
  ChooseEvoKindDialog,
  ChooseGrowthRateDialog,
  ChooseTypeDialog
} from "@/components/dialogs/simple-list-dialogs";
import { InputNumberDialog } from "@/components/dialogs/input-number-dialog";
import { ChooseItemDialog } from "@/components/lists/item-list";
import { ChoosePokemonDialog } from "@/components/lists/pokemon-list";
import { ItemDisplay } from "@/components/displays/item-display";

async function changeID(pokemonID: string) {
  const newID = await DialogManager.openDialog(InputTextDialog, {
    value: pokemonID,
    check: validateID
  });

  if (newID !== undefined) {
    IDManager.changePokemonID(pokemonID, newID);
  }
}

async function changeName(mon: Pokemon) {
  const name = await DialogManager.openDialog(InputTextDialog, {
    value: mon.name,
    check: createTextValidator(10)
  });

  if (name !== undefined) {
    mon.name = name;
  }
}

async function chooseFromList<T extends Object>(
  obj: T,
  prop: keyof T & string,
  dialog: new () => Dialog<string, string>
) {
  const x = obj[prop];
  if (typeof x !== "string") {
    throw new Error("Needs a string");
  }

  const v = await DialogManager.openDialog(dialog, x);
  if (v !== undefined) {
    Vue.set(obj, prop, v);
  }
}

async function chooseNumber<T extends Object>(
  obj: T,
  stat: keyof T & string,
  max?: number
) {
  const originalValue = obj[stat];

  if (typeof originalValue !== "number") {
    throw new Error("Only works for numeric stats!");
  }

  const v = await DialogManager.openDialog(InputNumberDialog, {
    value: originalValue,
    min: 0,
    max: max || 255
  });
  if (v !== undefined) {
    Vue.set(obj, stat, v);
  }
}

function removeEvo(mon: Pokemon, pos: number) {
  if (mon.evos !== undefined) {
    Vue.delete(mon.evos, 3);
  }
}

function defaultEvoParam(kind: string): string | number {
  switch (kind) {
    case "ITEM":
      return "NONE";
    default:
      return 0;
  }
}

async function changeEvoKind(evo: PokemonEvolution) {
  const before = evo.kind;
  await chooseFromList(evo, "kind", ChooseEvoKindDialog);
  if (evo.kind !== before) {
    evo.param = defaultEvoParam(evo.kind);
  }
}

@Component
export class EditPokemonView extends View<string> {
  get pokemonID() {
    return this.args;
  }

  get pokemon() {
    return GameModel.model.pokemon[this.pokemonID];
  }

  get evos(): PokemonEvolution[] {
    return this.pokemon.evos || [];
  }

  get genderRatio() {
    if (this.pokemon.genderRatio === 255) {
      return "GENDERLESS";
    }
    if (this.pokemon.genderRatio === 254) {
      return "ALWAYS FEMALE";
    }
    if (this.pokemon.genderRatio === 0) {
      return "ALWAYS MALE";
    }
    const v = Math.floor((this.pokemon.genderRatio / 254) * 1000) / 10;

    return `${100 - v}% M / ${v}% F`;
  }

  render() {
    const pokemonID = this.pokemonID;
    const pokemon = this.pokemon;

    return (
      <WindowLayout>
        <Portal to="title">
          Pokemon <IDDisplay value={pokemonID} />
        </Portal>
        <Window>
          <FlexRow>
            <Label width={3} height={3}>
              <Sprite src={PathManager.pokePic(pokemonID)} />
            </Label>
          </FlexRow>
          <FlexRow>
            <Label width={2}>ID</Label>
            <Button width={6} onclick={() => changeID(pokemonID)}>
              <IDDisplay value={pokemonID} />
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Name</Label>
            <Button width={6} onclick={() => changeName(pokemon)}>
              {this.pokemon.name}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Type</Label>
            <Button
              width={3}
              onclick={() => chooseFromList(pokemon, "type1", ChooseTypeDialog)}
            >
              {this.pokemon.type1}
            </Button>
            <Button
              width={3}
              onclick={() => chooseFromList(pokemon, "type2", ChooseTypeDialog)}
            >
              {this.pokemon.type2}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Abilities</Label>
            <Button
              width={5}
              onclick={() =>
                chooseFromList(pokemon, "ability1", ChooseAbilityDialog)
              }
            >
              {this.pokemon.ability1}
            </Button>
          </FlexRow>
          <FlexRow>
            <Spacer width={3} />
            <Button
              width={5}
              onclick={() =>
                chooseFromList(pokemon, "ability2", ChooseAbilityDialog)
              }
            >
              {this.pokemon.ability2}
            </Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Label>Base Stats</Label>
          </FlexRow>
          <FlexRow>
            <Label width={2}>HP</Label>
            <Button width={2} onclick={() => chooseNumber(pokemon, "baseHP")}>
              {this.pokemon.baseHP}
            </Button>
            <Label width={2}>Speed</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "baseSpeed")}
            >
              {this.pokemon.baseSpeed}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Attack</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "baseAttack")}
            >
              {this.pokemon.baseAttack}
            </Button>
            <Label width={2}>Defense</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "baseDefense")}
            >
              {this.pokemon.baseDefense}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Sp. Att.</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "baseSpAttack")}
            >
              {this.pokemon.baseSpAttack}
            </Button>
            <Label width={2}>Sp. Def.</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "baseSpDefense")}
            >
              {this.pokemon.baseSpDefense}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Exp. gain</Label>
            <Button
              width={5}
              onclick={() =>
                chooseFromList(pokemon, "growthRate", ChooseGrowthRateDialog)
              }
            >
              {this.pokemon.growthRate}
            </Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Label>EV yields</Label>
          </FlexRow>
          <FlexRow>
            <Label width={2}>HP</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "evYield_HP")}
            >
              {this.pokemon.evYield_HP}
            </Button>
            <Label width={2}>Speed</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "evYield_Speed")}
            >
              {this.pokemon.evYield_Speed}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Attack</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "evYield_Attack")}
            >
              {this.pokemon.evYield_Attack}
            </Button>
            <Label width={2}>Defense</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "evYield_Defense")}
            >
              {this.pokemon.evYield_Defense}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Sp. Att.</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "evYield_SpAttack")}
            >
              {this.pokemon.evYield_SpAttack}
            </Button>
            <Label width={2}>Sp. Def.</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "evYield_SpDefense")}
            >
              {this.pokemon.evYield_SpDefense}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={4}>Experience yield</Label>
            <Button width={2} onclick={() => chooseNumber(pokemon, "expYield")}>
              {this.pokemon.expYield}
            </Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Label width={3}>Catch rate</Label>
            <Button
              width={2}
              onclick={() => chooseNumber(pokemon, "catchRate")}
            >
              {this.pokemon.catchRate}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Held items</Label>
            <Button
              width={5}
              onclick={() => chooseFromList(pokemon, "item1", ChooseItemDialog)}
            >
              {this.pokemon.item1}
            </Button>
          </FlexRow>
          <FlexRow>
            <Spacer width={3} />
            <Button
              width={5}
              onclick={() => chooseFromList(pokemon, "item2", ChooseItemDialog)}
            >
              {this.pokemon.item2}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Gender %</Label>
            <Button
              width={5}
              onclick={() => chooseNumber(pokemon, "genderRatio")}
            >
              {this.genderRatio}
            </Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Label>Evolutions</Label>
          </FlexRow>
          {this.evos.map((evo, i) => (
            <EvoEntry evo={evo} onremove={() => removeEvo(pokemon, i)} />
          ))}
          <FlexRow>
            <Button width={8}>Add</Button>
          </FlexRow>
        </Window>
        <Window>
          <FlexRow>
            <Label>Learn Set</Label>
          </FlexRow>
          {this.pokemon.moves.map(move => (
            <FlexRow>
              <Button width={2}>{move.level}</Button>
              <Button width={5}>
                <MoveDisplay move={move.move} />
              </Button>
              <Button width={1}>
                <font-awesome-icon icon={["fas", "times"]} />
              </Button>
            </FlexRow>
          ))}
          <FlexRow>
            <Button width={8}>Add</Button>
          </FlexRow>

          <FlexRow>
            <Label>TMs / HMs</Label>
          </FlexRow>
          {this.pokemon.tmhmLearnset.map(tm => (
            <FlexRow>
              <Button width={7}>{tm}</Button>
              <Button width={1}>
                <font-awesome-icon icon={["fas", "times"]} />
              </Button>
            </FlexRow>
          ))}
          <FlexRow>
            <Button width={8}>Add</Button>
          </FlexRow>

          <FlexRow>
            <Label>Tutor Moves</Label>
          </FlexRow>
          {this.pokemon.tutorMoves.map(tm => (
            <FlexRow>
              <Button width={7}>
                <MoveDisplay move={tm} />
              </Button>
              <Button width={1}>
                <font-awesome-icon icon={["fas", "times"]} />
              </Button>
            </FlexRow>
          ))}
          <FlexRow>
            <Button width={8}>Add</Button>
          </FlexRow>

          <FlexRow>
            <Label>Egg Moves</Label>
          </FlexRow>
          {this.pokemon.eggMoves?.map(em => (
            <FlexRow>
              <Button width={7}>
                <MoveDisplay move={em} />
              </Button>
              <Button width={1}>
                <font-awesome-icon icon={["fas", "times"]} />
              </Button>
            </FlexRow>
          ))}
          <FlexRow>
            <Button width={8}>Add</Button>
          </FlexRow>
        </Window>
      </WindowLayout>
    );
  }
}

@Component
class EvoEntry extends Vue {
  @Prop() evo!: PokemonEvolution;

  render() {
    const evo = this.evo;

    const param = (function() {
      switch (evo.kind) {
        case "ITEM":
          return (
            <Button
              onclick={() => chooseFromList(evo, "param", ChooseItemDialog)}
            >
              {typeof evo.param === "string" ? (
                <ItemDisplay item={evo.param} />
              ) : (
                evo.param
              )}
            </Button>
          );
        default:
          return (
            <Button onclick={() => chooseNumber(evo, "param")}>
              {evo.param}
            </Button>
          );
      }
    })();

    return (
      <FlexRow>
        <Button
          width={3}
          height={3}
          onclick={() =>
            chooseFromList(evo, "evolvedForm", ChoosePokemonDialog)
          }
        >
          <Sprite src={PathManager.pokePic(evo.evolvedForm)} />
        </Button>
        <FlexColumn>
          <FlexRow>
            <Spacer width={4} />
            <Button width={1} onclick={() => this.$emit("remove")}>
              <font-awesome-icon icon={["fas", "times"]} />
            </Button>
          </FlexRow>
          <FlexRow>
            <Button onclick={() => changeEvoKind(this.evo)}>{evo.kind}</Button>
          </FlexRow>
          <FlexRow>{param}</FlexRow>
        </FlexColumn>
      </FlexRow>
    );
  }
}
