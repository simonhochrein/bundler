import * as React from "react";
import "./index.scss";
import { IOption, IOptionType } from "../src/Types";

class App extends React.Component<any, { groups: { [key: string]: (IOption & { Value: any })[] } }> {
    constructor(Props) {
        super(Props);
        this.state = {
            groups: {}
        };
    }
    renderOption(Option: IOption & { Value: any }) {
        switch (Option.Type) {
            case IOptionType.String:
                return (
                    <>
                        <label>{Option.ID} {Option.Name}</label>
                        <input value={Option.Value ? Option.Value : Option.Default} name={Option.ID} onChange={this.onChange} />
                    </>
                );
            case IOptionType.Number:
                return (
                    <>
                        <label>{Option.ID} {Option.Name}</label>
                        <input value={Option.Value ? Option.Value : Option.Default} type="number" name={Option.ID} onChange={this.onChange} />
                    </>
                );
            case IOptionType.Boolean:
                return (
                    <>
                        <label>{Option.Name}</label>
                        <input checked={Option.Value} type="checkbox" name={Option.ID} onChange={this.onChange} />
                    </>
                );
            case IOptionType.Array:
                return (
                    <>
                        <select multiple onChange={this.onChange} name={Option.ID} value={Option.Value}>
                            {Option.Options.map((Name, Key) => (
                                <option key={Key}>{Name}</option>
                            ))}
                        </select>
                    </>
                );
        }
    }
    render() {
        return (
            <ul>
                {Object.keys(this.state.groups).map((Name, Key1) => (
                    <li key={Key1}>
                        <h1>{Name}</h1>
                        <ul>
                            {this.state.groups[Name].map((Option, Key2) => (
                                <li key={Key2}>
                                    {this.renderOption(Option)}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        );
    }
    onChange = async (ChangeEvent) => {
        ChangeEvent.stopPropagation();
        if ("checked" in ChangeEvent.target) {
            this.processOptions(await (await fetch("/options/" + ChangeEvent.target.name + "/" + ChangeEvent.target.checked, { method: "POST" })).json());
        } else if ("selectedOptions" in ChangeEvent.target) {
            this.processOptions(await (await fetch("/options/" + ChangeEvent.target.name + "/" + encodeURIComponent(JSON.stringify(Array.from(ChangeEvent.target.selectedOptions).map((Option: HTMLOptionElement) => Option.text))), { method: "POST" })).json());
        } else {
            this.processOptions(await (await fetch("/options/" + ChangeEvent.target.name + "/" + ChangeEvent.target.value, { method: "POST" })).json());
        }
    }
    async componentDidMount() {
        var req = await fetch("/options");
        var res = await req.json() as (IOption & { Value: any })[];
        this.processOptions(res);
    }
    processOptions(Options) {
        var groups = {};
        for (var option of Options) {
            groups[option.ID.split(".")[0]] ? groups[option.ID.split(".")[0]].push(option) : groups[option.ID.split(".")[0]] = [option];
        }
        this.setState({ groups });
    }
}

require("react-dom").render(<App />, document.querySelector("#root"));