//Looping all lists onload
function loopLists(){
    lists = JSON.parse(sessionStorage.getItem("list"));
    
    var printingAllLists = "";
    for(var i = 0; i < lists.length; i++){
        var listLength = lists[i].List.length;
        var thisTitle = lists[i].Title;
        var thisList = "<ul id='list" + i + "'>";
        var date = lists[i].PrettyDate;

        for(var j = 0; j < listLength; j++){
            thisList += "<li class='listItem unChecked'><button class='check' onclick='check(" + i + ", " + j +")'><i class='icon far fa-square'></i></button>" + lists[i].List[j].Item + " <button class='remove' onclick='remove(" + i + ", " + j +")'><i class='fas fa-times'></i></button></li>";       
        }
        thisList += "</ul>";
        printingAllLists += "<div class='col'>" + "<h2 id='title" + i + "' class='unChecked'>" + thisTitle + "</h2> <button class='trash' onclick='remove(" + i + ")'><i class='fas fa-trash-alt'></i></button>" + thisList + "<p class='listDate'>" + date + "</p></div>";
        document.getElementById("allTheLists").innerHTML = printingAllLists;
    }

    for(var i = 0; i < lists.length; i++){
        var listId = document.getElementById("list" + i);
        var listLength = lists[i].List.length;
        var title = document.getElementById("title" + i);

        //Checks if list is done or not, and changes heading accordingly
        if(lists[i].Status === true){
            title.className = title.className.replace("unChecked", "checked");
        }else if(lists[i].Status === false) {
            title.className = title.className.replace("checked", "unChecked");
        }

        for(var j = 0; j < listLength; j++){
            var check = listId.getElementsByClassName("icon")[j];
            var listItem = listId.getElementsByClassName("listItem")[j];

            //Checks if list item is done or not, and changes icon accordingly
            if(lists[i].List[j].Status === true){
                check.className = check.className.replace("far fa-square", "fas fa-check");
                listItem.className = listItem.className.replace("unChecked", "checked");
                	
            }else if(lists[i].List[j].Status === false){
                check.className = check.className.replace("fas fa-check", "far fa-square");
                listItem.className = listItem.className.replace("checked", "unChecked");             	
            }
        }
    }
}

//Creating two lists on load
function init(){
	var lists = sessionStorage.getItem("list");

	if(lists === null){
		myFirstList = new ToDoList("My first list", ["Shop", "Tidy", "Floss"]);
		mySecondList = new ToDoList("My second list", ["Shop", "Tidy"]);
		
        lists = [myFirstList, mySecondList];
        sessionStorage.setItem("list", JSON.stringify(lists));
        lists = JSON.parse(sessionStorage.getItem("list"));
    }else{
        lists = JSON.parse(sessionStorage.getItem("list"));
    }
}

//Create the objects 
function ToDoList(listTitle, list){
    var objectList = [];
    for(i = 0; i < list.length; i++){
        objectList.push(list[i] = new ListItem(list[i]));
    }

    //Creating a list title from the date if title is empty
    if(listTitle === ""){
        listTitle = moment().format('MMM Do');
    }

    this.Title = listTitle;
    this.Status = false;
    this.List = objectList;
    this.PrettyDate = moment().format('MMMM DD YYYY, HH:mm');
    this.Date = Date.now();

    function ListItem(item){
        this.Item = item;
        this.Status = false;
    }
}

function check(x, y){
    
    var thisList = document.getElementById("list" + x);
    var check = thisList.getElementsByClassName("icon")[y];
    var listItem = thisList.getElementsByClassName("listItem")[y];
	var title = document.getElementById("title" + x);

    if(lists[x].List[y].Status === false){
        check.className = check.className.replace("far fa-square", "fas fa-check");
		listItem.className = listItem.className.replace("unChecked", "checked");
		lists[x].List[y].Status = true;
		sessionStorage.setItem("list", JSON.stringify(lists));
    }else if(lists[x].List[y].Status === true){
        check.className = check.className.replace("fas fa-check", "far fa-square");
		listItem.className = listItem.className.replace("checked", "unChecked");
		lists[x].List[y].Status = false;
		sessionStorage.setItem("list", JSON.stringify(lists));
	}

    //Checking if entire list is done and change CSS class accordingly
    var checkCount = 0;
	var listLength = lists[x].List.length;
    for(var i = 0; i < (lists[x].List).length; i++){
        
        if(lists[x].List[i].Status === true){
            checkCount += 1;        
        }
    }

    if(checkCount === listLength){
        title.className = title.className.replace("unChecked", "checked");
        lists[x].Status = true;
        sessionStorage.setItem("list", JSON.stringify(lists));
    } else {
        title.className = title.className.replace("checked", "unChecked");
        lists[x].Status = false;
        sessionStorage.setItem("list", JSON.stringify(lists));
    }
}

//Adds a row in the form
function addRow(event){
    event.preventDefault();

    var form = document.getElementById("newList");
    var numberOfItems = form.getElementsByClassName("listItem");
    var div = document.getElementById("listContainer");
    var inputIndex = numberOfItems.length;

    var node = document.createElement("I");
    node.className = "fas fa-circle";
    var input = document.createElement("input");
    input.type = "text";
    input.name = "item" + inputIndex;
    input.className = "listItem";
    var br = document.createElement("br");
    div.appendChild(node);
    div.appendChild(input);
    div.appendChild(br);

    return false;
}

//Creates a new list from the form
function formList(){
	var form = document.getElementById("newList");
    var formTitle = form.elements[0].value;
    var formList = [];
    var emptyListSpot = 0;
    var listLength = form.length-2;

    for(var i = 1; i < (form.length)-1; i++){
        if(!form.elements[i].value.match(/[a-öA-Ö0-9-!@#$^_:,.]/)){
            emptyListSpot += 1;            
        }else if(form.elements[i].value.match(/[a-öA-Ö0-9-!@#$^_:,.]/)){
            formList.push(form.elements[i].value);
        }
    }

    if (listLength === emptyListSpot){
        alert("Your list is empty!");
    }else{
        lists = JSON.parse(sessionStorage.getItem("list"));
        lists.push(formTitle = new ToDoList(formTitle, formList));
        sessionStorage.setItem("list", JSON.stringify(lists));
        location.reload();	
    }
}

//Removes list or list item
function remove(thisList, thisItem){
    var confirmCancel = confirm("Are you sure you want to delete this?");

	if(confirmCancel === true && thisItem === undefined){
        lists.splice(thisList, 1);
		sessionStorage.setItem("list", JSON.stringify(lists));
		loopLists();	
	}else if(confirmCancel === true && typeof thisItem === "number"){
        lists[thisList].List.splice(thisItem, 1);
            if(lists[thisList].List.length === 0){
                lists.splice(thisList, 1);
            }
		sessionStorage.setItem("list", JSON.stringify(lists));
		loopLists();
	}
}

function sort(type){
    var last = (lists.length)-1;

    //Sort by alphabet
    if(type === "alphabet"){
        let buttonId = document.getElementById("alphabet");
        let sortIcon = buttonId.getElementsByClassName("fas")[0];

        if(lists[0].Title < lists[last].Title){
            lists.sort(function(a, b){
                var x = a.Title.toLowerCase();
                var y = b.Title.toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;
            });
            sortIcon.className = "fas fa-sort-alpha-down"; 
            sessionStorage.setItem("list", JSON.stringify(lists));
            loopLists();

        }else{
            lists.reverse(function(a, b){
                var x = a.Title.toLowerCase();
                var y = b.Title.toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;
            });
            sortIcon.className = "fas fa-sort-alpha-up"; 
            sessionStorage.setItem("list", JSON.stringify(lists));
            loopLists();
        }  

    //Sort by date  
    }else if(type === "date"){
        let buttonId = document.getElementById("date");
        let sortIcon = buttonId.getElementsByClassName("fas")[0];

        if(lists[0].Date > lists[last].Date){
            lists.sort(function(a, b){return a.Date - b.Date});
            sortIcon.className = "fas fa-sort-numeric-down"; 
            sessionStorage.setItem("list", JSON.stringify(lists));
            loopLists();
        }else if(lists[0].Date < lists[last].Date){
            lists.reverse(function(a, b){return a.Date - b.Date});
            sortIcon.className = "fas fa-sort-numeric-up"; 
            sessionStorage.setItem("list", JSON.stringify(lists));
            loopLists();
        }

    //Sort by number of list items
    }else if(type === "number"){
        let buttonId = document.getElementById("number");
        let sortIcon = buttonId.getElementsByClassName("fas")[0];

        if(lists[0].List.length > lists[last].List.length){
            lists.sort(function(a, b){return a.List.length - b.List.length});
            sortIcon.className = "fas fa-sort-amount-up"; 
            sessionStorage.setItem("list", JSON.stringify(lists));
            loopLists();
        }else if(lists[0].List.length < lists[last].List.length){
            lists.reverse(function(a, b){return a.List.length - b.List.length});
            sortIcon.className = "fas fa-sort-amount-down"; 
            sessionStorage.setItem("list", JSON.stringify(lists));
            loopLists();
        }
    }
}