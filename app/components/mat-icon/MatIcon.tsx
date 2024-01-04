type MatIconParams = {
  icon: "menu" | "home" | "add";
};

export function MatIcon({ icon }: MatIconParams) {
  return <i className="material-symbols-outlined">{icon}</i>;
}
