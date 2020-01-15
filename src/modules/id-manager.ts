import { GameModel } from "@/model/model";
import { ViewManager } from "@/modules/view-manager";
import { Vue } from "vue-property-decorator";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";
import { EditTrainerView } from "@/components/views/edit-trainer-view";
import { EditMoveView } from "@/components/views/edit-move-view";
import { EditPokemonView } from "@/components/views/edit-pokemon-view";

export namespace IDManager {
  export function changeMoveID(oldID: string, newID: string) {
    alterMoveID(oldID, newID, false);
  }

  export function removeMove(oldID: string, replaceID: string = "NONE") {
    alterMoveID(oldID, replaceID, true);
  }

  function alterMoveID(id: string, replaceID: string, doDelete: boolean) {
    if (id === replaceID) {
      return;
    }

    const move = GameModel.model.moves[id];
    Vue.delete(GameModel.model.moves, id);
    if (!doDelete) {
      Vue.set(GameModel.model.moves, replaceID, move);
    }

    Object.values(GameModel.model.trainers)
      .flatMap(t => t.party)
      .map(mon =>
        mon.moves.forEach((move, i) => {
          if (move === id) {
            Vue.set(mon.moves, i, replaceID);
          }
        })
      );

    Object.values(GameModel.model.pokemon).map(mon => {
      if (mon.eggMoves) {
        mon.eggMoves.forEach((move, i) => {
          if (move === id) {
            Vue.set(mon.eggMoves!, i, replaceID);
          }
        });
      }

      mon.moves.forEach((move, i) => {
        if (move.move === id) {
          move.move = replaceID;
        }
      });

      // TODO: Consider HM / TM and Tutors.
    });

    for (let [index, viewInstance] of ViewManager.viewStack.entries()) {
      if (
        ViewManager.isView(EditMoveView, viewInstance) &&
        viewInstance.params === id
      ) {
        if (doDelete) {
          Vue.delete(ViewManager.viewStack, index);
        } else {
          viewInstance.params = replaceID;
        }
      }
    }
  }

  export function changeTrainerClassID(oldID: string, newID: string) {
    alterTrainerClass(oldID, newID, false);
  }

  export function removeTrainerClass(id: string, replacement: string) {
    alterTrainerClass(id, replacement, true);
  }

  function alterTrainerClass(id: string, replaceID: string, doDelete: boolean) {
    if (id === replaceID) {
      return;
    }
    const trainerClass = GameModel.model.trainerClasses[id];
    Vue.delete(GameModel.model.trainerClasses, id);
    if (!doDelete) {
      Vue.set(GameModel.model.trainerClasses, replaceID, trainerClass);
    }

    for (let trainer of Object.values(GameModel.model.trainers)) {
      if (trainer.trainerClass === id) {
        trainer.trainerClass = replaceID;
      }
    }

    for (let [index, viewInstance] of ViewManager.viewStack.entries()) {
      if (
        ViewManager.isView(EditTrainerClassView, viewInstance) &&
        viewInstance.params === id
      ) {
        if (doDelete) {
          Vue.delete(ViewManager.viewStack, index);
        } else {
          viewInstance.params = replaceID;
        }
      }
    }
  }

  export function changeTrainerID(oldID: string, newID: string) {
    alterTrainer(oldID, newID, false);
  }

  export function removeTrainer(id: string, replacement: string = "NONE") {
    alterTrainer(id, replacement, true);
  }

  function alterTrainer(id: string, replaceID: string, doDelete: boolean) {
    if (id === replaceID) {
      return;
    }
    const trainer = GameModel.model.trainers[id];
    Vue.delete(GameModel.model.trainers, id);
    if (!doDelete) {
      Vue.set(GameModel.model.trainers, replaceID, trainer);
    }

    for (let [index, viewInstance] of ViewManager.viewStack.entries()) {
      if (
        ViewManager.isView(EditTrainerView, viewInstance) &&
        viewInstance.params === id
      ) {
        if (doDelete) {
          Vue.delete(ViewManager.viewStack, index);
        } else {
          viewInstance.params = replaceID;
        }
      }
    }
  }

  export function changePokemonID(oldID: string, newID: string) {
    alterPokemon(oldID, newID, false);
  }

  export function removePokemon(id: string, replacement: string = "NONE") {
    alterPokemon(id, replacement, true);
  }
  function alterPokemon(id: string, replaceID: string, doDelete: boolean) {
    if (id === replaceID) {
      return;
    }

    const mon = GameModel.model.pokemon[id];
    Vue.delete(GameModel.model.pokemon, id);
    if (!doDelete) {
      Vue.set(GameModel.model.pokemon, replaceID, mon);
    }

    for (let [index, viewInstance] of ViewManager.viewStack.entries()) {
      if (
        ViewManager.isView(EditPokemonView, viewInstance) &&
        viewInstance.params === id
      ) {
        if (doDelete) {
          Vue.delete(ViewManager.viewStack, index);
        } else {
          viewInstance.params = replaceID;
        }
      }
    }

    for (let trainerMon of Object.values(GameModel.model.trainers).flatMap(
      t => t.party
    )) {
      if (trainerMon.species === id) {
        trainerMon.species = replaceID;
      }
    }
  }
}
