import { FontAwesomeIcon as FAIcon } from "@fortawesome/vue-fontawesome";

export const FontAwesomeIcon = FAIcon as any;

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
  // probably you might want to add the currentTarget as well
  // currentTarget: T;
};
