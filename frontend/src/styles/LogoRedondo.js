import React from 'react';
import { Avatar } from '@mui/material';
import MiSVG from './logoRedondo.svg';

function LogoRedondoVER(props) {
    return (
      <Avatar src={MiSVG} alt="logo redondo VER" sx={{width: props.width ,height: props.height}}/>
    );
}

export default LogoRedondoVER;
