
const reqEvent = (event) => require(`../events/${event}`);
module.exports = client => {
  client.on('ready', () => reqEvent('ready')(client));
  client.on('error', (error) => reqEvent('error')(client,error));
  //client.on('message', reqEvent('message'));
  //client.on('guildMemberAdd', reqEvent('guildMemberAdd'));
  //client.on('userUpdate', reqEvent('userUpdate'));
  //client.on('channelDelete', reqEvent('channelDelete'));
  
  require('fs').readdir("/app/events/","utf8",(err,files) => {
    files.forEach(file => {
      if (!file.endsWith(".js")) return
      if (["ready.js","error.js"].some(i => i == file)) return
      client.on(file.replace(".js",""), reqEvent(file));
    })
  })
};
 