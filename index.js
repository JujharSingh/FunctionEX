#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const mkdirp = require('mkdirp');

var source;
var world;

if(process.argv[2] == "i") {
    if(!process.argv[3]) {
        console.log("Please provide a function to install!")
    }
    source = process.argv[3];
    world = process.argv[4] || process.cwd();
}

if(process.argv[2] == "h" || process.argv[2] == "help") {
    console.log("Help:" + "\n" +
                "   fnex i <input> [folder] - installs the function tp the current folder" + "\n" +
                "   fnex h/help - show help")
}

if(source && target) {
    fs.readFile(source, 'utf-8', function(err, data) {
        if (err) throw err;

        var author;
        var project;
        var files = {};

        var array = data.toString().split("\n");

        if(data.toString().includes("\r")) {
            array = data.toString().split("\r\n");
        }
        
        var scanningfunc;
        var scanning = false;
        
        for(line in array) {
            line = array[line];
            if(scanning == true) {
                if(line.startsWith("}")) {
                    scanning = false;
                } else {
                    formattedline = line.trim().replace("//", "#") + "\n";
                    files[scanningfunc] = files[scanningfunc] + formattedline;
                }
            } else if(line.startsWith("@")) {
                var propertyarray = line.split(" ");
                if(propertyarray[0] == "@author") {
                    author = propertyarray[1];
                    
                } else if(propertyarray[0] == "@project") {
                    project = propertyarray[1];
                }
            } else if(line.startsWith("$func")) {
                var functionarray = line.split(" ").splice(1);
                scanningfunc = functionarray[0];
                files[scanningfunc] = "";
                scanning = true;
            }
        }

        if(author && project) {
            mkdirp(path.join(process.cwd(), author.toString(), project.toString()), function (err) {
                for(filename in files) {
                    if (err) throw err;

                    fs.writeFile(path.join(process.cwd(), author.toString(), project.toString(), filename.toString()+".mcfunction"), files[filename], function(err) {
                        if (err) throw err;

                        console.log("Successfully wrote to "+path.join(process.cwd(), author, project, filename+".mcfunction"));
                    })
                }
            });
        }
    });
}