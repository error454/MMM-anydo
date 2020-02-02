var NodeHelper = require("node_helper");
const anydo = require('anydo') // npm install anydo

function getAnyDo(module, config){
    var options = {
        email: config.user,
        password: config.password
    }

    anydo(options, (err, result) => {
        if (err) throw err
        
        // get the titles of all your tasks
        var tasks = result.models.task.items.filter(function(obj) {
            return config.categoryID === obj.categoryId;
        }).map(t => t.title);
        
        module.sendSocketNotification(config.title, tasks);
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
