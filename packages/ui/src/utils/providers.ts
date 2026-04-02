import type {
  LoadSettingsType,
  ReplayProviderEnum,
  ReplaySettings,
} from "shared";

export type IProviderAttribs = {
  interface: {
    available: boolean;
    mandatory: boolean;
  };
  srcipmap: {
    available: boolean;
  };
  load: {
    allowed: LoadSettingsType[];
  };
};

export const providerAttribs = {
  tcpreplay: {
    interface: {
      available: true,
      mandatory: true,
    },
    srcipmap: {
      available: true,
    },
    load: {
      allowed: ["mbps", "pps", "multiplier"],
    },
  },
  udpreplay: {
    interface: {
      available: true,
      mandatory: false,
    },
    srcipmap: {
      available: false,
    },
    load: {
      allowed: ["multiplier"],
    },
  },
} as const satisfies Record<ReplayProviderEnum, IProviderAttribs>;

type HasSrcRemap = {
  [K in keyof typeof providerAttribs]: (typeof providerAttribs)[K]["srcipmap"]["available"] extends true
    ? K
    : never;
}[keyof typeof providerAttribs];

export function hasSrcRemap(
  settings: ReplaySettings,
): settings is Extract<ReplaySettings, { provider: HasSrcRemap }> {
  return providerAttribs[settings.provider].srcipmap.available;
}
