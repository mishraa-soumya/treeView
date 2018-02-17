// Constructor function to create treeview
let obj = {id: "1", parent_id: null, name: "root", children: [{id: "2", parent_id: "1", name: "child1", children:[{id: "5", parent_id: "2", name: "child11"}]}, {id: "3", parent_id: "1", name: "child2", children:[{id: "4", parent_id: "3", name: "child21"},{id: "6", parent_id: "3", name: "child22"}]},{id: "7", parent_id: "1", name: "child3", children: [{id: "8", parent_id: "7", name: "child31"}]}]}; //Object.assign({}, jsonObj);
/**
 * 
 * @param {*} id int
 * @param {*} parentId int or null for root element
 * @param {*} name name of each node
 * @param {*} children an array of object
 */
function TreeView (id,parentId,name,children) {
    this.id = id;
    this.parent_id = parentId;
    this.name = name;
    this.children = children;
}

/** 
 * @name: printTree
 * @description: To print a tree structure from object, this method is defined on the prototype  
*/
TreeView.prototype.printTree = function() {
    
    var rootElem = document.getElementById('root');
    var parentElem;
    var children = true;
    
        var divElem = document.createElement('div');
        // check if it is a child element or not
        if(this.parent_id == null) {
            var lblElem = document.createElement('label');
            lblElem.innerText = this.name;
            divElem.appendChild(lblElem);
            divElem.id = this.id;
            if(this.children){
                divElem.classList.add('root');
            }
            rootElem.appendChild(divElem);
        }else{
            var parentId = this.parent_id;
            var parentElem = document.getElementById(parentId);
            var childElem  = document.createElement('div');
            childElem.id   = this.id;
            childElem.innerText = this.name;
            if(this.children && this.children.length > 0) {
                childElem.classList.add('parent');
            }else{
                childElem.classList.add('child');
            }
            childElem.setAttribute('draggable', true);
            childElem.addEventListener('dragstart', handleDragStart ,false);

            if(parentElem !== null) {
                parentElem.appendChild(childElem);
                parentElem.addEventListener('dragover', handleOnDragOver,false);
                parentElem.addEventListener('drop',handleOnDrop,false); 

                var ancestorId = parentElem.getAttribute('id');
                var parentOfParentElem = document.getElementById(ancestorId);
            }
            if(parentOfParentElem !== null){
                
            }else{
                rootElem.appendChild(parentElem);
            }
        }
        
        if(this.children && this.children.length > 0) {
            var treeChildren = this.children.length;
            for(var i = 0; i < treeChildren; i++) { 
                var childObj = new TreeView (this.children[i].id, this.children[i].parent_id, this.children[i].name, this.children[i].children);
                childObj.printTree();
            }
        }
}

function createTree() {
    let tree = new TreeView(obj.id, obj.parent_id, obj.name, obj.children);
    var printTreeName = tree.printTree();
    return printTreeName;
}


/** 
 * @name: searchTree
 * @description: To search in tree 
*/

function searchTree(){
    var searchValue = document.getElementById('searchBox').value;
    if(searchValue === ""){
        alert("Please enter a search value");
        return false;
    }else{
        getSearchResult(obj,searchValue);
    }
}

function getSearchResult(obj,searchTerm) {
    if(obj instanceof Array) {
        for(var i = 0; i < obj.length; i++) {
            getSearchResult(obj[i],searchTerm);
        }
    }
    else
    {
        for(var prop in obj) {
            if(prop == 'name') {
                // extract number from the search string
                let regex = new RegExp('^[0-9]+$');
                let onlyNumbers = searchTerm.match(/\d+/)[0];
                // match numbers in name 
                let str = obj[prop];
                let strMatch = str.match(onlyNumbers);
                
                if(strMatch){
                    document.getElementById(obj['id']).style.backgroundColor = '#8c765a';
                }else{
                    document.getElementById(obj['id']).style.backgroundColor = '#fff';
                }
            }
            if(obj[prop] instanceof Object || obj[prop] instanceof Array) {
                getSearchResult(obj[prop],searchTerm);
            } 
        }
    }
}

function handleDragStart(event) {
    let draggedElemParent = document.getElementById(event.target.id).parentElement;
    if(draggedElemParent !== null){
        let parentElem = draggedElemParent;
        // To check if there is any other child for the parent or not
        if(parentElem !== null && parentElem.children.length <= 1){
            if(parentElem.classList.contains('parent')){
                parentElem.classList.remove('parent');
            }
            parentElem.classList.add('child');
        }
    }
    event.dataTransfer.setData("text", event.target.id);
}

function handleOnDragOver(event){
    event.preventDefault();
    return false;
}

function handleOnDrop(event){
    event.preventDefault();
    var data = event.dataTransfer.getData('text');
    event.target.appendChild(document.getElementById(data));
    if(event.target.classList.contains('child')){
        event.target.classList.remove("child");
        event.target.classList.add("parent");
    }else{
        let droppedElem = document.getElementById(data);
        if(droppedElem.classList.contains('parent')){
            droppedElem.classList.remove("child");
            droppedElem.classList.add("parent"); 
        }
    }
    
} 