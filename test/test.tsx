import "./test.scss";
import * as React from 'react';
import { Button } from "semantic-ui-react";
import { render } from 'react-dom';

console.log("test");


class Test extends React.Component {
    render() {
        return <Button primary>Test</Button>
    }
}

render(<Test />, document.body);