import React from 'react';
import { Icon } from 'semantic-ui-react';

import './index.scss';

export default () => {
    return (
        <footer>
            <p>
                &copy; 2017 <a href="https://socialgorithm.org">#Socialgorithm</a>. All Rights Reserved.
                Help us spread the <Icon name='heart' /> for tech!
            </p>
        </footer>
    );
};