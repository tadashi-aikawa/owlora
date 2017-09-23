import * as React from "react";
import * as _ from "lodash";
import { Dictionary } from "lodash";
import { DragSource, DropTarget } from "react-dnd";
import ImageOrEmoji from "./ImageOrEmoji";
import { Icon } from "semantic-ui-react";
import { Component } from "react";

export interface IconFilterState {
    bulkFilterDisabled: boolean;
}

export interface IconFilterProps {
    icons: string[];
    iconDisabledMap: Dictionary<boolean>;
    onChangeIconDisabledMap: (iconDisabledMap: Dictionary<boolean>) => void;
}

export default class extends Component<IconFilterProps, IconFilterState> {
    state = {
        bulkFilterDisabled: false
    };

    render() {
        return (
            <div>
                <Icon
                    circular
                    inverted
                    name="filter"
                    color="orange"
                    size="large"
                    style={{ cursor: "pointer", opacity: this.state.bulkFilterDisabled ? 0.15 : 1.0 }}
                    onClick={() => {
                        this.props.onChangeIconDisabledMap(
                            _(this.props.icons)
                                .map(x => [x, !this.state.bulkFilterDisabled])
                                .fromPairs()
                                .value()
                        );
                        this.setState({ bulkFilterDisabled: !this.state.bulkFilterDisabled });
                    }}
                />
                {this.props.icons.map(icon => (
                    <div key={icon} style={{ display: "inline-block" }}>
                        <div
                            onClick={() =>
                                this.props.onChangeIconDisabledMap({
                                    ...this.props.iconDisabledMap,
                                    ...{ [icon]: !this.props.iconDisabledMap[icon] },
                                })}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: 4,
                                marginRight: 4,
                                marginTop: 2,
                                marginBottom: 2,
                                opacity: this.props.iconDisabledMap[icon] ? 0.15 : 1.0,
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ width: 28, height: 28 }}>
                                <ImageOrEmoji src={icon} style={{ width: "28px", height: "28px" }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}
