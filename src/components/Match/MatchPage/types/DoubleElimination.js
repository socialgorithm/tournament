import React from "react";

import Brackets from './Brackets';

export default (props) => {
    return (
        <div>
            <Brackets
                stats={ props.tournament }
            />
        </div>
    );
};
