import { Component, Vue } from "vue-property-decorator";
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
  ChooseGrowthRateDialog,
  ChooseTypeDialog
} from "@/components/dialogs/simple-list-dialogs";
import { InputNumberDialog } from "@/components/dialogs/input-number-dialog";
import { ChooseItemDialog } from "@/components/lists/item-list";

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

  async changeID() {
    const newID = await DialogManager.openDialog(InputTextDialog, {
      value: this.pokemonID,
      check: validateID
    });

    if (newID !== undefined) {
      IDManager.changePokemonID(this.pokemonID, newID);
    }
  }

  async changeName() {
    const name = await DialogManager.openDialog(InputTextDialog, {
      value: this.pokemon.name,
      check: createTextValidator(10)
    });

    if (name !== undefined) {
      this.pokemon.name = name;
    }
  }

  async chooseFromList(
    prop: keyof Pokemon,
    dialog: new () => Dialog<string, string>
  ) {
    const v = await DialogManager.openDialog(dialog, this.pokemon[prop]);
    if (v !== undefined) {
      Vue.set(this.pokemon, prop, v);
    }
  }

  async adjustNumericStat(stat: keyof Pokemon, max?: number) {
    const originalValue = this.pokemon[stat];

    if (typeof originalValue !== "number") {
      throw new Error("Only works for numeric stats!");
    }

    const v = await DialogManager.openDialog(InputNumberDialog, {
      value: originalValue,
      min: 0,
      max: max || 255
    });
    if (v !== undefined) {
      Vue.set(this.pokemon, stat, v);
    }
  }

  render() {
    return (
      <WindowLayout>
        <Portal to="title">
          Pokemon <IDDisplay value={this.pokemonID} />
        </Portal>
        <Window>
          <FlexRow>
            <Label width={3} height={3}>
              <Sprite src={PathManager.pokePic(this.pokemonID)} />
            </Label>
          </FlexRow>
          <FlexRow>
            <Label width={2}>ID</Label>
            <Button width={6} onclick={() => this.changeID()}>
              <IDDisplay value={this.pokemonID} />
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Name</Label>
            <Button width={6} onclick={() => this.changeName()}>
              {this.pokemon.name}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Type</Label>
            <Button
              width={3}
              onclick={() => this.chooseFromList("type1", ChooseTypeDialog)}
            >
              {this.pokemon.type1}
            </Button>
            <Button
              width={3}
              onclick={() => this.chooseFromList("type2", ChooseTypeDialog)}
            >
              {this.pokemon.type2}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Abilities</Label>
            <Button
              width={5}
              onclick={() =>
                this.chooseFromList("ability1", ChooseAbilityDialog)
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
                this.chooseFromList("ability2", ChooseAbilityDialog)
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
            <Button width={2} onclick={() => this.adjustNumericStat("baseHP")}>
              {this.pokemon.baseHP}
            </Button>
            <Label width={2}>Speed</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("baseSpeed")}
            >
              {this.pokemon.baseSpeed}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Attack</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("baseAttack")}
            >
              {this.pokemon.baseAttack}
            </Button>
            <Label width={2}>Defense</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("baseDefense")}
            >
              {this.pokemon.baseDefense}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Sp. Att.</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("baseSpAttack")}
            >
              {this.pokemon.baseSpAttack}
            </Button>
            <Label width={2}>Sp. Def.</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("baseSpDefense")}
            >
              {this.pokemon.baseSpDefense}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Exp. gain</Label>
            <Button
              width={5}
              onclick={() =>
                this.chooseFromList("growthRate", ChooseGrowthRateDialog)
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
              onclick={() => this.adjustNumericStat("evYield_HP")}
            >
              {this.pokemon.evYield_HP}
            </Button>
            <Label width={2}>Speed</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("evYield_Speed")}
            >
              {this.pokemon.evYield_Speed}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Attack</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("evYield_Attack")}
            >
              {this.pokemon.evYield_Attack}
            </Button>
            <Label width={2}>Defense</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("evYield_Defense")}
            >
              {this.pokemon.evYield_Defense}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Sp. Att.</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("evYield_SpAttack")}
            >
              {this.pokemon.evYield_SpAttack}
            </Button>
            <Label width={2}>Sp. Def.</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("evYield_SpDefense")}
            >
              {this.pokemon.evYield_SpDefense}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={4}>Experience yield</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("expYield")}
            >
              {this.pokemon.expYield}
            </Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Label width={3}>Catch rate</Label>
            <Button
              width={2}
              onclick={() => this.adjustNumericStat("catchRate")}
            >
              {this.pokemon.catchRate}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Held items</Label>
            <Button
              width={5}
              onclick={() => this.chooseFromList("item1", ChooseItemDialog)}
            >
              {this.pokemon.item1}
            </Button>
          </FlexRow>
          <FlexRow>
            <Spacer width={3} />
            <Button
              width={5}
              onclick={() => this.chooseFromList("item2", ChooseItemDialog)}
            >
              {this.pokemon.item2}
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Gender %</Label>
            <Button
              width={5}
              onclick={() => this.adjustNumericStat("genderRatio")}
            >
              {this.genderRatio}
            </Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Label>Evolutions</Label>
          </FlexRow>
          {this.evos.map(evo => (
            <FlexRow>
              <Button width={3} height={3}>
                <Sprite src={PathManager.pokePic(evo.evolvedForm)} />
              </Button>
              <FlexColumn>
                <FlexRow>
                  <Spacer width={4} />
                  <Button width={1}>
                    <font-awesome-icon icon={["fas", "times"]} />
                  </Button>
                </FlexRow>
                <FlexRow>
                  <Button>{evo.kind}</Button>
                </FlexRow>
                <FlexRow>
                  <Button>{evo.param}</Button>
                </FlexRow>
              </FlexColumn>
            </FlexRow>
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
