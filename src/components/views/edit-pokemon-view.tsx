import { Component, Prop, Vue } from "vue-property-decorator";
import { View, ViewManager } from "@/modules/view-manager";
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
import { DialogManager } from "@/modules/dialog-manager";
import { InputTextDialog } from "@/components/dialogs/input-text-dialog";
import { createTextValidator, validateID } from "@/input-validators";
import { IDManager } from "@/modules/id-manager";
import { InputNumberDialog } from "@/components/dialogs/input-number-dialog";
import { ItemDisplay } from "@/components/displays/item-display";
import { List } from "@/constants";
import {
  chooseFromList,
  chooseNumber,
  chooseText
} from "@/components/views/utils";
import { EditMoveView } from "@/components/views/edit-move-view";
import { EditItemView } from "@/components/views/edit-item-view";

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

function removeEvo(mon: Pokemon, pos: number) {
  if (mon.evos !== undefined) {
    Vue.delete(mon.evos, pos);
  }
}

function addEvo(mon: Pokemon) {
  if (mon.evos === undefined) {
    Vue.set(mon, "evos", []);
  }
  mon.evos!.push({
    kind: "LEVEL",
    param: 0,
    evolvedForm: "NONE"
  });
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
  await chooseFromList(evo, "kind", List.EvoKinds);
  if (evo.kind !== before) {
    evo.param = defaultEvoParam(evo.kind);
  }
}

function sortMoves(mon: Pokemon) {
  mon.moves.sort((a, b) => a.level - b.level);
}

function removeMove(mon: Pokemon, pos: number) {
  Vue.delete(mon.moves, pos);
}

function addMove(mon: Pokemon) {
  mon.moves.push({
    level: 999,
    move: "NONE"
  });
}

function removeTutorMove(mon: Pokemon, pos: number) {
  Vue.delete(mon.tutorMoves, pos);
}

async function addTutorMove(mon: Pokemon) {
  const v = await DialogManager.openListDialog(List.TutorMoves);
  if (v !== undefined) {
    mon.tutorMoves.push(v);
  }
}

async function changeTutorMove(mon: Pokemon, pos: number) {
  const v = await DialogManager.openListDialog(
    List.TutorMoves,
    mon.tutorMoves[pos]
  );
  if (v !== undefined) {
    Vue.set(mon.tutorMoves, pos, v);
  }
}
function removeEggMove(mon: Pokemon, pos: number) {
  Vue.delete(mon.eggMoves!, pos);
}

async function addEggMove(mon: Pokemon) {
  const v = await DialogManager.openListDialog(List.Move);
  if (v !== undefined) {
    if (mon.eggMoves === undefined) {
      Vue.set(mon, "eggMoves", [v]);
    } else {
      mon.eggMoves.push(v);
    }
  }
}

async function changeEggMove(mon: Pokemon, pos: number) {
  const v = await DialogManager.openListDialog(List.Move, mon.eggMoves![pos]);
  if (v !== undefined) {
    Vue.set(mon.eggMoves!, pos, v);
  }
}

async function changeTM(mon: Pokemon, pos: number) {
  const v = await DialogManager.openListDialog(List.TMHMs);
  if (v !== undefined) {
    Vue.set(mon.tmhmLearnset, pos, v);
    sortTMs(mon);
  }
}

async function addTM(mon: Pokemon) {
  const v = await DialogManager.openListDialog(List.TMHMs);
  if (v !== undefined) {
    mon.tmhmLearnset.push(v);
    sortTMs(mon);
  }
}

function sortTMs(mon: Pokemon) {
  mon.tmhmLearnset.sort();
}

function removeTM(mon: Pokemon, pos: number) {
  Vue.delete(mon.tmhmLearnset, pos);
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
            <Button width={6} onclick={() => chooseText(pokemon, "name", 10)}>
              {this.pokemon.name}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Type</Label>
            <Button
              width={3}
              onclick={() => chooseFromList(pokemon, "type1", List.Types)}
            >
              {this.pokemon.type1}
            </Button>
            <Button
              width={3}
              onclick={() => chooseFromList(pokemon, "type2", List.Types)}
            >
              {this.pokemon.type2}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Abilities</Label>
            <Button
              width={5}
              onclick={() =>
                chooseFromList(pokemon, "ability1", List.Abilities)
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
                chooseFromList(pokemon, "ability2", List.Abilities)
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
                chooseFromList(pokemon, "growthRate", List.GrowthRates)
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
              onclick={() => chooseFromList(pokemon, "item1", List.Items)}
              onnavigate={() => ViewManager.push(EditItemView, pokemon.item1)}
            >
              <ItemDisplay item={this.pokemon.item1} />
            </Button>
          </FlexRow>
          <FlexRow>
            <Spacer width={3} />
            <Button
              width={5}
              onclick={() => chooseFromList(pokemon, "item2", List.Items)}
              onnavigate={() => ViewManager.push(EditItemView, pokemon.item2)}
            >
              <ItemDisplay item={this.pokemon.item2} />
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
            <Button
              width={8}
              onclick={() => addEvo(pokemon)}
              disabled={this.evos.length >= 5}
            >
              Add
            </Button>
          </FlexRow>
        </Window>
        <Window>
          <FlexRow>
            <Label>Learn Set</Label>
          </FlexRow>
          {this.pokemon.moves.map((move, i) => (
            <FlexRow>
              <Button
                width={2}
                onclick={() =>
                  chooseNumber(move, "level").then(() => sortMoves(pokemon))
                }
              >
                {move.level}
              </Button>
              <Button
                width={5}
                onclick={() => chooseFromList(move, "move", List.Move)}
                onnavigate={() => ViewManager.push(EditMoveView, move.move)}
              >
                <MoveDisplay move={move.move} />
              </Button>
              <Button width={1} onclick={() => removeMove(pokemon, i)}>
                <font-awesome-icon icon={["fas", "times"]} />
              </Button>
            </FlexRow>
          ))}
          <FlexRow>
            <Button width={8} onclick={() => addMove(pokemon)}>
              Add
            </Button>
          </FlexRow>

          <FlexRow>
            <Label>TMs / HMs</Label>
          </FlexRow>
          {pokemon.tmhmLearnset.map((tm, i) => (
            <FlexRow>
              <Button width={7} onclick={() => changeTM(pokemon, i)}>
                {tm}
              </Button>
              <Button width={1} onclick={() => removeTM(pokemon, i)}>
                <font-awesome-icon icon={["fas", "times"]} />
              </Button>
            </FlexRow>
          ))}
          <FlexRow>
            <Button width={8} onclick={() => addTM(pokemon)}>
              Add
            </Button>
          </FlexRow>

          <FlexRow>
            <Label>Tutor Moves</Label>
          </FlexRow>
          {pokemon.tutorMoves.map((tm, i) => (
            <FlexRow>
              <Button
                width={7}
                onnavigate={() => ViewManager.push(EditMoveView, tm)}
                onclick={() => changeTutorMove(pokemon, i)}
              >
                <MoveDisplay move={tm} />
              </Button>
              <Button width={1} onclick={() => removeTutorMove(pokemon, i)}>
                <font-awesome-icon icon={["fas", "times"]} />
              </Button>
            </FlexRow>
          ))}
          <FlexRow>
            <Button width={8} onclick={() => addTutorMove(pokemon)}>
              Add
            </Button>
          </FlexRow>

          <FlexRow>
            <Label>Egg Moves</Label>
          </FlexRow>
          {pokemon.eggMoves?.map((em, i) => (
            <FlexRow>
              <Button
                width={7}
                onnavigate={() => ViewManager.push(EditMoveView, em)}
                onclick={() => changeEggMove(pokemon, i)}
              >
                <MoveDisplay move={em} />
              </Button>
              <Button width={1} onclick={() => removeEggMove(pokemon, i)}>
                <font-awesome-icon icon={["fas", "times"]} />
              </Button>
            </FlexRow>
          ))}
          <FlexRow>
            <Button width={8} onclick={() => addEggMove(pokemon)}>
              Add
            </Button>
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
            <Button onclick={() => chooseFromList(evo, "param", List.Items)}>
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
          onnavigate={() => ViewManager.push(EditPokemonView, evo.evolvedForm)}
          onclick={() => chooseFromList(evo, "evolvedForm", List.Pokemon)}
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
