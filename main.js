const express = require('express');
const app = express();
const path = require('path');

const http= require('http').Server(app);
const port = process.env.PORT||3000;

// attached http server to the socket.io
const io= require('socket.io')(http);

let hashMap = new Map([
    ["Safety","\n        <ul>\n            <li>Update Notes</li>\n  "],
    ["Enviormental", "\n        <ul>\n            <li>Update Notes</li>\n  "],
    ["Quality", "\n        <ul>\n            <li>Update Notes</li>\n  "],
    ["ETP", "\n        <ul>\n            <li>Update Notes</li>\n  "],
    ["BOP", "\n        <ul>\n            <li>Update Notes</li>\n  "],
    ["RFP", "\n        <ul>\n            <li>Update Notes</li>\n  "],
    ["PM4", "\n        <ul>\n            <li>Update Notes</li>\n  "],
    ["Winder", "\n        <ul>\n            <li>Update Notes</li>\n  "],
    ["Automated_Warehouse", "\n        <ul>\n            <li>Update Notes</li>\n  "],
    ["MaintenanceEI", "\n        <ul>\n            <li>Update Notes</li>\n  "],
    ["op1to2", "\n        <ul>\n            <li>Update Notes</li>\n  "],
    ["op3to4", "\n        <ul>\n            <li>Update Notes</li>\n  "]
]);

function replacer(key, value) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: val
        ue: [...value]
      };
    } else {
      return value;
    }
  }

//route
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'src/index.html'))
})

// creat a new connection
io.on('connection',socket => {
    socket.emit("con", JSON.stringify(hashMap,replacer));
    console.log("A user connected");

    socket.on("disconnect", ()=>{
        console.log("a user disconnected")
    })

    //recives data from the client 
    socket.on('submission', (data)=> {
        //sends out data to all other users (using the broadcast feature)
        hashMap.set(data.object, data.data)
        socket.broadcast.emit('submission', (data));
    })

    //sends data to client
    socket.emit("server", "Receive From server");
})

http.listen(port, ()=> {
    console.log('App listening on port ' + port)
})
