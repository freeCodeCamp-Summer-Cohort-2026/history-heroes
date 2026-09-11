// Goal of this file is to recieve the fetch data from ModuleCatalogPage and render it
// Imports Here
import ModuleSummary from "./model/ModuleSummary.ts";

// Recieves modules and onModuleSelect 
// Then defines varaibles 
type ModuleCatalogProps = {
    modules: ModuleSummary[];
    onModuleSelect: (id: string) => void
}

// Recieves the props object
// Loops though the props object and makes a list
// Use those values than return JSX that should appear 
// Calls when clicked
function ModuleCatalog(props: ModuleCatalogProps) {
    const listModules = props.modules.map(oneModule => 
    <li key={oneModule.id}>
        <h2>{oneModule.title}</h2>
        <p>{oneModule.description}</p>
        <button onClick={props.onModuleSelect}>
             Start Learning!
        </button>
        </li>)
    return (
        <ul>
            {listModules}
        </ul>
    );
}

