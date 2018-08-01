import React, { Fragment } from "react";
import {
  Loader,
  Grid,
  List,
  Segment,
} from "semantic-ui-react";

import Brackets from './Brackets';

export default (props) => {
    return (
        <div>
            <h2>Bracket</h2>
            <Brackets
                stats={ props.tournament }
            />
        </div>
    );
};
