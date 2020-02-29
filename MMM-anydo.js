function generateEntry(entry, useCheckboxes, isCompleted){
    if(useCheckboxes){
        var listItem = isCompleted ? '<i class="far fa-check-square"></i> ' : '<i class="far fa-square"></i> ';
        return listItem + entry + '<br>';
    }
    else{
        return '<li>' + entry + '</li>';
    }
}

function generateList(content, showCompleted, useCheckboxes){
    if(content === undefined){
        return "Loading...";
    }

    var myList = useCheckboxes ? '' : '<ul>';
    for(entry of content.uncomplete){
        myList += generateEntry(entry, useCheckboxes, false);
    }

    if(showCompleted){
        for(entry of content.complete){
            myList += generateEntry(entry, useCheckboxes, true);
        }
    }

    myList += useCheckboxes ? '' : '</ul>';
    return myList;
}

Module.register("MMM-anydo",{
    defaults: {
        title: "Title",
        categoryID: "Your Any.do Category ID",
        user: "username",
        password: "password",
        showCompleted: true,
        useCheckboxes: true,
        frequency: 60000 // 1 minute
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        var titleP = document.createElement("p");
        titleP.classList.add("medium");
        titleP.classList.add("align-left");
        titleP.classList.add("anydo-title");
        titleP.innerHTML = this.config.title;

        wrapper.appendChild(titleP);
    	wrapper.appendChild(document.createElement("hr"));

        var listP = document.createElement("p");
        listP.classList.add("small");
        listP.classList.add("bright");
        listP.classList.add("align-left");
        listP.classList.add("anydo-listitem");

        listP.innerHTML = generateList(this.myContent, this.config.showCompleted, this.config.useCheckboxes);
        wrapper.appendChild(listP);

        return wrapper;
    },
    
    getStyles: function () {
		return ["mmm-anydo.css", "font-awesome.css"];
    },
    
    start: function() {
        Log.info(this.name + " Starting up");
        this.sendSocketNotification("REGISTER", this.config);
    },
    
    socketNotificationReceived: function(notification, payload) {
        //Log.log(this.name + " received a socket notification: " + notification + " - Completed: " + completedTasks + " Uncompleted: " + uncompletedTasks);
        if(notification == this.config.title){
            this.myContent = payload;
            this.updateDom();
        }
    }
});
