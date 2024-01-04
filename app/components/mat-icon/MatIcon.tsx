export type Icon = "menu" | "home" | "add";

type MatIconParams = {
  icon: Icon;
};

export function MatIcon({ icon }: MatIconParams) {
  return <i className="material-symbols-outlined">{icon}</i>;
}
