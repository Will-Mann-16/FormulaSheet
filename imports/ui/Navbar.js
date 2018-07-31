import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";

export default class Navbar extends React.Component{
  render(){
    return(
      <Menu>
        <Menu.Item name='home' as={NavLink} to='/' exact />
        <Menu.Item name='questions' as={NavLink} to='/questions' exact />
        <Menu.Item name='equations' as={NavLink} to='/equations' exact />
      </Menu>
    );
  }
}
