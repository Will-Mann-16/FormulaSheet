import React from "react";
import _ from "lodash";
import { InlineMath, BlockMath } from 'react-katex';

export const Formula = (props) => {
  return props.inline ? (
      <InlineMath math={props.children} />
  ) : (
    <BlockMath math={props.children} />
  )
}
export const convertToTex = (text) => {
  return text !== '' && text !== null && text !== undefined ? text.split("$$").map((line, key) => {
    return key % 2 == 1 ? (<Formula key={key}>{line}</Formula>) : line.split("$").map((middle, key2) => {
      return key2 % 2 == 1 ? (<Formula key={key2} inline>{middle}</Formula>) : middle;
    });
  }) : text;
}
export const toTitleCase = (str) => {
    return str ? _.startCase(str) : null;
}
export const PRIMARY_COLOUR = 'violet';
export const SECONDARY_COLOUR = 'purple';
export const TERTIARY_COLOUR = 'pink';
export const EASY_COLOUR = 'green';
export const MEDIUM_COLOUR = 'blue';
export const HARD_COLOUR = 'red';
export const EXTENSION_COLOUR= 'black';
export const DIFFICULTY_DROPDOWN = [{
    text: 'Easy',
    value: 'EASY',
    label: {color: EASY_COLOUR, empty: true, circular: true}
},
    {
        text: 'Medium',
        value: 'MEDIUM',
        label: {color: MEDIUM_COLOUR, empty: true, circular: true}
    },
    {
        text: 'Hard',
        value: 'HARD',
        label: {color: HARD_COLOUR, empty: true, circular: true}
    }, {
        text: 'Extension',
        value: 'EXTENSION',
        label: {color: EXTENSION_COLOUR, empty: true, circular: true}
    }];
export const getColourFromDifficulty = (difficulty) => {
    switch(difficulty) {
        case 'EASY':
            return EASY_COLOUR;
        case 'MEDIUM':
            return MEDIUM_COLOUR;
        case 'HARD':
            return HARD_COLOUR;
        case 'EXTENSION':
            return EXTENSION_COLOUR;
        default:
            return null;
    }
}