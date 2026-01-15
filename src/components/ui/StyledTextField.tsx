import { BgColors, Button , TextField, styled } from "@revlab/highlander-ui";

export type TextFieldStyleProps = {
  fieldWidth?: number;
};

// this component is created just for test purpose to check how can we style our component , like passing border color , spacings etc.
export const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "fieldWidth",
})<TextFieldStyleProps>(({ theme, fieldWidth }) => ({
  flex: 1,
  "& .MuiFilledInput-root": {
    borderRadius: `${theme.spacing(16)} 0 0 ${theme.spacing(16)}`,
    borderTop: `1px solid ${theme.palette.monochrome[300]}`,
    borderBottom: `1px solid ${theme.palette.monochrome[300]}`,
    borderLeft: `1px solid ${theme.palette.monochrome[300]}`,
    borderRight: "unset",
    backgroundColor: "transparent",

    // hover
    "&:hover": {
      borderTop: `1px solid ${theme.palette.primary.main}`,
      borderBottom: `1px solid ${theme.palette.primary.main}`,
      borderLeft: `1px solid ${theme.palette.primary.main}`,
    },

    // focused
    "&.Mui-focused": {
      borderTop: `1px solid ${theme.palette.primary}`,
      borderBottom: `1px solid ${theme.palette.primary}`,
      borderLeft: `1px solid ${theme.palette.primary}`,
    },

  },
  [theme.breakpoints.up("md")]: {
    "& .MuiInputBase-root": {
      width: fieldWidth,
    },
  },
}));




/*
theme.palette      // colors
theme.spacing      // spacing scale
theme.typography   // fonts
theme.shape        // border radius
theme.breakpoints  // responsive helpers
theme.zIndex       // stacking
theme.transitions  // animations


interface PaletteColor {
  main: string;
  light?: string;
  dark?: string;
  contrastText?: string;
}

interface Palette {
  primary: PaletteColor;
  secondary: PaletteColor;
  error: PaletteColor;
  warning: PaletteColor;
  info: PaletteColor;
  success: PaletteColor;
}
*/