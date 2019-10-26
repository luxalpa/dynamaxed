import { ProjectManager } from "@/modules/project-manager";
import path from "path";

function correctTrainerImagePath(id: string): string {
  switch (id.toLowerCase()) {
    case "cooltrainer_m":
      return "cool_trainer_m";
    case "cooltrainer_f":
      return "cool_trainer_f";
    case "rs_brendan":
      return "ruby_sapphire_brendan";
    case "rs_may":
      return "ruby_sapphire_may";
    default:
      return id.toLowerCase();
  }
}

export namespace PathManager {
  export function trainerPic(id: string) {
    return path.join(
      ProjectManager.currentProjectPath,
      "graphics/trainers/front_pics",
      correctTrainerImagePath(id) + "_front_pic.png"
    );
  }

  export function pokeIcon(id: string) {
    return path.join(
      ProjectManager.currentProjectPath,
      "graphics/pokemon",
      id.toLowerCase(),
      "icon.png"
    );
  }

  export function pokePic(id: string) {
    let imgName = "front.png";
    if (id.toLowerCase() == "castform") {
      imgName = "front_normal_form.png";
    }

    return path.join(
      ProjectManager.currentProjectPath,
      "graphics/pokemon",
      id.toLowerCase(),
      imgName
    );
  }

  export function metaPath(...subpath: string[]): string {
    return path.join(
      ProjectManager.currentProjectPath,
      ".project-mewtwo",
      ...subpath
    );
  }
}
