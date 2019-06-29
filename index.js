const url = "https://flipkart-configuration-table.now.sh/api";

let configs = [];
fetch(url)
.then((res) =>res.json())
.then((res) => {
    configs = res.config;
    this.createTableRows(configs);
});


createTableRows = (configs) => {

    let table = document.getElementById("table-body");
    table.innerHTML = "";
    let count = 0;
    configs.map((config) => {

        let row = document.createElement('div');
        count++;
        if(count%2 === 0)
        row.setAttribute('class','row white');
        else
        row.setAttribute('class','row grey');

        let labelDiv = document.createElement('div');

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox'
        checkbox.checked = config.selected;
        checkbox.onclick = () => this.onLabelClick(config.key)
        labelDiv.appendChild(checkbox);
        let label = document.createElement('div');
        label.innerText = config.label;
        labelDiv.appendChild(label);

        labelDiv.setAttribute('class','label-div');

        row.appendChild(labelDiv);



        if(config.field.type === 'text'){
            let field = document.createElement('input');
            field.value = config.field.defaultValue;
            if(!config.selected)
            field.disabled = true;
            field.onkeydown = () => this.onOptionChange(config.key,event.target.value);
            field.onkeyup = () => this.onOptionChange(config.key,event.target.value);

            row.append(field);
        }

        if(config.field.type === "select"){
            let field = document.createElement('select');
            if(!config.selected)
            field.disabled = true;
            config.field.options.map((option) => {
                let opt = document.createElement('option');
                opt.appendChild(document.createTextNode(option));
                opt.value = option;
                onchange = () => this.onOptionChange(config.key,event.target.value)
                if(config.field.defaultValue === option)
                opt.selected = true;
                field.appendChild(opt);
            })
            row.append(field)
        }

        
        
        let description = document.createElement('div');
        description.innerText = config.description;
        row.appendChild(description);

        


        table.appendChild(row);
    })
}


onOptionChange = (key,value) => {
    setTimeout(() => {
        for(var objKey of configs){
            if(key === objKey.key){
                objKey.field.defaultValue = value
            }
        }
        
    },10)

}

onLabelClick = (key) => {
   for(var objKey of configs){
        if(key === objKey.key){
            objKey.selected = !objKey.selected
        }  
    }
    this.createTableRows(configs);
}

onSearchPress = () => {
    let finalOutput = [];
    let text = document.getElementById('search-bar').value;

    finalOutput = configs.filter((config) => {
        if (config.label.includes(text) || config.description.includes(text)){
            return config;
        }
    })

    this.createTableRows(finalOutput);
}

showSelected = () => {
    let showSelected = document.getElementById('show-selected');
    if(showSelected.checked === true){
        let finalOutput = configs.filter((config) => {
            if (config.selected){
                return config;
            }
        })


        this.createTableRows(finalOutput);
    }else{
        this.createTableRows(configs);
    }
}

onDoneClick = () => {
    let finalObj = {};
    for(var key of configs){
        if(key.selected){
            finalObj[key.key] = key.field.defaultValue;

        }
    }

    console.log(finalObj);
}