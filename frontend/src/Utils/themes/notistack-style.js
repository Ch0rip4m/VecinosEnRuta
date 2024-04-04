import styled from "@mui/material/styles/styled"
import { MaterialDesignContent } from "notistack"
import { colors } from "./colors"


export const notistackStyledComponent = () => {
    const fontStyles = {
      fontFamily: "sans-serif",
      // fontWeight: 'bold',
    }
  
    const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
      "&.notistack-MuiContent-default": {
        ...fontStyles,
        backgroundColor: colors.blue_gtd,
      },
      "&.notistack-MuiContent-success": {
        ...fontStyles,
        backgroundColor: colors.green_gtd,
      },
      "&.notistack-MuiContent-error": {
        ...fontStyles,
        backgroundColor: colors.red_gtd,
      },
      "&.notistack-MuiContent-warning": {
        ...fontStyles,
        backgroundColor: colors.orange_gtd,
      },
      "&.notistack-MuiContent-info": {
        ...fontStyles,
        backgroundColor: colors.lightblue_gtd,
      },
    }))
  
    return {
      default: StyledMaterialDesignContent,
      success: StyledMaterialDesignContent,
      error: StyledMaterialDesignContent,
      warning: StyledMaterialDesignContent,
      info: StyledMaterialDesignContent,
    }
  }
  