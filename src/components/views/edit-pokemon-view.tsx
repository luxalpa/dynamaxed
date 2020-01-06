import { Component } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { FlexRow, Window, WindowLayout } from "@/components/layout";
import { Portal } from "portal-vue";
import { IDDisplay } from "@/components/displays/id-display";
import { GameModel } from "@/model/model";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { Sprite } from "@/components/sprite";
import { PathManager } from "@/modules/path-manager";
import { Spacer } from "@/components/spacer";

@Component
export class EditPokemonView extends View<string> {
  get pokemonID() {
    return this.args;
  }

  get pokemon() {
    return GameModel.model.pokemon[this.pokemonID];
  }

  get genderRatio() {
    if (this.pokemon.genderRatio === 255) {
      return "GENDERLESS";
    }
    if (this.pokemon.genderRatio === 254) {
      return "FEMALE";
    }
    if (this.pokemon.genderRatio === 0) {
      return "MALE";
    }
    return Math.floor((this.pokemon.genderRatio / 254) * 1000) / 10 + "%";
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
            <Button width={6}>
              <IDDisplay value={this.pokemonID} />
            </Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Name</Label>
            <Button width={6}>{this.pokemon.name}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Type</Label>
            <Button width={3}>{this.pokemon.type1}</Button>
            <Button width={3}>{this.pokemon.type2}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Abilities</Label>
            <Button width={5}>{this.pokemon.abilities[0]}</Button>
          </FlexRow>
          <FlexRow>
            <Spacer width={3} />
            <Button width={5}>{this.pokemon.abilities[1]}</Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Label>Base Stats</Label>
          </FlexRow>
          <FlexRow>
            <Label width={2}>HP</Label>
            <Button width={2}>{this.pokemon.baseHP}</Button>
            <Label width={2}>Speed</Label>
            <Button width={2}>{this.pokemon.baseSpeed}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Attack</Label>
            <Button width={2}>{this.pokemon.baseAttack}</Button>
            <Label width={2}>Defense</Label>
            <Button width={2}>{this.pokemon.baseDefense}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Sp. Att.</Label>
            <Button width={2}>{this.pokemon.baseSpAttack}</Button>
            <Label width={2}>Sp. Def.</Label>
            <Button width={2}>{this.pokemon.baseSpDefense}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Exp. gain</Label>
            <Button width={5}>{this.pokemon.growthRate}</Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Label>EV yields</Label>
          </FlexRow>
          <FlexRow>
            <Label width={2}>HP</Label>
            <Button width={2}>{this.pokemon.evYield_HP}</Button>
            <Label width={2}>Speed</Label>
            <Button width={2}>{this.pokemon.evYield_Speed}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Attack</Label>
            <Button width={2}>{this.pokemon.evYield_Attack}</Button>
            <Label width={2}>Defense</Label>
            <Button width={2}>{this.pokemon.evYield_Defense}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={2}>Sp. Att.</Label>
            <Button width={2}>{this.pokemon.evYield_SpAttack}</Button>
            <Label width={2}>Sp. Def.</Label>
            <Button width={2}>{this.pokemon.evYield_SpDefense}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={4}>Experience yield</Label>
            <Button width={2}>{this.pokemon.expYield}</Button>
          </FlexRow>
          <FlexRow />
          <FlexRow>
            <Label width={3}>Catch rate</Label>
            <Button width={2}>{this.pokemon.catchRate}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={3}>Held items</Label>
            <Button width={5}>{this.pokemon.item1}</Button>
          </FlexRow>
          <FlexRow>
            <Spacer width={3} />
            <Button width={5}>{this.pokemon.item2}</Button>
          </FlexRow>
          <FlexRow>
            <Label width={5}>Gender Ratio (M / F)</Label>
            <Button width={3}>{this.genderRatio}</Button>
          </FlexRow>
        </Window>
      </WindowLayout>
    );
  }
}
