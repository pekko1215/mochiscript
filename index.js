var esprima = require('esprima');
var escodegen = require('escodegen')
var estraverse = require('estraverse');
var jspacker = require('./jspacker.js')
var fs = require('fs')

var filename = process.argv[2];


var prog = fs.readFileSync(filename);
prog = prog.toString()

var varcount = Math.floor(Math.random() * 1000);
var shooterstr = "AＡАÅĀǍÀÂÃĄ"
        // var shooterstr = ""
var varlist = [];

var fromname = jspacker.makeVarName(varcount++, shooterstr)
var fromobj = esprima.parse(jspacker.makeCCC(fromname))

var obj = esprima.parse(prog)
var first = false;
estraverse.traverse(fromobj, {
        enter: function(node, parent) {
                // console.log(node)
                switch (node.type) {
                        case 'Literal':
                                switch (typeof node.value) {
                                        case 'number':
                                                node.type = "Identifier";
                                                node.name = jspacker.toBrackets(node.value);
                                                break;
                                }
                                break;
                        case 'FunctionExpression':
                                var vardata;
                                node.params.forEach(function(id, i) {
                                        var newName = jspacker.makeVarName(varcount++, shooterstr)
                                        varlist.push({
                                                name: id.name,
                                                newName: newName
                                        })
                                        node.params[i].name = newName;
                                })
                                break;
                        case 'VariableDeclarator':
                                var vardata;
                                if ((vardata = varlist.find(function(d) {
                                                return d.name == node.id.name
                                        }))) {} else {
                                        var newName = jspacker.makeVarName(varcount++, shooterstr)
                                        varlist.push({
                                                name: node.id.name,
                                                newName: newName
                                        })
                                }
                                break;
                        case 'FunctionDeclaration':
                                node.params.forEach(function(node) {
                                        var vardata;
                                        if ((vardata = varlist.find(function(d) {
                                                        return d.name == node.name
                                                }))) {} else {
                                                var newName = jspacker.makeVarName(varcount++, shooterstr)
                                                varlist.push({
                                                        name: node.name,
                                                        newName: newName
                                                })
                                        }
                                })
                                console.log(varlist)
                                break;
                        case 'Identifier':
                                var varindex;
                                if ((varindex = varlist.findIndex(function(d) {
                                                return d.name == node.name
                                        })) != -1) {
                                        node.name = varlist[varindex].newName;
                                }
                                break
                }
        }
})
estraverse.traverse(obj, {
        enter: function(node, parent) {
                switch (node.type) {
                        case 'Literal':
                                switch (typeof node.value) {
                                        case 'number':
                                                node.type = "Identifier";
                                                node.name = jspacker.toBrackets(node.value);
                                                break;
                                        case 'string':
                                                node.type = "Identifier";
                                                node.name = jspacker.shooter(node.value, fromname);
                                                break;
                                }
                                break;
                        case 'FunctionExpression':
                                var vardata;
                                node.params.forEach(function(id) {
                                        if ((vardata = varlist.find(function(d) {
                                                        return d.name == id.name
                                                }))) {} else {
                                                var newName = jspacker.makeVarName(varcount++, shooterstr)
                                                varlist.push({
                                                        name: id.name,
                                                        newName: newName
                                                })
                                        }
                                })
                                break;
                        case 'MemberExpression':
                                if (node.computed) {
                                        break
                                }
                                node.computed = true
                                node.property.name = "[" + jspacker.shooter(node.property.name, fromname) + "]"
                                break;
                        case 'FunctionDeclaration':
                        case 'VariableDeclarator':
                                var vardata;
                                if ((vardata = varlist.find(function(d) {
                                                return d.name == node.id.name
                                        }))) {} else {
                                        var newName = jspacker.makeVarName(varcount++, shooterstr)
                                        varlist.push({
                                                name: node.id.name,
                                                newName: newName
                                        })
                                }
                                break;
                        case 'Identifier':
                                var varindex;
                                if ((varindex = varlist.findIndex(function(d) {
                                                return d.name == node.name
                                        })) != -1) {
                                        node.name = varlist[varindex].newName;
                                }
                                break
                }
        }
})

obj.body.splice(Math.floor(Math.random() * obj.body.length), 0, fromobj.body[0])
var option = {
        format: {
                indent: {
                        style: '',
                        base: 0,
                },
                newline: '',
                space: ''
        }
}

if (process.argv[3]) {
        fs.writeFileSync(process.argv[3], escodegen.generate(obj, option));
} else {
        console.log(escodegen.generate(obj, option))
}
