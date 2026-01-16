import {  Typography, styled } from "@revlab/highlander-ui";

export const StyleWhiteTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
    // color : theme.palette.secondary.main
}));


export const StylePrimaryTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark
}));


// export const StylePrimaryTypography = styled(Typography)(({ theme }) => {
//   console.log("MUIThemeobject:", typeof theme); // 👈 log the theme

//   return {
//     color: theme.palette.primary.dark,
//   };
// });


export const StyleGrayTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[800],
}));
