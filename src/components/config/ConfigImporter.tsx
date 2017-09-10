import * as React from "react";
import { PureComponent } from "react";
import { Button, Message, TextArea } from "semantic-ui-react";
import { version } from "../../../package.json";

interface ConfigImporterState {
    str: string;
    err?: string;
}

interface ConfigImporterProps {
    config: Object;
    onImport: (config: Object) => void;
}

export default class extends PureComponent<ConfigImporterProps, ConfigImporterState> {
    state: ConfigImporterState = {
        str: JSON.stringify(this.props.config),
    };

    render() {
        return (
            <div>
                <Button
                    icon="arrow circle outline down"
                    content="Import"
                    style={{ margin: 5 }}
                    onClick={() => {
                        try {
                            const parsed = JSON.parse(this.state.str);
                            this.props.onImport(parsed);
                            this.setState({ err: undefined });
                        } catch (e) {
                            this.setState({ err: e.toString() });
                        }
                    }}
                />
                {this.state.err && <Message error>{this.state.err}</Message>}
                <TextArea
                    autoHeight
                    value={this.state.str}
                    style={{ width: "100%" }}
                    onChange={(e, { name, value }) => this.setState({ str: value || "" })}
                />
            </div>
        );
    }
}
