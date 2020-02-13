var NodeHelper = require("node_helper");
const anydo = require('anydo') // npm install anydo

function getAnyDo(module, config){
    var options = {
        email: config.user,
        password: config.password
    }

    anydo(options, (err, result) => {
        if (err) throw err
        
        // get the titles of all completed and uncompleted tasks
        var completedTasks = result.models.task.items.filter(function(obj) {
            return config.categoryID === obj.categoryId && obj.status === 'CHECKED';
        }).map(t => t.title);

        var uncompletedTasks = result.models.task.items.filter(function(obj) {
            return config.categoryID === obj.categoryId && obj.status === 'UNCHECKED';
        }).map(t => t.title);
        
        payload = {
            complete: completedTasks, 
            uncomplete: uncompletedTasks
        };

        module.sendSocketNotification(config.title, payload);
    });
}

module.exports = NodeHelper.create({

    socketNotificationReceived: function(notification, config) {
        
        if(notification == "REGISTER") {
            getAnyDo(this, config);

            var that = this;

            setInterval(function(){
                getAnyDo(that, config);
            }, config.frequency);
        }
    }
});
