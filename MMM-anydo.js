function generateList(content){
    var myList = '<ul>';
        
    for(entry of content){
        myList += '<li>' + entry + '</li>';
    }
    myList += '</ul>';
    return myList;
}

Module.register("MMM-anydo",{
    defaults: {
        title: "Title",
        categoryID: "Your Any.do Category ID",
        user: "username",
        password: "password",
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

        var listP = document.createElement("p");
        listP.classList.add("small");
        listP.classList.add("bright");
        listP.classList.add("align-left");

        listP.innerHTML = generateList(this.myContent);
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
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        if(notification == this.config.title){
            this.myContent = payload;
            this.updateDom();
        }
    }
});
