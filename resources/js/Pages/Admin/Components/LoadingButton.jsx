import {Button, CircularProgress} from "@mui/material";
import React from "react";

const LoadingButton = ({loading,children,...rest}) => {
  return <Button startIcon={loading?<CircularProgress />:null} {...rest}>
      {children}
  </Button>
}
export default LoadingButton
