import { Component, Vue } from "vue-property-decorator";
import { View, ViewManager } from "@/modules/view-manager";
import { TrainerClassList } from "@/components/lists/trainer-class-list";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";
import { FlexRow } from "@/components/layout";
import { Button } from "@/components/button";
import { stylesheet } from "typestyle";
import { Constants } from "@/constants";
import { EditTrainerView } from "@/components/views/edit-trainer-view";
import { TrainerList } from "@/components/lists/trainer-list";
import { GameModel } from "@/model/model";
import { createModelObj } from "@/utils";

interface CreateListViewOpts<T> {
  targetView: new () => View<string>;
  title: string;
  list: new () => Vue;
  model: Record<string, T>;
  defaultObj?: () => T;
}

function createListView<T>(opts: CreateListViewOpts<T>): new () => View<void> {
  const ListView = opts.list;

  const c = class extends View<void> {
    createNew() {
      const id = createModelObj(opts.model, opts.defaultObj);
      ViewManager.push(opts.targetView, id);
    }

    get title(): string {
      return opts.title;
    }

    render() {
      return (
        <div class={styles.view}>
          <ListView
            onentryclick={(id: string) => ViewManager.push(opts.targetView, id)}
            class={styles.list}
          />
          <FlexRow class={styles.btn}>
            <Button onclick={() => this.createNew()}>Create new</Button>
          </FlexRow>
        </div>
      );
    }
  };

  return Component(c);
}

const styles = stylesheet({
  view: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  list: {
    height: "100%",
    overflow: "auto",
    margin: Constants.margin
  },
  btn: {
    justifyContent: "center"
  }
});

export const TrainerClassesView = createListView({
  title: "All Trainer Classes",
  list: TrainerClassList,
  targetView: EditTrainerClassView,
  model: GameModel.model.trainerClasses,
  defaultObj: () => ({
    name: "CUSTOM CLASS"
  })
});

export const TrainersView = createListView({
  title: "All Trainers",
  list: TrainerList,
  targetView: EditTrainerView,
  model: GameModel.model.trainers
});
