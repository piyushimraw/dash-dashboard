import type { NavigationGroup, DialogDefinition } from "@dash/mfe-types";

interface MFERegistration {
  id: string;
  navigation?: NavigationGroup[];
  dialogs?: DialogDefinition[];
}

class MFERegistry {
  private registrations: Map<string, MFERegistration> = new Map();

  register(mfe: MFERegistration) {
    this.registrations.set(mfe.id, mfe);
  }

  getAllNavigation(): NavigationGroup[] {
    const allNav = Array.from(this.registrations.values()).flatMap(
      (r) => r.navigation ?? []
    );

    // Merge navigation groups with the same id
    const mergedMap = new Map<string, NavigationGroup>();

    for (const nav of allNav) {
      const existing = mergedMap.get(nav.id);
      if (existing) {
        // Merge items from same group
        existing.items = [...existing.items, ...nav.items];
      } else {
        mergedMap.set(nav.id, { ...nav, items: [...nav.items] });
      }
    }

    return Array.from(mergedMap.values()).sort((a, b) => a.order - b.order);
  }

  getAllDialogs(): Map<string, DialogDefinition> {
    const dialogs = new Map<string, DialogDefinition>();
    for (const reg of this.registrations.values()) {
      for (const dialog of reg.dialogs ?? []) {
        dialogs.set(dialog.id, dialog);
      }
    }
    return dialogs;
  }

  getDialog(id: string): DialogDefinition | undefined {
    for (const reg of this.registrations.values()) {
      const dialog = reg.dialogs?.find((d) => d.id === id);
      if (dialog) return dialog;
    }
    return undefined;
  }
}

export const mfeRegistry = new MFERegistry();
