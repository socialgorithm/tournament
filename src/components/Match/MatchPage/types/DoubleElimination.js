import React from "react";

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
